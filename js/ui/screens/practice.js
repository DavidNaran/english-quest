/* practice.js — Cuaderno interactivo por temas y niveles, práctica sorpresa y repaso de errores. */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var SET_SIZE = 10;

  function doneCount(list) {
    var it = EQ.store.data.items;
    return list.filter(function (x) { return it[x.id] && it[x.id].firstOk; }).length;
  }

  EQ.router.add('practice', 'Practicar', function (main, params, query) {
    var topicId = params[0];
    if (topicId === 'mix') return mix(main, query);
    if (topicId && EQ.content.topic(topicId)) {
      if (params[1]) return run(main, topicId, parseInt(params[1], 10), query);
      return levels(main, topicId);
    }
    main.appendChild(EQ.ui.pageHead('Cuaderno de ejercicios', '#/home'));
    main.appendChild(EQ.ui.guide('Elige un tema. Cada tanda tiene <b>10 ejercicios</b> (unos 5-10 minutos). ¡Sin prisa y sin reloj!'));
    var grid = h('div', { class: 'grid two' });
    EQ.content.TOPICS.forEach(function (t) {
      var done = doneCount(t.bank);
      grid.appendChild(h('a', { class: 'tile ' + t.color, href: '#/practice/' + t.id },
        h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, t.icon),
        h('span', { class: 'tile-title' }, t.title),
        h('span', { class: 'tile-sub' }, t.bank.length + ' ejercicios'),
        EQ.ui.progressBar(done, t.bank.length, 'Acertados a la primera en ' + t.title)));
    });
    grid.appendChild(h('a', { class: 'tile practice', href: '#/practice/mix' },
      h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🎲'),
      h('span', { class: 'tile-title' }, 'Práctica sorpresa'),
      h('span', { class: 'tile-sub' }, 'Mezcla temas y repite más lo que te cuesta')));
    main.appendChild(grid);
  });

  function levels(main, topicId) {
    var t = EQ.content.topic(topicId);
    main.appendChild(EQ.ui.pageHead(t.icon + ' ' + t.title, '#/practice'));
    main.appendChild(EQ.ui.guide('Empieza por <b>Aprendo</b>. Cuando te salga bien, pasa a <b>Practico</b> y luego a <b>Domino</b>.'));
    var grid = h('div', { class: 'grid' });
    EQ.content.LEVELS.forEach(function (L) {
      var list = t.bank.filter(function (x) { return x.level === L.n; });
      if (!list.length) return;
      var done = doneCount(list);
      grid.appendChild(h('a', { class: 'tile ' + t.color, href: '#/practice/' + topicId + '/' + L.n },
        h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, L.icon),
        h('span', { class: 'tile-title' }, 'Nivel ' + L.n + ': ' + L.name),
        h('span', { class: 'tile-sub' }, list.length + ' ejercicios' + (done === list.length ? ' · ¡completado! 🎉' : '')),
        EQ.ui.progressBar(done, list.length, 'Acertados a la primera')));
    });
    main.appendChild(grid);
    var related = topicId === 'could' ? ['could', 'couldnt', 'question', 'short'] : topicId === 'connectors' ? ['and', 'but', 'so', 'because'] : [];
    if (related.length) {
      main.appendChild(h('p', { style: { marginTop: '1rem' } }, '¿Necesitas repasar la teoría? ',
        related.map(function (id) { var c = EQ.grammar.get(id); return h('a', { class: 'btn secondary small', href: '#/grammar/' + id, style: { margin: '4px' } }, c.icon + ' ' + c.title); })));
    }
  }

  function run(main, topicId, level, query) {
    var t = EQ.content.topic(topicId);
    var L = EQ.content.LEVELS[level - 1] || EQ.content.LEVELS[0];
    var runKey = 'nb-' + topicId + '-' + L.n;
    var box = h('div');
    main.appendChild(box);
    function start(resume) {
      EQ.Runner(box, {
        key: runKey, runKey: runKey, title: t.title + ' · ' + L.name, label: t.title + ' · ' + L.name,
        items: resume ? null : EQ.picker.setFor(topicId, L.n, SET_SIZE), mode: 'practice',
        route: '#/practice/' + topicId + '/' + L.n, backHref: '#/practice/' + topicId, resume: resume,
        again: function () { start(false); }
      });
    }
    start(!!query.resume && !!EQ.store.data.runs[runKey]);
  }

  function mix(main, query) {
    var box = h('div');
    main.appendChild(box);
    function start(resume) {
      EQ.Runner(box, {
        key: 'mix', runKey: 'mix', title: 'Práctica sorpresa', label: 'Práctica sorpresa',
        items: resume ? null : EQ.picker.mix(SET_SIZE), mode: 'practice', route: '#/practice/mix',
        backHref: '#/practice', resume: resume, again: function () { start(false); }
      });
    }
    start(!!query.resume && !!EQ.store.data.runs.mix);
  }

  /* ---------- Repasar mis errores ---------- */
  EQ.router.add('review', 'Repasar errores', function (main, params, query) {
    var data = EQ.store.data;
    var resume = !!query.resume && !!data.runs.review;
    var ids = query.ids === 'last' ? (data.tmpReview || []) : null;
    var items = resume ? null : EQ.picker.errorsReview(SET_SIZE, ids);
    if (!resume && !items.length) {
      main.appendChild(EQ.ui.pageHead('Repasar mis errores', '#/home'));
      main.appendChild(EQ.ui.guide('¡No tienes errores pendientes! 🎉 Cuando falles algo, lo guardaré aquí para que lo practiques otra vez.'));
      main.appendChild(h('div', { class: 'btn-row' }, h('a', { class: 'btn', href: '#/practice/mix' }, '🎲 Práctica sorpresa'), h('a', { class: 'btn secondary', href: '#/home' }, 'Inicio')));
      return;
    }
    var box = h('div');
    main.appendChild(box);
    function start(res, list) {
      EQ.Runner(box, {
        key: 'review', runKey: 'review', title: 'Repaso de errores', label: 'Repaso de errores',
        items: list, mode: 'practice', route: '#/review', backHref: '#/home', resume: res,
        again: function () {
          var next = EQ.picker.errorsReview(SET_SIZE);
          if (!next.length) { location.hash = '#/home'; EQ.ui.toast('¡Has repasado todos tus errores! 🎉'); return; }
          start(false, next);
        }
      });
    }
    start(resume, items);
  });
})(window.EQ);
