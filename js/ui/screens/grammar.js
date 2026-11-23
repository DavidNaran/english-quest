/* grammar.js — Fichas de gramática, divididas en pasos (una tarea por pantalla). */
(function (EQ) {
  'use strict';
  var h = EQ.h;

  EQ.router.add('grammar', 'Gramática', function (main, params) {
    if (params[0]) return card(main, params[0], params[1]);
    main.appendChild(EQ.ui.pageHead('Gramática', '#/home'));
    main.appendChild(EQ.ui.guide('Cada ficha tiene 4 pasos: <b>explicación</b>, <b>ejemplos</b>, <b>errores y truco</b> y <b>¡a practicar!</b>'));
    [['could', "🦸 Could y couldn't"], ['connectors', '🔗 Conectores: and, but, so, because']].forEach(function (g) {
      main.appendChild(h('h2', { style: { marginTop: '1.2rem' } }, g[1]));
      var grid = h('div', { class: 'grid' });
      EQ.grammar.list.filter(function (c) { return c.group === g[0]; }).forEach(function (c) {
        var st = EQ.srs.status(c.tag);
        grid.appendChild(h('a', { class: 'tile grammar', href: '#/grammar/' + c.id },
          h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, c.icon),
          h('span', { class: 'tile-title', lang: 'en' }, c.title),
          h('span', { class: 'tile-sub' }, c.short),
          h('span', { class: 'badge-pill ' + (st === 'mastered' ? 'ok' : st === 'learning' ? 'learn' : 'new') }, st === 'mastered' ? '✔ Dominada' : st === 'learning' ? '🌱 En camino' : '✨ Nueva')));
      });
      main.appendChild(grid);
    });
    main.appendChild(h('div', { class: 'card', style: { marginTop: '1.2rem' } },
      h('h2', null, '🆚 SO o BECAUSE: la misma historia de dos formas'),
      compareBox(),
      h('a', { class: 'btn grammar', href: '#/practice/connectors' }, '✏️ Practicar conectores')));
  });

  function compareBox() {
    return h('div', { class: 'stack' },
      h('div', { class: 'scheme' },
        h('span', { class: 'blk other' }, h('small', null, '🌧️ causa'), 'It was raining'),
        h('span', { class: 'blk conn' }, h('small', null, 'así que ➡️'), ', so'),
        h('span', { class: 'blk other' }, h('small', null, '🏠 consecuencia'), 'I stayed at home.')),
      h('div', { class: 'scheme' },
        h('span', { class: 'blk other' }, h('small', null, '🏠 consecuencia'), 'I stayed at home'),
        h('span', { class: 'blk conn' }, h('small', null, 'porque ⬅️'), 'because'),
        h('span', { class: 'blk other' }, h('small', null, '🌧️ causa'), 'it was raining.')),
      h('p', null, '👉 Después de ', h('b', null, 'so'), ' va el ', h('b', null, 'resultado'), '. Después de ', h('b', null, 'because'), ' va la ', h('b', null, 'causa'), '.'),
      h('div', { class: 'row' }, EQ.speech.button('It was raining, so I stayed at home.'), h('span', { lang: 'en' }, 'It was raining, so I stayed at home.')),
      h('div', { class: 'row' }, EQ.speech.button('I stayed at home because it was raining.'), h('span', { lang: 'en' }, 'I stayed at home because it was raining.')));
  }

  var STEPS = [['1', 'Explicación'], ['2', 'Ejemplos'], ['3', 'Errores y truco'], ['4', '¡A practicar!']];

  function card(main, id, stepParam) {
    var c = EQ.grammar.get(id);
    if (!c) { location.hash = '#/grammar'; return; }
    var step = Math.max(1, Math.min(4, parseInt(stepParam, 10) || 1));
    main.appendChild(EQ.ui.pageHead(c.icon + ' ' + c.title, '#/grammar'));
    var nav = h('nav', { class: 'steps', 'aria-label': 'Pasos de la ficha' });
    STEPS.forEach(function (s, i) {
      nav.appendChild(h('a', { class: 'step-btn', href: '#/grammar/' + id + '/' + (i + 1), 'aria-current': step === i + 1 ? 'step' : null, style: { display: 'inline-flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' } }, s[0] + '. ' + s[1]));
    });
    main.appendChild(nav);
    var body = h('div', { class: 'card stack' });
    main.appendChild(body);

    if (step === 1) {
      body.appendChild(h('h2', null, '¿Qué es?'));
      c.explain.forEach(function (t) { body.appendChild(h('p', { html: t })); });
      body.appendChild(EQ.speech.button(c.explain.join(' ').replace(/<[^>]+>/g, ''), { lang: 'es', label: 'Leer la explicación', showLabel: 'Leer en voz alta' }));
      body.appendChild(h('h3', null, 'Esquema'));
      c.scheme.forEach(function (row) {
        var s = h('div', { class: 'scheme' });
        row.forEach(function (b) { s.appendChild(h('span', { class: 'blk ' + b.k, lang: b.k === 'other' && /[áéíóú]|quién/.test(b.s) ? null : 'en' }, b.s ? h('small', null, b.s) : null, b.t)); });
        body.appendChild(s);
      });
      if (c.compare) { body.appendChild(h('h3', null, '🆚 La misma historia de dos formas')); body.appendChild(compareBox()); }
    } else if (step === 2) {
      body.appendChild(h('h2', null, 'Ejemplos'));
      c.examples.forEach(function (ex) {
        body.appendChild(h('div', { class: 'example' }, EQ.speech.button(ex[0]), h('div', null, h('div', { class: 'en', lang: 'en' }, ex[0]), h('div', { class: 'es', lang: 'es' }, ex[1]))));
      });
      body.appendChild(h('h2', null, 'Ejercicios resueltos'));
      c.solved.forEach(function (s) {
        var ans = h('div', { hidden: true }, h('p', null, '✔ ', h('b', { lang: 'en' }, s.a)), h('p', { class: 'muted' }, s.why));
        body.appendChild(h('div', { class: 'mistake', style: { gridTemplateColumns: '1fr' } },
          h('div', { class: 'row' }, EQ.speech.button(s.q.replace(/_{2,}/g, '...')), h('span', { class: 'en', lang: 'en' }, s.q)),
          h('button', { type: 'button', class: 'btn secondary small', onclick: function (e) { ans.hidden = false; e.currentTarget.hidden = true; } }, '👀 Ver la solución'),
          ans));
      });
    } else if (step === 3) {
      body.appendChild(h('h2', null, 'Errores frecuentes'));
      c.mistakes.forEach(function (m) {
        body.appendChild(h('div', { class: 'mistake' },
          h('span', { class: 'lbl' }, '✘ No:'), h('span', { class: 'wrong', lang: 'en' }, m.wrong),
          h('span', { class: 'lbl' }, '✔ Sí:'), h('span', { lang: 'en' }, h('b', null, m.right), ' ', EQ.speech.button(m.right)),
          h('span'), h('span', { class: 'muted' }, m.why)));
      });
      body.appendChild(h('h2', null, 'Truco para recordarlo'));
      body.appendChild(h('div', { class: 'trick' }, h('span', { class: 'big', 'aria-hidden': 'true' }, c.trick.icon), h('p', null, c.trick.text), EQ.speech.button(c.trick.text, { lang: 'es' })));
    } else {
      var box = h('div');
      body.appendChild(h('h2', null, '¡A practicar!'));
      body.appendChild(box);
      var start = function () {
        EQ.Runner(box, { key: 'card-' + id, runKey: null, title: c.title, items: EQ.shuffle(c.practice), mode: 'practice', backHref: '#/grammar/' + id + '/1', again: start });
      };
      start();
    }

    var nextRow = h('div', { class: 'btn-row' });
    if (step > 1) nextRow.appendChild(h('a', { class: 'btn secondary', href: '#/grammar/' + id + '/' + (step - 1) }, '◀ Anterior'));
    nextRow.appendChild(h('span', { class: 'spacer' }));
    if (step < 4) nextRow.appendChild(h('a', { class: 'btn grammar', href: '#/grammar/' + id + '/' + (step + 1) }, 'Siguiente paso ▶'));
    else {
      var topic = c.group === 'could' ? 'could' : 'connectors';
      nextRow.appendChild(h('a', { class: 'btn grammar', href: '#/practice/' + topic }, '✏️ Más ejercicios en el cuaderno'));
    }
    main.appendChild(nextRow);
  }
})(window.EQ);
