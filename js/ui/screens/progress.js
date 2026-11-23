/* progress.js — "Mi progreso" para la niña: estrellas, insignias y palabras. */
(function (EQ) {
  'use strict';
  var h = EQ.h;

  EQ.router.add('progress', 'Mi progreso', function (main) {
    var d = EQ.store.data;
    var mastered = EQ.rewards.mastered();
    main.appendChild(EQ.ui.pageHead('⭐ Mi progreso', '#/home'));
    main.appendChild(EQ.ui.guide('Tienes <b>' + (d.rewards.stars || 0) + ' estrellas</b>. Las ganas por terminar tandas, por no rendirte y por mejorar. ¡Cada intento cuenta!'));

    main.appendChild(h('div', { class: 'card stack' },
      h('h2', null, '🏞️ Palabras dominadas'),
      EQ.ui.progressBar(mastered, 20, 'Palabras dominadas', mastered + ' de 20'),
      h('p', { class: 'small muted' }, 'Una palabra está dominada cuando la reconoces, la recuerdas sin ayuda y la escribes bien en dos días o sesiones distintas.'),
      (function () {
        var g = h('div', { class: 'grid tight' });
        EQ.vocab.list.forEach(function (v) {
          var st = EQ.srs.status(v.id);
          g.appendChild(h('a', { class: 'card vocab-card', href: '#/vocab/' + v.id },
            h('div', { class: 'pic', html: EQ.art.icon(v.id) }),
            h('span', { class: 'word', lang: 'en' }, v.en),
            h('span', { class: 'badge-pill ' + (st === 'mastered' ? 'ok' : st === 'learning' ? 'learn' : 'new') }, st === 'mastered' ? '✔ Dominada' : st === 'learning' ? '🌱 En camino' : '✨ Nueva')));
        });
        return g;
      })()));

    var gram = h('div', { class: 'card stack', style: { marginTop: '14px' } }, h('h2', null, '🧩 Gramática'));
    EQ.grammar.list.forEach(function (c) {
      var s = EQ.srs.get(c.tag);
      var acc = s && s.seen ? s.ok / s.seen : 0;
      gram.appendChild(h('div', null, h('div', { class: 'small', style: { fontWeight: 700 } }, c.icon + ' ' + c.title),
        EQ.ui.progressBar(Math.round(acc * 100), 100, c.title, s && s.seen ? Math.round(acc * 100) + ' %' : 'sin empezar')));
    });
    main.appendChild(gram);

    var badges = h('div', { class: 'grid tight' });
    EQ.rewards.BADGES.forEach(function (b) {
      var got = !!d.rewards.badges[b.id];
      badges.appendChild(h('div', { class: 'card medal' + (got ? '' : ' locked') },
        h('div', { class: 'm-icon', 'aria-hidden': 'true' }, b.icon),
        h('div', { class: 'm-name' }, b.name + (got ? ' ✔' : '')),
        h('div', { class: 'm-desc' }, got ? '¡Conseguida!' : b.desc)));
    });
    main.appendChild(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, '🏅 Mis insignias'), badges));
  });
})(window.EQ);
