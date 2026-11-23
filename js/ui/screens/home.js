/* home.js — Pantalla de inicio. */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  EQ.router.add('home', 'Inicio', function (main) {
    var d = EQ.store.data;
    var errors = EQ.picker.openErrorCount();
    var mastered = EQ.rewards.mastered();
    var hour = new Date().getHours();
    var hello = hour < 14 ? '¡Buenos días!' : hour < 21 ? '¡Buenas tardes!' : '¡Buenas noches!';
    var first = !d.stats.answered;
    main.appendChild(EQ.ui.guide(first
      ? hello + ' Soy <b>Zarra</b>, tu gata guía 🐱. Vamos a preparar juntas el examen de inglés. Toca <b>Empezar</b> y yo te digo qué hacer.'
      : hello + ' ¡Qué bien verte otra vez! Ya dominas <b>' + mastered + ' de 20</b> palabras. Toca <b>Empezar</b> y seguimos.', { autoRead: true }));

    // Botón principal: estudio guiado (también retoma lo que quedó a medias)
    var nx = EQ.guided.next();
    main.appendChild(h('a', { class: 'tile start-tile', href: nx.resume ? nx.route : '#/start', 'aria-label': (nx.resume ? 'Continuar: ' : 'Empezar. Siguiente: ') + nx.title },
      h('span', { class: 'start-play', 'aria-hidden': 'true' }, '▶'),
      h('span', null,
        h('span', { class: 'tile-title' }, nx.resume ? 'Continuar' : (first ? 'Empezar' : 'Empezar con Zarra')),
        h('br'),
        h('span', { class: 'tile-sub' }, (nx.resume ? '' : 'Hoy toca: ') + nx.title))));

    main.appendChild(h('div', { class: 'grid two' },
      h('a', { class: 'tile vocab', href: '#/vocab' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🏞️'), h('span', { class: 'tile-title' }, 'Vocabulario'), h('span', { class: 'tile-sub' }, 'Las 20 palabras con dibujo y sonido')),
      h('a', { class: 'tile grammar', href: '#/grammar' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🧩'), h('span', { class: 'tile-title' }, 'Gramática'), h('span', { class: 'tile-sub' }, "Could, couldn't, and, but, so, because")),
      h('a', { class: 'tile practice', href: '#/practice' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '✏️'), h('span', { class: 'tile-title' }, 'Practicar'), h('span', { class: 'tile-sub' }, 'Cuaderno de 190 ejercicios en tandas cortas')),
      h('a', { class: 'tile exam', href: '#/exam' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🏆'), h('span', { class: 'tile-title' }, 'Examen'), h('span', { class: 'tile-sub' }, '5 simulacros: entrenamiento o de verdad'))));

    main.appendChild(h('div', { class: 'grid two', style: { marginTop: '14px' } },
      h('a', { class: 'tile mini', href: '#/review' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🎯'), h('span', null, h('span', { class: 'tile-title' }, 'Repasar mis errores'), h('br'), h('span', { class: 'tile-sub' }, errors ? errors + ' para repasar' : 'Nada pendiente 🎉'))),
      h('a', { class: 'tile mini', href: '#/practice/mix' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🎲'), h('span', null, h('span', { class: 'tile-title' }, 'Práctica sorpresa'), h('br'), h('span', { class: 'tile-sub' }, 'Mezcla lo que más te cuesta'))),
      h('a', { class: 'tile mini', href: '#/progress' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '⭐'), h('span', null, h('span', { class: 'tile-title' }, 'Mi progreso'), h('br'), h('span', { class: 'tile-sub' }, (d.rewards.stars || 0) + ' estrellas'))),
      h('a', { class: 'tile mini', href: '#/print' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '🖨️'), h('span', null, h('span', { class: 'tile-title' }, 'Fichas para imprimir'), h('br'), h('span', { class: 'tile-sub' }, 'Con solucionario aparte'))),
      h('a', { class: 'tile mini', href: '#/settings' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '⚙️'), h('span', null, h('span', { class: 'tile-title' }, 'Ajustes'), h('br'), h('span', { class: 'tile-sub' }, 'Letra, colores y voz'))),
      h('a', { class: 'tile mini', href: '#/parents' }, h('span', { class: 'tile-icon', 'aria-hidden': 'true' }, '👪'), h('span', null, h('span', { class: 'tile-title' }, 'Zona de padres'), h('br'), h('span', { class: 'tile-sub' }, 'Resultados y consejos')))));
  });
})(window.EQ);
