/* runner.js — Motor de tandas: una tarea por pantalla, corrección, pistas,
   reintentos, guardado continuo y pantalla final.
   Modos:
   - 'practice': corrección inmediata, pistas, hasta 3 intentos (cuaderno, fichas, repaso)
   - 'train'   : examen de entrenamiento (igual que practice, la nota cuenta el 1.er intento)
   - 'real'    : examen real (sin pistas ni corrección hasta el final) */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var MAX_ATTEMPTS = 3;
  var PAUSE_AFTER = 15 * 60; // s

  function newState(opts) {
    return {
      key: opts.key, title: opts.title, mode: opts.mode || 'practice', route: opts.route || location.hash,
      ids: opts.items.map(function (it) { return it.id; }), idx: 0, results: {},
      runId: 'r' + Date.now().toString(36), started: Date.now(), pauseShown: false
    };
  }

  /**
   * opts: { key, runKey, title, items, mode, route, backHref, label,
   *         onFinish(state, items) (opcional, p. ej. exámenes), again() (opcional) }
   */
  function Runner(el, opts) {
    var data = EQ.store.data;
    var saved = opts.runKey && data.runs[opts.runKey];
    var resuming = !!(opts.resume && saved);
    var state = resuming ? saved : newState(opts);
    (opts.items || []).forEach(EQ.content.register);
    var items = resuming ? state.ids.map(EQ.content.item).filter(Boolean) : opts.items;
    if (!items.length) { el.appendChild(h('p', null, 'No hay ejercicios aquí todavía.')); return; }
    if (state.idx >= items.length) state.idx = items.length - 1;

    function persist() {
      if (!opts.runKey) return;
      data.runs[opts.runKey] = state;
      data.resume = { route: state.route.split('?')[0] + '?resume=1', label: opts.label || state.title, runKey: opts.runKey, ts: Date.now() };
      EQ.store.save();
    }
    function clearPersist() {
      if (!opts.runKey) return;
      delete data.runs[opts.runKey];
      if (data.resume && data.resume.runKey === opts.runKey) data.resume = null;
      EQ.store.save();
    }

    function result(id) { return state.results[id] || (state.results[id] = { attempts: 0, correct: false, firstCorrect: false, points: 0, kind: null, resp: null, usedHint: false, done: false }); }

    function top() {
      return h('div', { class: 'runner-top' },
        h('a', { class: 'btn secondary small', href: opts.backHref || '#/home', onclick: function () { EQ.speech.stop(); }, 'aria-label': 'Salir (se guarda tu progreso)' }, '✖ Salir'),
        EQ.ui.progressBar(state.idx + 1, items.length, 'Pregunta ' + (state.idx + 1) + ' de ' + items.length, (state.idx + 1) + ' de ' + items.length),
        h('button', { type: 'button', class: 'btn ghost small', onclick: restart, 'aria-label': 'Empezar de nuevo' }, '🔄'));
    }

    function restart() {
      EQ.ui.confirm('¿Empezar de nuevo?', 'Volverás a la primera pregunta. Lo que ya has aprendido se queda guardado.', 'Sí, empezar', 'No').then(function (yes) {
        if (!yes) return;
        clearPersist();
        if (opts.again) { opts.again(); return; }
        state = newState(opts);
        items = opts.items;
        render();
      });
    }

    function maybePause() {
      if (state.pauseShown || state.mode === 'real') return false;
      if (EQ.timer.activeSince(state.started) < PAUSE_AFTER) return false;
      state.pauseShown = true; persist();
      EQ.clear(el);
      el.appendChild(h('div', { class: 'runner' },
        h('div', { class: 'card pause-card stack' },
          EQ.ui.guide('¡Llevas un buen rato practicando! 🌟 ¿Quieres descansar un poco? Tu progreso está guardado y puedes seguir cuando quieras.', { autoRead: true }),
          h('div', { class: 'btn-row' },
            h('button', { type: 'button', class: 'btn', onclick: function () { render(); } }, '▶ Seguir un poco más'),
            h('a', { class: 'btn secondary', href: '#/home' }, '☕ Descansar (se guarda)')))));
      return true;
    }

    function render() {
      EQ.speech.stop();
      EQ.clear(el);
      var item = items[state.idx];
      var r = result(item.id);
      var wrap = h('div', { class: 'runner' });
      wrap.appendChild(top());

      // Cabecera de sección (exámenes)
      if (item.section && EQ.exams.SECTIONS[item.section]) {
        var prev = items[state.idx - 1];
        var sec = EQ.exams.SECTIONS[item.section];
        if (!prev || prev.section !== item.section || state.idx === 0) {
          wrap.appendChild(h('div', { class: 'section-banner' }, h('span', { class: 'section-title' }, 'Parte ' + sec.letter + ' · ' + sec.title)));
        } else {
          wrap.appendChild(h('div', { class: 'section-banner' }, h('span', { class: 'section-title' }, sec.letter + ' · ' + sec.title)));
        }
      }

      var card = h('div', { class: 'runner-card' });
      var instrText = EQ.exerciseInstruction(item);
      card.appendChild(h('div', { class: 'instr' }, EQ.speech.button(instrText, { lang: 'es', label: 'Leer la instrucción' }), h('div', { class: 'instr-text' }, instrText)));
      var area = h('div');
      card.appendChild(area);
      var hintBox = h('div');
      card.appendChild(hintBox);
      var actions = h('div', { class: 'ex-actions' });
      card.appendChild(actions);
      var fb = h('div');
      card.appendChild(fb);
      wrap.appendChild(card);
      el.appendChild(wrap);

      var checkBtn;
      var ctx = {
        changed: function () { if (checkBtn) checkBtn.disabled = ren.get() === null || ren.get() === ''; },
        submit: function () { if (checkBtn && !checkBtn.disabled) checkBtn.click(); },
        done: function (resp) { onCheck(resp); }
      };
      var ren = EQ.renderers[item.type](item, area, ctx);

      if (EQ.settings.get().autoRead) setTimeout(function () { if (item.type !== 'listen-choice' && item.type !== 'listen-write') EQ.speech.say(instrText, { lang: 'es' }); }, 250);

      function showHint() {
        if (!item.hint) return;
        r.usedHint = true; persist();
        EQ.clear(hintBox);
        hintBox.appendChild(h('div', { class: 'hint-box', role: 'note' }, item.hint));
      }

      function buttonsFor(stage) {
        EQ.clear(actions);
        if (stage === 'answer') {
          if (state.mode !== 'real' && item.hint) actions.appendChild(h('button', { type: 'button', class: 'btn secondary', onclick: showHint }, '💡 Pista'));
          if (ren.selfChecking) return;
          if (state.mode === 'real') {
            actions.appendChild(h('button', { type: 'button', class: 'btn ghost', onclick: function () { onCheck(null); } }, 'No lo sé, siguiente'));
            checkBtn = h('button', { type: 'button', class: 'btn exam', disabled: true, onclick: function () { onCheck(ren.get()); } }, 'Siguiente ▶');
          } else {
            checkBtn = h('button', { type: 'button', class: 'btn', disabled: true, onclick: function () { onCheck(ren.get()); } }, '✔ Comprobar');
          }
          actions.appendChild(checkBtn);
          ctx.changed();
        } else if (stage === 'retry') {
          if (item.hint && !r.usedHint) actions.appendChild(h('button', { type: 'button', class: 'btn secondary', onclick: function () { showHint(); this.remove(); } }, '💡 Pista'));
          var spellWord = isSpellItem(item) ? EQ.checker.spellTarget(item) : null;
          if (spellWord) actions.appendChild(EQ.speech.button(spellWord, { label: 'Escuchar la palabra', showLabel: 'Escuchar' }));
          actions.appendChild(h('button', { type: 'button', class: 'btn accent', onclick: function () {
            EQ.clear(fb); ren.retry(); buttonsFor('answer'); ren.focus();
          } }, '🔁 Intentar otra vez'));
        } else if (stage === 'next') {
          var last = state.idx >= items.length - 1;
          actions.appendChild(h('button', { type: 'button', class: 'btn', onclick: next }, last ? '🏁 Terminar' : 'Siguiente ▶'));
          setTimeout(function () { var b = actions.querySelector('.btn'); if (b) b.focus(); }, 50);
        }
      }

      function onCheck(resp) {
        var res = EQ.checker.check(item, resp);
        if (state.mode === 'real') {
          r.attempts = 1; r.resp = resp; r.kind = res.kind; r.correct = res.correct; r.firstCorrect = res.correct;
          r.points = res.correct ? 1 : (res.points || 0); r.done = true; r.typed = res.typed;
          EQ.srs.record(item, res, { attempt: 1, runId: state.runId });
          persist();
          next();
          return;
        }
        if (res.kind === 'empty') { EQ.ui.toast('Primero elige o escribe una respuesta 😊'); return; }
        if (ren.selfChecking) { // Unir parejas: ya se ha corregido pareja a pareja
          r.attempts = 1; r.done = true; r.correct = true; r.firstCorrect = res.correct; r.points = res.points; r.kind = res.kind;
          EQ.srs.record(item, res, { attempt: 1, runId: state.runId });
          EQ.clear(fb);
          fb.appendChild(EQ.feedback.render(item, resp, { correct: true, kind: 'ok' }, 'ok', res.correct ? 1 : 2));
          buttonsFor('next'); persist();
          return;
        }
        r.attempts++;
        var first = r.attempts === 1;
        if (first) { r.points = res.correct ? 1 : (res.points || 0); r.kind = res.kind; r.resp = resp; }
        EQ.srs.record(item, res, { attempt: r.attempts, runId: state.runId });
        ren.showResult(res);
        EQ.clear(fb);
        if (res.correct) {
          r.correct = true; r.firstCorrect = first; r.done = true;
          ren.lock();
          fb.appendChild(EQ.feedback.render(item, resp, res, 'ok', r.attempts));
          buttonsFor('next');
        } else if (r.attempts < MAX_ATTEMPTS && !ren.selfChecking) {
          ren.lock();
          fb.appendChild(EQ.feedback.render(item, resp, res, 'retry', r.attempts));
          buttonsFor('retry');
        } else {
          r.done = true;
          ren.lock(); ren.showSolution();
          fb.appendChild(EQ.feedback.render(item, resp, res, 'solution', r.attempts));
          buttonsFor('next');
        }
        persist();
        fb.scrollIntoView && fb.scrollIntoView({ behavior: EQ.settings.get().motion ? 'smooth' : 'auto', block: 'nearest' });
      }

      buttonsFor('answer');
      ren.focus();
      persist();
    }

    function next() {
      EQ.speech.stop();
      if (state.idx < items.length - 1) {
        state.idx++;
        persist();
        if (!maybePause()) render();
        window.scrollTo(0, 0);
        return;
      }
      finish();
    }

    function finish() {
      clearPersist();
      var list = items.map(function (it) { return Object.assign({ id: it.id }, result(it.id)); });
      if (opts.onFinish) { opts.onFinish(state, items, list); return; }
      var rw = EQ.rewards.onRunEnd({ key: state.key, results: list });
      EQ.ui.updateStars();
      doneScreen(rw, list);
    }

    function doneScreen(rw, list) {
      EQ.clear(el);
      var wrong = list.filter(function (r) { return !r.firstCorrect; }).map(function (r) { return r.id; });
      var box = h('div', { class: 'runner done-screen' },
        h('div', { class: 'card stack' },
          h('div', { class: 'big-emoji', 'aria-hidden': 'true' }, rw.firstOk === rw.total ? '🏆' : '🎉'),
          h('h1', null, '¡Tanda terminada!'),
          h('p', null, 'Has acertado ', h('b', null, rw.firstOk + ' de ' + rw.total), ' a la primera' + (rw.fixed ? ' y has corregido ' + rw.fixed + ' con tu esfuerzo.' : '.')),
          h('div', null, h('h2', null, 'Has ganado ' + rw.stars + ' ' + (rw.stars === 1 ? 'estrella' : 'estrellas')), h('ul', { class: 'list-plain' }, rw.reasons.map(function (t) { return h('li', null, t); }))),
          rw.badges.length ? h('div', { class: 'notice' }, h('b', null, '¡Nueva insignia! '), rw.badges.map(function (b) { return b.icon + ' ' + b.name; }).join(' · ')) : null,
          h('a', { class: 'btn start-btn block', href: '#/start' }, '🐱 Siguiente con Zarra ▶'),
          h('div', { class: 'btn-row' },
            opts.again ? h('button', { type: 'button', class: 'btn secondary', onclick: opts.again }, '🔁 Otra tanda') : null,
            wrong.length ? h('button', { type: 'button', class: 'btn accent', onclick: function () { EQ.store.data.tmpReview = wrong; location.hash = '#/review?ids=last'; } }, '🎯 Practicar lo que he fallado') : null,
            h('a', { class: 'btn secondary', href: opts.backHref || '#/home' }, '◀ Volver'))));
      el.appendChild(box);
      if (rw.firstOk / Math.max(1, rw.total) >= 0.6 || rw.fixed > 0) EQ.ui.celebrate();
    }

    function isSpellItem(it) { return ['write', 'listen-write', 'missing', 'letters'].indexOf(it.type) >= 0; }

    if (!opts.resume || !saved) persist();
    render();
  }

  EQ.Runner = Runner;
})(window.EQ);
