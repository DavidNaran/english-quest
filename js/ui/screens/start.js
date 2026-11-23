/* start.js — Estudio guiado por Zarra: el botón "Empezar" decide la siguiente actividad.
   Sigue un camino ordenado (teoría → práctica → examen) y, al terminarlo,
   elige según lo que más le cuesta. Siempre retoma antes lo que quedó a medias. */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var D = function () { return EQ.store.data; };
  function setDone(key, n) { return function () { var s = D().sets[key]; return !!s && s.count >= (n || 1); }; }
  function examDone(n, mode) { return function () { return D().exams.some(function (e) { return e.exam === n && (!mode || e.mode === mode); }); }; }
  function card(id, title, say) { return { id: 'card-' + id, icon: EQ.grammar.get(id).icon, title: title, say: say, route: '#/grammar/' + id + '/1', done: setDone('card-' + id) }; }
  function nb(topic, level, title, say) { var t = EQ.content.topic(topic); return { id: 'nb-' + topic + '-' + level, icon: t.icon, title: title, say: say, route: '#/practice/' + topic + '/' + level, done: setDone('nb-' + topic + '-' + level) }; }
  function review(n) { return { id: 'review-' + n, icon: '🎯', title: 'Repasar mis errores', say: 'Vamos a practicar otra vez lo que te costó. ¡Así se aprende de verdad!', route: '#/review', done: function () { return EQ.picker.openErrorCount() === 0 || setDone('review', n)(); } }; }

  var PLAN = [
    { id: 'flash', icon: '🏞️', title: 'Conoce las 20 palabras', say: 'Primero vamos a conocer las palabras. Mira el dibujo, piensa cómo se dice en inglés y después escúchala.', route: '#/flash', done: setDone('flash') },
    card('could', 'Could: lo que podías hacer', 'Ahora aprendemos could. Sirve para decir lo que podías o sabías hacer cuando eras más pequeña.'),
    nb('vocab', 1, 'Palabras: nivel Aprendo', 'Vamos a reconocer las palabras con sus dibujos.'),
    card('couldnt', "Couldn't: lo que no podías hacer", "Ahora toca couldn't, lo que no podías o no sabías hacer."),
    nb('could', 1, "Practica could y couldn't", "Ya conoces could y couldn't. ¡Vamos a practicarlos!"),
    card('question', 'Preguntas con could', 'Vamos a aprender a preguntar con could.'),
    card('short', 'Respuestas cortas', 'Y ahora, cómo responder: Yes, I could. No, I couldn\'t.'),
    nb('vocab', 2, 'Palabras: nivel Practico', 'Seguimos con las palabras: letras, sonidos y significados.'),
    card('and', 'And: para sumar', 'Empezamos con los conectores. El primero es and.'),
    card('but', 'But: para contrastar', 'Ahora but, para cuando una cosa sí y otra no.'),
    card('so', 'So: el resultado', 'Ahora so. Después de so va el resultado.'),
    card('because', 'Because: la causa', 'Y because. Después de because va la causa, el porqué.'),
    nb('connectors', 1, 'Practica los conectores', 'Vamos a practicar and, but, so y because.'),
    nb('could', 2, "Could y couldn't: nivel Practico", "Subimos un nivel con could y couldn't."),
    nb('vocab', 3, 'Escribe las palabras', 'Ahora toca escribir las palabras. Tranquila: si te equivocas en una letra, te ayudo.'),
    nb('connectors', 2, 'Conectores: nivel Practico', 'Más práctica de so y because, que son los más difíciles.'),
    nb('sentence', 1, 'Construye frases', 'Vamos a ordenar palabras para construir frases.'),
    { id: 'exam1', icon: '🏆', title: 'Examen 1 de entrenamiento', say: '¡Tu primer examen de práctica! Tiene pistas y te corrijo en cada pregunta. Sin reloj.', route: '#/exam/1/train', done: examDone(1) },
    review(1),
    nb('sentence', 2, 'Frases más largas', 'Ahora frases un poco más largas.'),
    nb('mixed', 1, 'Mezcla de todo', 'Vamos a mezclar gramática y palabras.'),
    nb('could', 3, "Could y couldn't: nivel Domino", "Último nivel de could. ¡Tú puedes!"),
    nb('connectors', 3, 'Conectores: nivel Domino', 'Último nivel de conectores.'),
    { id: 'exam2', icon: '🏆', title: 'Examen 2 de entrenamiento', say: 'Otro examen de práctica, un poco más difícil.', route: '#/exam/2/train', done: examDone(2) },
    { id: 'exam3', icon: '🏆', title: 'Examen 3 de entrenamiento', say: 'Examen 3 de práctica.', route: '#/exam/3/train', done: examDone(3) },
    review(2),
    nb('mixed', 2, 'Mezcla de todo: nivel Practico', 'Más mezcla de todo.'),
    nb('sentence', 3, 'Frases de nivel Domino', 'Las frases más largas.'),
    { id: 'exam4', icon: '📝', title: 'Examen 4 de verdad', say: 'Ahora un examen como el de clase: sin pistas, y la nota al final. ¡Lee con calma!', route: '#/exam/4/real', done: examDone(4, 'real') },
    review(3),
    { id: 'exam5', icon: '📝', title: 'Examen 5: reto final', say: '¡El reto final! Examen de verdad. ¡Estás preparadísima!', route: '#/exam/5/real', done: examDone(5, 'real') }
  ];

  /** Siguiente actividad recomendada. */
  function next() {
    var d = D();
    if (d.resume && d.runs[d.resume.runKey]) {
      return { icon: '▶️', title: 'Continuar: ' + d.resume.label, say: 'Seguimos justo donde lo dejaste.', route: d.resume.route, resume: true };
    }
    var open = EQ.picker.openErrorCount();
    if (open >= 10) return { icon: '🎯', title: 'Repasar mis errores', say: 'Tienes unos cuantos ejercicios para repasar. ¡Vamos a por ellos antes de seguir!', route: '#/review' };
    for (var i = 0; i < PLAN.length; i++) {
      if (!PLAN[i].done()) return Object.assign({ step: i + 1 }, PLAN[i]);
    }
    // Camino terminado: repaso inteligente
    if (open >= 3) return { icon: '🎯', title: 'Repasar mis errores', say: 'Vamos a repasar lo que te costó.', route: '#/review' };
    var weakExam = [1, 2, 3, 4, 5].map(function (n) {
      var g = d.exams.filter(function (e) { return e.exam === n && e.mode === 'real'; }).map(function (e) { return e.grade; });
      return { n: n, best: g.length ? Math.max.apply(null, g) : -1 };
    }).sort(function (a, b) { return a.best - b.best; })[0];
    if (weakExam.best < 9) return { icon: '📝', title: 'Examen ' + weakExam.n + ' de verdad', say: 'Vamos a intentar mejorar la nota del examen ' + weakExam.n + '.', route: '#/exam/' + weakExam.n + '/real' };
    return { icon: '🎲', title: 'Práctica sorpresa', say: '¡Lo has hecho todo! Ahora practicamos un poco de todo para no olvidarlo.', route: '#/practice/mix' };
  }

  EQ.guided = { PLAN: PLAN, next: next, total: PLAN.length, doneCount: function () { for (var i = 0; i < PLAN.length; i++) { if (!PLAN[i].done()) return i; } return PLAN.length; } };

  EQ.router.add('start', 'Empezar', function (main) {
    var n = next();
    var done = EQ.guided.doneCount();
    main.appendChild(EQ.ui.pageHead('Estudiar con Zarra', '#/home'));
    var text = n.say;
    main.appendChild(EQ.ui.guide(text));
    main.appendChild(h('div', { class: 'card stack start-card' },
      h('div', { class: 'small muted' }, n.resume ? 'Lo que dejaste a medias' : n.step ? 'Paso ' + n.step + ' de ' + PLAN.length : 'Repaso'),
      h('div', { class: 'start-next' }, h('span', { class: 'start-icon', 'aria-hidden': 'true' }, n.icon), h('span', { class: 'start-title' }, n.title)),
      h('a', { class: 'btn start-btn block', href: n.route }, '▶ ¡Vamos!'),
      EQ.ui.progressBar(done, PLAN.length, 'Camino de estudio', done + ' de ' + PLAN.length + ' pasos')));
    main.appendChild(h('div', { class: 'btn-row' }, h('a', { class: 'btn secondary', href: '#/home' }, '🏠 Prefiero elegir yo')));
    // La voz solo se reproduce tras un toque en iPad; el botón 🔊 del bocadillo siempre funciona.
    setTimeout(function () { EQ.speech.say(text, { lang: 'es' }); }, 350);
  });
})(window.EQ);
