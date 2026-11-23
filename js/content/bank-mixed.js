/* bank-mixed.js — Cuaderno: 20 ejercicios mixtos (gramática + vocabulario).
   En los huecos de vocabulario se da la palabra en español entre paréntesis para que
   la respuesta sea única. */
(function (EQ) {
  'use strict';
  var CC = ['could', "couldn't"];
  var items = [
    { level: 1, type: 'choice', prompt: "There wasn't a ___, so we couldn't cross the river.", options: ['bridge', 'pocket', 'forest'], answer: 'bridge', explain: 'Para cruzar un río hace falta un puente: bridge.', hint: 'Sirve para cruzar el río.', tags: ['bridge', 'couldnt', 'so'] },
    { level: 1, type: 'choice', prompt: 'There are a lot of trees in the ___.', options: ['forest', 'island', 'pocket'], answer: 'forest', explain: 'Donde hay muchos árboles: el bosque, forest.', hint: 'Muchos árboles…', tags: ['forest'] },
    { level: 1, type: 'gap', prompt: 'I got up very ___, so I could see the sunrise. (temprano)', answer: 'early', explain: 'Temprano = early.', hint: 'Lo contrario de late.', tags: ['early', 'so', 'could'], spellCheck: true },
    { level: 1, type: 'choice', prompt: "I couldn't find my keys ___ they weren't in my pocket.", options: ['so', 'because'], answer: 'because', explain: 'Que no estuvieran en el bolsillo es la causa → because.', hint: '¿Por qué no las encontraba?', tags: ['because', 'pocket', 'couldnt'] },
    { level: 1, type: 'choice', prompt: 'The dog had a sore throat, so it ___ bark.', options: CC, answer: "couldn't", explain: 'Le dolía la garganta → no podía ladrar → couldn\'t.', hint: 'Sore throat = dolor de garganta.', tags: ['couldnt', 'bark', 'so'] },
    { level: 1, type: 'choice', prompt: 'Last summer we went to a beautiful ___. There was sea all around it.', options: ['island', 'field', 'village'], answer: 'island', explain: 'Un lugar con mar alrededor es una isla: island.', hint: 'Mar alrededor…', tags: ['island'] },
    { level: 2, type: 'truefalse', prompt: 'We could see the island from the mountain because it was a sunny day.', answer: true, explain: 'Could + see y la causa (día soleado) después de because. ¡Correcta!', hint: 'Revisa could y because.', tags: ['could', 'because', 'island', 'mountain'] },
    { level: 2, type: 'truefalse', prompt: 'I was late, so I got up early.', answer: false, explain: 'No tiene sentido: si me levanto temprano, no llego tarde. Correcto: I got up late, so I was late for school.', hint: '¿Tiene sentido la historia?', tags: ['so', 'late', 'early'] },
    { level: 2, type: 'gap', prompt: 'We had a lot of wood, so we ___ build a house in the field. (could / couldn\'t)', answer: 'could', bank: CC, explain: 'Tenían mucha madera → sí podían → could.', hint: 'Tenían mucha madera.', tags: ['could', 'build', 'field', 'so'] },
    { level: 2, type: 'choice', prompt: 'Translate: "Podía cruzar el río."', options: ['I could cross the river.', "I couldn't cross the river.", 'I can cross the river.'], answer: 'I could cross the river.', explain: 'Podía = could. Río = river.', hint: 'Podía = could / no podía = couldn\'t.', tags: ['could', 'river'] },
    { level: 2, type: 'choice', prompt: 'Translate: "No podíamos ver la montaña."', options: ["We couldn't see the mountain.", 'We could see the mountain.', "We couldn't see the lake."], answer: "We couldn't see the mountain.", explain: 'No podíamos = couldn\'t. Montaña = mountain.', hint: 'Fíjate en "no" y en "montaña".', tags: ['couldnt', 'mountain'] },
    { level: 2, type: 'choice', prompt: "Could you answer the question? — No, I couldn't, ___ it was very difficult.", options: ['so', 'because', 'but'], answer: 'because', explain: 'Que fuera difícil es la causa → because.', hint: '¿Por qué no podía?', tags: ['because', 'short', 'answer'] },
    { level: 2, type: 'choice', prompt: 'My friend showed me her pocket, ___ it was empty.', options: ['but', 'because', 'so'], answer: 'but', explain: 'Esperaba algo y estaba vacío → contraste → but.', hint: '¿Es algo inesperado?', tags: ['but', 'show', 'pocket'] },
    { level: 3, type: 'order', answer: 'We met at the bridge because it was near the village.', accept: ['We met at the village because it was near the bridge.'], explain: 'Quedamos en el puente porque estaba cerca del pueblo.', hint: 'Empieza por We met…', tags: ['order', 'meet', 'bridge', 'village', 'because'] },
    { level: 3, type: 'order', answer: "I couldn't answer, so I asked my teacher.", accept: [], explain: 'No sabía responder, así que pregunté a mi profesora.', hint: "Empieza por I couldn't…", tags: ['order', 'couldnt', 'so', 'answer', 'ask'] },
    { level: 3, type: 'gap', prompt: 'The dog started to ___ at the cat. (ladrar)', answer: 'bark', explain: 'Ladrar = to bark.', hint: 'Empieza por b.', tags: ['bark'], spellCheck: true },
    { level: 3, type: 'gap', prompt: 'I always ___ my treasures in a box. (guardar)', answer: 'keep', explain: 'Guardar = to keep.', hint: 'Empieza por k.', tags: ['keep'], spellCheck: true },
    { level: 3, type: 'choice', prompt: 'Choose the best sentence.', options: ["I couldn't swim in the lake because the water was very cold.", "I couldn't swim in the lake, so the water was very cold.", "I couldn't to swim in the lake because the water was very cold."], answer: "I couldn't swim in the lake because the water was very cold.", explain: 'El agua fría es la causa (because) y couldn\'t va sin "to".', hint: 'Revisa el conector y el verbo.', tags: ['couldnt', 'because', 'lake'] },
    { level: 3, type: 'gap', prompt: 'We walked along the ___ to the lake. (camino)', answer: 'path', explain: 'Camino = path.', hint: 'Empieza por p.', tags: ['path', 'lake'], spellCheck: true },
    { level: 3, type: 'truefalse', prompt: "My grandma couldn't swim, but she could ride a horse.", answer: true, explain: "Couldn't / could + verbo base y contraste con but. ¡Correcta!", hint: 'Revisa could, couldn\'t y but.', tags: ['could', 'couldnt', 'but'] }
  ];
  items.forEach(function (it, i) { it.id = 'm' + String(i + 1).padStart(2, '0'); it.skill = 'mixed'; });
  EQ.bank = EQ.bank || {};
  EQ.bank.mixed = items;
})(window.EQ);
