/* bank-connectors.js — Cuaderno: 40 ejercicios de and / but / so / because.
   Muchos están dedicados a diferenciar SO (consecuencia) y BECAUSE (causa):
   la misma situación aparece escrita en las dos direcciones. Las opciones se
   eligen para que solo una sea correcta. */
(function (EQ) {
  'use strict';
  var items = [];
  function add(o) { o.skill = 'connectors'; o.tags = o.tags || [o.answer]; items.push(o); }
  var WHY = {
    and: 'And suma dos ideas que van juntas.',
    but: 'But une dos ideas que se oponen (una sí, otra no, o algo inesperado).',
    so: 'Después de so va la consecuencia (el resultado).',
    because: 'Después de because va la causa (el porqué).'
  };

  /* ---------- Nivel 1 · Aprendo (dos opciones) ---------- */
  [
    ['I like apples ___ bananas.', ['and', 'but'], 'and', 'Me gustan las dos → se suman → and.'],
    ["I can swim, ___ I can't fly.", ['and', 'but'], 'but', 'Sé / no sé → contraste → but.'],
    ['It was raining, ___ I stayed at home.', ['so', 'because'], 'so', 'Quedarme en casa es la consecuencia → so.'],
    ['I stayed at home ___ it was raining.', ['so', 'because'], 'because', 'La lluvia es la causa → because.'],
    ['We went to the forest ___ we saw a deer.', ['and', 'but'], 'and', 'Dos cosas que pasaron → and.'],
    ['The lake was beautiful, ___ the water was very cold.', ['and', 'but'], 'but', 'Algo bueno y algo malo → contraste → but.'],
    ['I have a pen ___ a pencil in my pocket.', ['and', 'but'], 'and', 'Tengo las dos cosas → and.'],
    ["I wanted to cross the river, ___ there wasn't a bridge.", ['and', 'but'], 'but', 'Quería cruzar, pero no podía → but.'],
    ['I was hungry, ___ I ate a sandwich.', ['so', 'because'], 'so', 'Comer es la consecuencia de tener hambre → so.'],
    ['I ate a sandwich ___ I was hungry.', ['so', 'because'], 'because', 'Tener hambre es la causa → because.'],
    ['My dog barked ___ it saw a cat.', ['so', 'because'], 'because', '¿Por qué ladró? Porque vio un gato → because.'],
    ['It was very late, ___ we went to bed.', ['so', 'because'], 'so', 'Irnos a la cama es la consecuencia → so.']
  ].forEach(function (r, i) {
    add({ id: 'k' + String(i + 1).padStart(2, '0'), level: 1, type: 'choice', prompt: r[0], options: r[1], answer: r[2], explain: r[3], hint: (r[2] === 'so' || r[2] === 'because') ? '¿Lo que viene después es la causa o el resultado?' : '¿Las ideas se suman o se oponen?', why: { so: WHY.so, because: WHY.because, and: WHY.and, but: WHY.but }, tags: [r[2]].concat(/barked/.test(r[0]) ? ['bark'] : []) });
  });

  /* ---------- Nivel 2 · Practico (tres opciones y escritura) ---------- */
  [
    ['I got up early ___ I wanted to see the sunrise.', ['but', 'so', 'because'], 'because', '¿Por qué me levanté temprano? Porque quería ver el amanecer → because.', ['early']],
    ['I put on my coat ___ it was cold.', ['but', 'so', 'because'], 'because', 'El frío es la causa → because.', []],
    ['It was cold, ___ I put on my coat.', ['but', 'so', 'because'], 'so', 'Ponerme el abrigo es la consecuencia → so.', []],
    ['The dog was tired, ___ it slept all afternoon.', ['but', 'so', 'because'], 'so', 'Dormir es la consecuencia de estar cansado → so.', []],
    ['The dog slept all afternoon ___ it was tired.', ['but', 'so', 'because'], 'because', 'Estar cansado es la causa → because.', []],
    ["Tom could swim, ___ he couldn't dive.", ['and', 'but', 'so'], 'but', 'Sabía nadar / no sabía bucear → contraste → but.', ['could']],
    ['From the bridge we could see the island ___ the boats.', ['and', 'but', 'because'], 'and', 'Veíamos las dos cosas → and.', ['bridge', 'island']],
    ['I studied a lot, ___ the exam was easy for me.', ['but', 'so', 'because'], 'so', 'Que fuera fácil es el resultado de estudiar → so.', []]
  ].forEach(function (r, i) {
    add({ id: 'k' + (13 + i), level: 2, type: 'choice', prompt: r[0], options: r[1], answer: r[2], explain: r[3], hint: r[2] === 'so' || r[2] === 'because' ? '¿Lo que viene después es la causa (because) o el resultado (so)?' : '¿Las ideas se suman o se oponen?', tags: [r[2]].concat(r[4]) });
  });

  [
    ['I was thirsty, ___ I drank some water.', ['so', 'because'], 'so', 'Beber agua es el resultado → so.', []],
    ['I drank some water ___ I was thirsty.', ['so', 'because'], 'because', 'Tener sed es la causa → because.', []],
    ['We stayed in the village ___ the bridge was broken.', ['so', 'because'], 'because', 'El puente roto es la causa → because.', ['village', 'bridge']],
    ['The bridge was broken, ___ we stayed in the village.', ['so', 'because'], 'so', 'Quedarnos en el pueblo es la consecuencia → so.', ['village', 'bridge']],
    ['I like reading ___ drawing.', ['and', 'but'], 'and', 'Me gustan las dos cosas → and.', []],
    ["I like reading, ___ I don't like running.", ['and', 'but'], 'but', 'Me gusta / no me gusta → but.', []]
  ].forEach(function (r, i) {
    add({ id: 'k' + (21 + i), level: 2, type: 'gap', prompt: r[0] + ' (' + r[1].join(' / ') + ')', bank: r[1], answer: r[2], explain: r[3], hint: r[2] === 'so' || r[2] === 'because' ? '¿Causa o resultado?' : '¿Suma o contraste?', tags: [r[2]].concat(r[4]) });
  });

  /* ---------- Nivel 3 · Domino: detectar errores, causa/consecuencia, unir frases ---------- */
  add({ id: 'k27', level: 3, type: 'truefalse', prompt: 'It was sunny, because we went to the beach.', answer: false, explain: 'Ir a la playa es la consecuencia → It was sunny, so we went to the beach.', hint: '¿Ir a la playa es la causa o el resultado?', tags: ['so', 'because'] });
  add({ id: 'k28', level: 3, type: 'truefalse', prompt: 'We went to the beach because it was sunny.', answer: true, explain: 'El sol es la causa y va después de because. ¡Correcta!', hint: '¿Qué va después de because?', tags: ['because'] });
  add({ id: 'k29', level: 3, type: 'truefalse', prompt: "I couldn't sleep so the dog was barking.", answer: false, explain: "El perro ladrando es la causa → I couldn't sleep because the dog was barking.", hint: '¿El perro ladraba por culpa de no dormir?', tags: ['so', 'because', 'bark'] });
  add({ id: 'k30', level: 3, type: 'truefalse', prompt: "The dog was barking, so I couldn't sleep.", answer: true, explain: 'No dormir es la consecuencia y va después de so. ¡Correcta!', hint: '¿Qué va después de so?', tags: ['so', 'bark'] });
  add({ id: 'k31', level: 3, type: 'choice', prompt: 'Which sentence means the same? "It was late, so I went home."', options: ['I went home because it was late.', 'It was late because I went home.', 'I went home, so it was late.'], answer: 'I went home because it was late.', explain: 'La causa (era tarde) va después de because.', hint: 'Busca la causa y ponla después de because.', tags: ['so', 'because', 'late'] });
  add({ id: 'k32', level: 3, type: 'choice', prompt: 'Which sentence means the same? "I couldn\'t catch the bus because I got up late."', options: ["I got up late, so I couldn't catch the bus.", "I couldn't catch the bus, so I got up late.", "I got up late because I couldn't catch the bus."], answer: "I got up late, so I couldn't catch the bus.", explain: 'Primero la causa (me levanté tarde), después so + la consecuencia.', hint: '¿Qué pasó primero?', tags: ['so', 'because', 'catch', 'late'] });
  add({ id: 'k33', level: 3, type: 'choice', prompt: 'Find the cause (la causa): "The children were happy because it was snowing."', options: ['It was snowing.', 'The children were happy.'], answer: 'It was snowing.', explain: 'La causa es lo que va después de because.', hint: 'Mira lo que va después de because.', tags: ['because'] });
  add({ id: 'k34', level: 3, type: 'choice', prompt: 'Find the consequence (la consecuencia): "I was tired, so I went to bed early."', options: ['I went to bed early.', 'I was tired.'], answer: 'I went to bed early.', explain: 'La consecuencia es lo que va después de so.', hint: 'Mira lo que va después de so.', tags: ['so', 'early'] });
  add({ id: 'k35', level: 3, type: 'gap', prompt: "Kate can sing, ___ she can't dance. (and / but / so / because)", bank: ['and', 'but', 'so', 'because'], answer: 'but', explain: 'Sabe / no sabe → contraste → but.', hint: 'Una cosa sí y otra no.', tags: ['but'] });
  add({ id: 'k36', level: 3, type: 'gap', prompt: "My friend was ill, ___ she couldn't come to the party. (but / so / because)", bank: ['but', 'so', 'because'], answer: 'so', explain: 'No venir es la consecuencia de estar enferma → so.', hint: '¿Causa o resultado?', tags: ['so'] });
  add({ id: 'k37', level: 3, type: 'gap', prompt: "She couldn't come to the party ___ she was ill. (but / so / because)", bank: ['but', 'so', 'because'], answer: 'because', explain: 'Estar enferma es la causa → because.', hint: '¿Por qué no vino?', tags: ['because'] });
  add({ id: 'k38', level: 3, type: 'gap', prompt: "I wanted to buy a book, ___ I didn't have any money. (but / so / because)", bank: ['but', 'so', 'because'], answer: 'but', explain: 'Quería comprarlo, pero algo lo impedía → but.', hint: '¿Es algo que se opone?', tags: ['but'] });
  add({ id: 'k39', level: 3, type: 'choice', prompt: 'Join the sentences: "I couldn\'t see." + "It was dark."', options: ["I couldn't see because it was dark.", "I couldn't see, so it was dark.", "It was dark because I couldn't see."], answer: "I couldn't see because it was dark.", explain: 'La oscuridad es la causa → va después de because.', hint: '¿Cuál es la causa?', tags: ['because'] });
  add({ id: 'k40', level: 3, type: 'choice', prompt: 'Join the sentences: "The river was deep." + "We couldn\'t cross it."', options: ["The river was deep, so we couldn't cross it.", "The river was deep because we couldn't cross it.", "We couldn't cross it, so the river was deep."], answer: "The river was deep, so we couldn't cross it.", explain: 'No poder cruzar es la consecuencia → va después de so.', hint: '¿Qué pasó primero?', tags: ['so', 'river'] });

  EQ.bank = EQ.bank || {};
  EQ.bank.connectors = items;
})(window.EQ);
