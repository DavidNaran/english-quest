/* vocab.js — Fichas de vocabulario, modo "pasar fichas" y juego de parejas. */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var STATUS = {
    mastered: ['ok', '✔ Dominada'],
    learning: ['learn', '🌱 En camino'],
    'new': ['new', '✨ Nueva']
  };
  function statusPill(id) { var s = STATUS[EQ.srs.status(id)]; return h('span', { class: 'badge-pill ' + s[0] }, s[1]); }

  /* ---------- Lista de las 20 palabras ---------- */
  EQ.router.add('vocab', 'Vocabulario', function (main, params) {
    if (params[0]) return detail(main, params[0]);
    main.appendChild(EQ.ui.pageHead('Vocabulario · Unit 2', '#/home'));
    main.appendChild(EQ.ui.guide('Toca una palabra para ver su ficha, escucharla y practicarla. También puedes <b>pasar fichas</b> o jugar a <b>unir parejas</b>.'));
    main.appendChild(h('div', { class: 'btn-row' },
      h('a', { class: 'btn', href: '#/flash' }, '🃏 Pasar fichas'),
      h('a', { class: 'btn accent', href: '#/pairs' }, '🧠 Unir parejas'),
      h('a', { class: 'btn secondary', href: '#/practice/vocab' }, '✏️ Ejercicios de vocabulario')));
    var grid = h('div', { class: 'grid tight' });
    EQ.vocab.list.forEach(function (v) {
      grid.appendChild(h('a', { class: 'card vocab-card', href: '#/vocab/' + v.id, 'aria-label': v.en + ', ' + v.esLabel },
        h('div', { class: 'pic', html: EQ.art.icon(v.id) }),
        h('span', { class: 'word', lang: 'en' }, v.en),
        h('span', { class: 'tr', lang: 'es' }, v.esLabel),
        statusPill(v.id)));
    });
    main.appendChild(grid);
  });

  /* ---------- Ficha de una palabra ---------- */
  function detail(main, id) {
    var v = EQ.vocab.get(id);
    if (!v) { location.hash = '#/vocab'; return; }
    EQ.store.data.stats.vocabVisited[id] = 1; EQ.store.save();
    EQ.rewards.checkBadges();
    var i = EQ.vocab.ids.indexOf(id);
    var prev = EQ.vocab.ids[(i + 19) % 20], next = EQ.vocab.ids[(i + 1) % 20];
    main.appendChild(EQ.ui.pageHead('Ficha ' + v.n + ' de 20', '#/vocab', statusPill(id)));

    var showEs = false;
    var exEs = h('p', { class: 'es', lang: 'es', hidden: true }, v.exampleEs);
    var repeatMsg = h('p', { class: 'repeat-now', 'aria-live': 'polite' });
    var repeatBtn = h('button', { type: 'button', class: 'btn accent', onclick: function () {
      if (!EQ.speech.supported) { EQ.ui.toast('No hay voz en este dispositivo. Lee la palabra en voz alta tú sola 😊'); return; }
      repeatBtn.disabled = true;
      repeatMsg.textContent = '👂 Escucha…';
      EQ.speech.say(v.base).then(function () {
        repeatMsg.textContent = '🗣️ ¡Ahora tú! Dilo en voz alta.';
        setTimeout(function () {
          repeatMsg.textContent = '👂 Otra vez…';
          EQ.speech.say(v.base).then(function () { repeatMsg.textContent = '🌟 ¡Muy bien! Puedes repetirlo cuando quieras.'; repeatBtn.disabled = false; });
        }, 2600);
      });
    } }, '🔁 Escucha y repite');

    main.appendChild(h('div', { class: 'vocab-detail' },
      h('div', { class: 'big-pic', html: EQ.art.icon(id) }),
      h('div', { class: 'stack' },
        h('div', { class: 'row' }, h('p', { class: 'big-word', lang: 'en' }, v.en), EQ.speech.button(v.base), EQ.speech.button(v.base, { slow: true })),
        h('p', { class: 'big-tr', lang: 'es' }, '= ' + v.esLabel),
        h('div', { class: 'card' },
          h('h3', null, 'Frase de ejemplo'),
          h('div', { class: 'example' }, EQ.speech.button(v.example), h('div', null, h('p', { class: 'en', lang: 'en' }, v.example), exEs)),
          h('button', { type: 'button', class: 'btn secondary small', onclick: function (e) { showEs = !showEs; exEs.hidden = !showEs; e.currentTarget.textContent = showEs ? '🙈 Ocultar traducción' : '👀 Ver traducción'; } }, '👀 Ver traducción')),
        h('div', null, repeatBtn, repeatMsg))));

    // Mini-reto: reconocimiento + escritura
    var others = EQ.shuffle(EQ.vocab.list.filter(function (x) { return x.id !== id; })).slice(0, 2);
    var items = [
      { id: 'vc-r-' + id, skill: 'vocab', level: 1, type: 'choice', prompt: '¿Qué significa "' + v.en + '"?', options: [v.esLabel].concat(others.map(function (o) { return o.esLabel; })), answer: v.esLabel, explain: v.en + ' = ' + v.esLabel + '.', hint: 'Mira el dibujo de arriba.', tags: [id] },
      { id: 'vc-w-' + id, skill: 'vocab', level: 3, type: 'write', word: id, icon: id, es: v.esLabel, explain: 'Se escribe ' + v.base.toUpperCase().split('').join(' ') + '.', hint: 'Empieza por "' + v.base[0] + '" y tiene ' + v.base.length + ' letras.', tags: [id] }
    ];
    var box = h('div', { style: { marginTop: '18px' } });
    main.appendChild(h('div', { class: 'card', style: { marginTop: '18px' } },
      h('h2', null, '🎯 Mini-reto de esta palabra'),
      h('p', { class: 'muted' }, 'Primero reconócela y después escríbela sin mirar.'),
      h('button', { type: 'button', class: 'btn', onclick: function (e) { e.currentTarget.parentNode.removeChild(e.currentTarget); start(); } }, '▶ Empezar mini-reto'),
      box));
    function start() {
      EQ.Runner(box, { key: 'word-' + id, title: 'Mini-reto: ' + v.en, items: items, mode: 'practice', backHref: '#/vocab', again: start });
    }

    main.appendChild(h('div', { class: 'btn-row', style: { marginTop: '18px' } },
      h('a', { class: 'btn secondary', href: '#/vocab/' + prev }, '◀ ' + EQ.vocab.get(prev).en),
      h('span', { class: 'spacer' }),
      h('a', { class: 'btn secondary', href: '#/vocab/' + next }, EQ.vocab.get(next).en + ' ▶')));
  }

  /* ---------- Pasar fichas (autoevaluación, no cuenta para "dominada") ---------- */
  EQ.router.add('flash', 'Pasar fichas', function (main) {
    var order = EQ.vocab.list.slice().sort(function (a, b) { return EQ.srs.weakness(b.id) - EQ.srs.weakness(a.id); });
    var weakFirst = EQ.store.data.flashWeak || [];
    order.sort(function (a, b) { return (weakFirst.indexOf(b.id) >= 0) - (weakFirst.indexOf(a.id) >= 0); });
    var i = 0, knew = 0, notYet = [];
    var box = h('div', { class: 'flash' });
    main.appendChild(EQ.ui.pageHead('Pasar fichas', '#/vocab'));
    main.appendChild(box);
    function show() {
      EQ.clear(box);
      if (i >= order.length) {
        var d = EQ.store.data;
        var set = d.sets.flash || { best: 0, last: null, count: 0 };
        set.count++; set.last = knew / 20; set.best = Math.max(set.best, set.last);
        d.sets.flash = set; d.flashWeak = notYet.slice(); d.rewards.stars += 1;
        EQ.store.save(); EQ.ui.updateStars();
        box.appendChild(h('div', { class: 'card stack' },
          h('h2', null, '🎉 ¡Has pasado las 20 fichas!'),
          h('p', null, 'Te sabías ' + knew + ' de 20. ⭐ +1 estrella. Las que todavía no, salen primero la próxima vez.'),
          h('div', { class: 'btn-row' },
            h('a', { class: 'btn', href: '#/start' }, '🐱 Siguiente con Zarra'),
            h('button', { type: 'button', class: 'btn secondary', onclick: function () { i = 0; knew = 0; notYet = []; show(); } }, '🔁 Otra vez'),
            h('a', { class: 'btn secondary', href: '#/practice/vocab' }, '✏️ Ejercicios'))));
        EQ.ui.celebrate();
        return;
      }
      var v = order[i];
      var revealed = h('div', { hidden: true },
        h('div', { class: 'row' }, h('p', { class: 'big-word', lang: 'en' }, v.en), EQ.speech.button(v.base), EQ.speech.button(v.base, { slow: true })),
        h('div', { class: 'btn-row' },
          h('button', { type: 'button', class: 'btn', onclick: function () { knew++; i++; show(); } }, '😊 Me la sabía'),
          h('button', { type: 'button', class: 'btn secondary', onclick: function () { notYet.push(v.id); i++; show(); } }, '🤔 Todavía no')));
      var revealBtn = h('button', { type: 'button', class: 'btn accent block', onclick: function () { revealBtn.hidden = true; revealed.hidden = false; EQ.speech.say(v.base); } }, '👀 Ver la palabra en inglés');
      box.appendChild(h('div', { class: 'card stack' },
        EQ.ui.progressBar(i + 1, order.length > 20 ? order.length : 20, 'Ficha'),
        h('div', { class: 'big-pic', html: EQ.art.icon(v.id) }),
        h('p', { class: 'big-tr', lang: 'es' }, 'En español: ', h('b', null, v.esLabel)),
        h('p', { class: 'muted' }, 'Piensa cómo se dice en inglés y después toca el botón.'),
        revealBtn, revealed));
    }
    show();
  });

  /* ---------- Unir parejas ---------- */
  EQ.router.add('pairs', 'Unir parejas', function (main) {
    main.appendChild(EQ.ui.pageHead('Unir parejas', '#/vocab'));
    var box = h('div');
    main.appendChild(box);
    var round = 0;
    function start() {
      round++;
      var pool = EQ.picker.sample(EQ.vocab.list.map(function (v) { return { id: v.id, tags: [v.id] }; }), 5).map(function (x) { return EQ.vocab.get(x.id); });
      var items = [0, 1].map(function (k) {
        var set = k === 0 ? pool : EQ.shuffle(pool);
        return {
          id: 'pairs-' + Date.now().toString(36) + '-' + round + '-' + k, skill: 'vocab', level: 1, type: 'match', speakLeft: true,
          instr: k === 0 ? 'Une cada palabra en inglés con su dibujo y su significado.' : 'Ahora sin dibujos: une cada palabra con su significado.',
          pairs: set.map(function (v) { return [v.en, v.esLabel, k === 0 ? v.id : null]; }),
          explain: set.map(function (v) { return v.en + ' = ' + v.esLabel; }).join(' · '),
          tags: set.map(function (v) { return v.id; })
        };
      });
      EQ.Runner(box, { key: 'pairs', title: 'Unir parejas', items: items, mode: 'practice', backHref: '#/vocab', again: start });
    }
    start();
  });
})(window.EQ);
