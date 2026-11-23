/* vocab.js — Vocabulario Unit 2: The world around us (lista oficial, 20 palabras).
   en: forma que se estudia · base: palabra sin "to" (para corregir) · es: traducciones aceptadas
   (la primera es la principal) · example: frase sencilla de ejemplo. */
(function (EQ) {
  'use strict';
  var V = [
    { id: 'mountain', n: 1, en: 'Mountain', base: 'mountain', kind: 'noun', es: ['montaña'], example: 'We climbed a big mountain.', exampleEs: 'Subimos una montaña grande.' },
    { id: 'forest', n: 2, en: 'Forest', base: 'forest', kind: 'noun', es: ['bosque'], example: 'There are a lot of trees in the forest.', exampleEs: 'Hay muchos árboles en el bosque.' },
    { id: 'village', n: 3, en: 'Village', base: 'village', kind: 'noun', es: ['pueblo', 'aldea'], example: 'My grandma lives in a small village.', exampleEs: 'Mi abuela vive en un pueblo pequeño.' },
    { id: 'field', n: 4, en: 'Field', base: 'field', kind: 'noun', es: ['campo', 'prado'], example: 'The cows are in the field.', exampleEs: 'Las vacas están en el campo.' },
    { id: 'lake', n: 5, en: 'Lake', base: 'lake', kind: 'noun', es: ['lago'], example: 'We swam in the lake.', exampleEs: 'Nadamos en el lago.' },
    { id: 'island', n: 6, en: 'Island', base: 'island', kind: 'noun', es: ['isla'], example: 'There is a small island in the sea.', exampleEs: 'Hay una isla pequeña en el mar.' },
    { id: 'river', n: 7, en: 'River', base: 'river', kind: 'noun', es: ['río'], example: 'The river is long and blue.', exampleEs: 'El río es largo y azul.' },
    { id: 'path', n: 8, en: 'Path', base: 'path', kind: 'noun', es: ['camino', 'sendero'], example: 'Follow the path to the lake.', exampleEs: 'Sigue el camino hasta el lago.' },
    { id: 'bridge', n: 9, en: 'Bridge', base: 'bridge', kind: 'noun', es: ['puente'], example: 'We walked across the bridge.', exampleEs: 'Cruzamos el puente andando.' },
    { id: 'late', n: 10, en: 'Late', base: 'late', kind: 'adv', es: ['tarde'], example: 'I got up late on Sunday.', exampleEs: 'Me levanté tarde el domingo.' },
    { id: 'meet', n: 11, en: 'To meet', base: 'meet', kind: 'verb', es: ['quedar', 'encontrarse', 'encontrar', 'quedar con', 'conocer'], example: "Let's meet at the park.", exampleEs: 'Quedemos en el parque.' },
    { id: 'early', n: 12, en: 'Early', base: 'early', kind: 'adv', es: ['temprano', 'pronto'], example: 'I get up early on Mondays.', exampleEs: 'Me levanto temprano los lunes.' },
    { id: 'ask', n: 13, en: 'To ask', base: 'ask', kind: 'verb', es: ['preguntar', 'pedir'], example: 'Can I ask a question?', exampleEs: '¿Puedo hacer una pregunta?' },
    { id: 'answer', n: 14, en: 'To answer', base: 'answer', kind: 'verb', es: ['responder', 'contestar'], example: 'Answer the question, please.', exampleEs: 'Responde a la pregunta, por favor.' },
    { id: 'show', n: 15, en: 'To show', base: 'show', kind: 'verb', es: ['mostrar', 'enseñar'], example: 'Show me your drawing.', exampleEs: 'Enséñame tu dibujo.' },
    { id: 'bark', n: 16, en: 'To bark', base: 'bark', kind: 'verb', es: ['ladrar'], example: 'My dog barks at cats.', exampleEs: 'Mi perro les ladra a los gatos.' },
    { id: 'catch', n: 17, en: 'To catch', base: 'catch', kind: 'verb', es: ['coger', 'atrapar', 'agarrar', 'pillar'], example: 'Catch the ball!', exampleEs: '¡Coge la pelota!' },
    { id: 'build', n: 18, en: 'To build', base: 'build', kind: 'verb', es: ['construir'], example: "Let's build a sandcastle.", exampleEs: 'Vamos a construir un castillo de arena.' },
    { id: 'keep', n: 19, en: 'To keep', base: 'keep', kind: 'verb', es: ['guardar', 'mantener', 'quedarse'], example: 'I keep my keys in my pocket.', exampleEs: 'Guardo mis llaves en el bolsillo.' },
    { id: 'pocket', n: 20, en: 'Pocket', base: 'pocket', kind: 'noun', es: ['bolsillo'], example: 'My phone is in my pocket.', exampleEs: 'Mi móvil está en mi bolsillo.' }
  ];
  /** Texto en español para mostrar: "quedar / encontrarse" en las que el profesor dio dos. */
  var ES_LABEL = { meet: 'quedar / encontrarse', catch: 'coger / atrapar' };
  V.forEach(function (v) { v.esLabel = ES_LABEL[v.id] || v.es[0]; });

  var byId = {};
  V.forEach(function (v) { byId[v.id] = v; });

  EQ.vocab = {
    list: V,
    get: function (id) { return byId[id]; },
    ids: V.map(function (v) { return v.id; })
  };
})(window.EQ);
