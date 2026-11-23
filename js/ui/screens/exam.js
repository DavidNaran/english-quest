/* exam.js — Simulacros de examen: entrenamiento y examen real, con resultados detallados. */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var MODES = { train: { name: 'Entrenamiento', icon: '🧭', desc: 'Con pistas y corrección en cada pregunta.' }, real: { name: 'Examen real', icon: '📝', desc: 'Sin pistas. Ves la corrección al terminar. Sin reloj.' } };

  function fmt(g) { return String(g).replace('.', ','); }
  function best(n, mode) {
    var list = EQ.store.data.exams.filter(function (e) { return e.exam === n && (!mode || e.mode === mode); });
    return list.length ? Math.max.apply(null, list.map(function (e) { return e.grade; })) : null;
  }

  EQ.router.add('exam', 'Examen', function (main, params, query) {
    if (params[0] && params[1]) return run(main, parseInt(params[0], 10), params[1], query);
    main.appendChild(EQ.ui.pageHead('Simulacros de examen', '#/home'));
    main.appendChild(EQ.ui.guide('Cada examen tiene <b>20 preguntas</b> en 6 partes, como el de verdad. Empieza con <b>Entrenamiento</b> y, cuando te sientas lista, prueba el <b>Examen real</b>. ¡No hay reloj!'));
    var grid = h('div', { class: 'grid two' });
    EQ.exams.list.forEach(function (ex) {
      var bt = best(ex.n, 'train'), br = best(ex.n, 'real');
      grid.appendChild(h('div', { class: 'card exam-card stack' },
        h('h2', null, '🏆 ' + ex.title), h('p', { class: 'muted' }, ex.sub + ' · dificultad ' + '★'.repeat(ex.n) + '☆'.repeat(5 - ex.n)),
        h('p', { class: 'small' }, 'Mejor nota: entrenamiento ', h('b', null, bt === null ? '—' : fmt(bt)), ' · real ', h('b', null, br === null ? '—' : fmt(br))),
        h('div', { class: 'btn-row' },
          h('a', { class: 'btn secondary', href: '#/exam/' + ex.n + '/train' }, MODES.train.icon + ' Entrenamiento'),
          h('a', { class: 'btn exam', href: '#/exam/' + ex.n + '/real' }, MODES.real.icon + ' Examen real'))));
    });
    main.appendChild(grid);
    var hist = EQ.store.data.exams;
    if (hist.length) {
      main.appendChild(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, 'Mis últimos exámenes'),
        h('ul', { class: 'list-plain' }, hist.slice(-6).reverse().map(function (e, i) {
          var idx = hist.length - 1 - i;
          return h('li', null, h('a', { href: '#/exam-result/' + idx }, 'Examen ' + e.exam + ' · ' + MODES[e.mode].name + ' · nota ' + fmt(e.grade) + ' · ' + new Date(e.ts).toLocaleDateString('es-ES')));
        }))));
    }
  });

  function run(main, n, mode, query) {
    var ex = EQ.exams.get(n);
    if (!ex || !MODES[mode]) { location.hash = '#/exam'; return; }
    var runKey = 'exam-' + n + '-' + mode;
    var box = h('div');
    main.appendChild(box);
    var resume = !!query.resume && !!EQ.store.data.runs[runKey];
    if (!resume && mode === 'real') {
      box.appendChild(h('div', { class: 'card stack' },
        h('h1', null, '📝 ' + ex.title + ' · Examen real'),
        EQ.ui.guide('Lee cada pregunta con calma. Puedes escuchar todo las veces que quieras. <b>No hay reloj.</b> Al final verás tu nota y la explicación de cada respuesta. ¡Tú puedes! 💪', { autoRead: true }),
        h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn exam', onclick: function () { EQ.clear(box); start(false); } }, '▶ Empezar'), h('a', { class: 'btn secondary', href: '#/exam' }, '◀ Volver'))));
    } else start(resume);

    function start(res) {
      EQ.Runner(box, {
        key: runKey, runKey: runKey, title: ex.title + ' · ' + MODES[mode].name, label: ex.title + ' (' + MODES[mode].name + ')',
        items: res ? null : ex.list.slice(), mode: mode, route: '#/exam/' + n + '/' + mode, backHref: '#/exam', resume: res,
        again: function () { EQ.clear(box); start(false); },
        onFinish: function (state, items, list) { finish(n, mode, items, list); }
      });
    }
  }

  function finish(n, mode, items, list) {
    var bySection = {}, total = 0, wrongIds = [], answers = [];
    items.forEach(function (it, i) {
      var r = list[i];
      var pts = r.points || 0;
      total += pts;
      var s = bySection[it.section] || (bySection[it.section] = [0, 0]);
      s[0] += pts; s[1] += 1;
      if (pts < 1) wrongIds.push(it.id);
      answers.push({ id: it.id, resp: r.resp, typed: r.typed, points: pts, kind: r.kind, fixed: !r.firstCorrect && r.correct });
    });
    var grade = Math.round((total / items.length) * 100) / 10;
    var d = EQ.store.data;
    d.exams.push({ exam: n, mode: mode, grade: grade, ts: Date.now(), bySection: bySection, wrongIds: wrongIds, answers: answers });
    if (d.exams.length > 100) d.exams.shift();
    d.rewards.stars += 2 + (grade >= 5 ? 1 : 0);
    d.stats.runsDone++;
    EQ.store.save();
    var badges = EQ.rewards.checkBadges();
    EQ.ui.updateStars();
    if (badges.length) setTimeout(function () { EQ.ui.toast('¡Nueva insignia! ' + badges.map(function (b) { return b.icon + ' ' + b.name; }).join(' · '), 5000); }, 600);
    location.hash = '#/exam-result/' + (d.exams.length - 1);
  }

  function describe(it) {
    if (it.prompt && it.type !== 'translate') return it.prompt;
    if (it.type === 'translate') return 'Traduce: ' + it.prompt;
    if (it.type === 'write' || it.type === 'listen-write') return 'Escribe en inglés: ' + (it.es || EQ.vocab.get(it.word).esLabel);
    if (it.type === 'order') return 'Ordena las palabras';
    return EQ.exerciseInstruction(it);
  }
  function respText(it, a) {
    if (a.resp === null || a.resp === undefined || a.resp === '') return '(sin respuesta)';
    if (it.type === 'truefalse') return a.resp ? 'Está bien' : 'Tiene un error';
    if (Array.isArray(a.resp)) return a.resp.join(' ');
    return String(a.resp);
  }

  EQ.router.add('exam-result', 'Resultado', function (main, params) {
    var d = EQ.store.data;
    var idx = parseInt(params[0], 10);
    var e = d.exams[idx];
    if (!e) { location.hash = '#/exam'; return; }
    var ex = EQ.exams.get(e.exam);
    var prev = d.exams.slice(0, idx).filter(function (x) { return x.exam === e.exam && x.mode === e.mode; }).pop();
    var msg = e.grade >= 9 ? '¡Estás preparadísima! 🌟' : e.grade >= 7 ? '¡Muy buen trabajo! 💪' : e.grade >= 5 ? '¡Vas por buen camino! 🌱' : '¡Cada intento te hace aprender más! Vamos a repasar juntas. 🐱';
    var ok = e.answers.filter(function (a) { return a.points >= 1; }).length;
    var half = e.answers.filter(function (a) { return a.points > 0 && a.points < 1; }).length;

    main.appendChild(EQ.ui.pageHead('Resultado · ' + ex.title, '#/exam'));
    main.appendChild(h('div', { class: 'card stack' },
      h('div', { class: 'row' },
        h('div', null, h('div', { class: 'grade-big' }, fmt(e.grade)), h('div', { class: 'muted' }, 'sobre 10')),
        h('div', { style: { flex: 1, minWidth: '220px' } },
          h('p', { style: { fontSize: '1.2rem', fontWeight: 700 } }, msg),
          h('p', null, '✔ ' + ok + ' correctas' + (half ? ' · ½ ' + half + ' casi (medio punto por una letra)' : '') + ' · ✘ ' + (e.answers.length - ok - half) + ' para repasar'),
          prev ? h('p', null, e.grade > prev.grade ? '📈 ¡Has mejorado ' + fmt(Math.round((e.grade - prev.grade) * 10) / 10) + ' puntos respecto a la última vez!' : e.grade === prev.grade ? 'Misma nota que la última vez. ¡Constancia!' : 'La última vez sacaste ' + fmt(prev.grade) + '. ¡Repasa los errores y lo verás!') : null,
          h('p', { class: 'small muted' }, (e.mode === 'real' ? 'Examen real' : 'Entrenamiento (cuenta el primer intento)') + ' · ' + new Date(e.ts).toLocaleString('es-ES'))))));

    // Resultados por parte
    var secBox = h('div', { class: 'card stack', style: { marginTop: '14px' } }, h('h2', null, 'Por partes'));
    var toReview = [];
    EQ.exams.ORDER.forEach(function (sec) {
      var s = e.bySection[sec]; if (!s) return;
      var S = EQ.exams.SECTIONS[sec];
      secBox.appendChild(h('div', null, h('div', { class: 'small', style: { fontWeight: 700 } }, S.letter + '. ' + S.title), EQ.ui.progressBar(s[0], s[1], S.title, String(s[0]).replace('.', ',') + ' / ' + s[1])));
      if (s[0] / s[1] < 0.75) toReview.push(sec);
    });
    main.appendChild(secBox);

    // Temas a repasar
    var tagCount = {};
    e.wrongIds.forEach(function (id) { var it = EQ.content.item(id); if (it) (it.tags || []).forEach(function (t) { tagCount[t] = (tagCount[t] || 0) + 1; }); });
    var gramTags = Object.keys(tagCount).filter(function (t) { return EQ.content.GRAMMAR_TAGS[t] && EQ.content.GRAMMAR_TAGS[t].card; });
    var wordTags = Object.keys(tagCount).filter(function (t) { return EQ.vocab.get(t); });
    var rev = h('div', { class: 'card stack', style: { marginTop: '14px' } }, h('h2', null, '🎯 Qué repasar'));
    if (!e.wrongIds.length) rev.appendChild(h('p', null, '¡Nada! Lo has hecho todo bien. 🎉 Prueba con otro examen.'));
    else {
      if (gramTags.length) rev.appendChild(h('div', null, h('p', null, 'Gramática:'), h('div', { class: 'btn-row' }, gramTags.map(function (t) { var c = EQ.grammar.get(EQ.content.GRAMMAR_TAGS[t].card); return h('a', { class: 'btn grammar small', href: '#/grammar/' + c.id }, c.icon + ' ' + c.title); }))));
      if (wordTags.length) rev.appendChild(h('div', null, h('p', null, 'Palabras:'), h('div', { class: 'btn-row' }, wordTags.map(function (t) { var v = EQ.vocab.get(t); return h('a', { class: 'btn secondary small', href: '#/vocab/' + t, lang: 'en' }, v.en); }))));
      if (toReview.indexOf('order') >= 0) rev.appendChild(h('p', null, 'Ordenar frases: ', h('a', { href: '#/practice/sentence' }, 'practica en el cuaderno')));
    }
    rev.appendChild(h('a', { class: 'btn start-btn block', href: '#/start' }, '🐱 Siguiente con Kiko ▶'));
    rev.appendChild(h('div', { class: 'btn-row' },
      e.wrongIds.length ? h('button', { type: 'button', class: 'btn accent', onclick: function () { d.tmpReview = e.wrongIds.slice(); EQ.store.save(); location.hash = '#/review?ids=last'; } }, '🎯 Practicar mis errores') : null,
      h('a', { class: 'btn exam', href: '#/exam/' + e.exam + '/' + e.mode }, '🔄 Repetir este examen'),
      e.exam < 5 ? h('a', { class: 'btn secondary', href: '#/exam/' + (e.exam + 1) + '/train' }, 'Siguiente examen ▶') : null));
    main.appendChild(rev);

    // Pregunta por pregunta
    var list = h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, 'Pregunta por pregunta'));
    e.answers.forEach(function (a, i) {
      var it = EQ.content.item(a.id); if (!it) return;
      var mark = a.points >= 1 ? '✔' : a.points > 0 ? '½' : '✘';
      var label = a.points >= 1 ? 'correcta' : a.points > 0 ? 'casi correcta' : 'para repasar';
      list.appendChild(h('div', { class: 'result-row' },
        h('span', { class: 'result-mark', 'aria-label': label }, mark),
        h('div', null,
          h('div', null, h('b', null, (i + 1) + '. '), h('span', { lang: 'en' }, describe(it))),
          h('div', { class: 'small' }, 'Tu respuesta: ', h('b', null, respText(it, a)), a.fixed ? ' (la corregiste después ✔)' : ''),
          a.points < 1 ? h('div', { class: 'small' }, 'Respuesta correcta: ', h('b', { lang: 'en' }, EQ.feedback.answerText(it))) : null,
          a.points < 1 && a.kind && EQ.feedback.KIND_LABEL[a.kind] ? h('div', { class: 'small muted' }, 'Tipo de fallo: ' + EQ.feedback.KIND_LABEL[a.kind]) : null,
          it.explain ? h('div', { class: 'small muted' }, it.explain) : null)));
    });
    main.appendChild(list);
    if (e.grade >= 7) EQ.ui.celebrate();
  });
})(window.EQ);
