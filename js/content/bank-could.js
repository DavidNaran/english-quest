/* bank-could.js — Cuaderno: 40 ejercicios de could / couldn't.
   Nivel 1 Aprendo · 2 Practico · 3 Domino. Cada frase da una pista de contexto
   para que la respuesta sea inequívoca. */
(function (EQ) {
  'use strict';
  var CC = ['could', "couldn't"];
  var T = function (a) { return a === 'could' ? 'could' : 'couldnt'; };
  var items = [];
  function add(o) { o.skill = 'could'; items.push(o); }

  /* ---------- Nivel 1 · Aprendo: elegir could / couldn't con pistas claras ---------- */
  [
    ['When I was a baby, I ___ walk.', "couldn't", 'Los bebés todavía no saben andar → couldn\'t.', '¿Un bebé sabe andar?'],
    ['My grandpa was very strong. He ___ carry heavy boxes.', 'could', 'Era muy fuerte → sí podía → could.', 'Era muy fuerte…'],
    ['Last year my little brother was two. He ___ read.', "couldn't", 'Con dos años no se sabe leer → couldn\'t.', '¿Un niño de dos años sabe leer?'],
    ['Tom practised a lot. At the end of the summer, he ___ ride his bike without help.', 'could', 'Practicó mucho y al final sí sabía → could.', 'Practicó mucho…'],
    ['It was very dark. We ___ see the path.', "couldn't", 'En la oscuridad no se ve → couldn\'t.', '¿Se ve bien en la oscuridad?'],
    ['The water in the lake was very clear. We ___ see the fish.', 'could', 'El agua estaba clara → sí se veían → could.', 'El agua estaba clara…'],
    ['The bird had a broken wing. It ___ fly.', "couldn't", 'Con un ala rota no podía volar → couldn\'t.', 'Tenía un ala rota.'],
    ['My sister was a great swimmer. She ___ swim across the lake.', 'could', 'Era una gran nadadora → could.', 'Era una gran nadadora.'],
    ['The box was too high. I ___ reach it.', "couldn't", 'Too high = demasiado alta → no llegaba → couldn\'t.', 'Too high = demasiado alta.'],
    ['My dog was very clever. It ___ catch a ball in the air.', 'could', 'Era muy listo → sí podía → could.', 'Era muy listo.'],
    ["There wasn't a bridge, so we ___ cross the river.", "couldn't", 'No había puente → no podíamos cruzar → couldn\'t.', "There wasn't a bridge = no había puente."],
    ['Anna started school when she was three. When she was six, she ___ write her name.', 'could', 'Con seis años y yendo al cole, sí sabía → could.', 'Ya iba al cole desde los tres años.'],
    ['I lost my key. I ___ open the door.', "couldn't", 'Sin llave no se abre la puerta → couldn\'t.', 'Perdí la llave.'],
    ['The mountain was not very high. We ___ climb to the top in one hour.', 'could', 'No era muy alta → sí pudimos → could.', 'Not very high = no muy alta.']
  ].forEach(function (r, i) {
    add({ id: 'c' + String(i + 1).padStart(2, '0'), level: 1, type: 'choice', prompt: r[0], options: CC, answer: r[1], explain: r[2], hint: r[3], tags: [T(r[1])] });
  });

  add({ id: 'c15', level: 1, type: 'choice', prompt: 'Could you swim when you were four? — Yes, I ___.', options: CC, answer: 'could', explain: 'La respuesta empieza con Yes → could.', hint: 'Yes va con…', tags: ['short'] });
  add({ id: 'c16', level: 1, type: 'choice', prompt: 'Could your dog jump over the fence? — No, it ___.', options: CC, answer: "couldn't", explain: "La respuesta empieza con No → couldn't.", hint: 'No va con…', tags: ['short'] });

  /* ---------- Nivel 2 · Practico ---------- */
  add({ id: 'c17', level: 2, type: 'choice', prompt: 'Choose the correct question.', options: ['Could you ride a bike?', 'You could ride a bike?', 'Could you rode a bike?'], answer: 'Could you ride a bike?', explain: 'En las preguntas, could va al principio y el verbo en forma base.', hint: '¿Qué palabra va primero en una pregunta?', tags: ['question'] });
  add({ id: 'c18', level: 2, type: 'choice', prompt: 'Could he ___ the tree?', options: ['climb', 'climbed', 'to climb'], answer: 'climb', explain: 'Después de could → verbo base: climb.', hint: 'Sin "to" y sin pasado.', tags: ['question', 'could'] });
  add({ id: 'c19', level: 2, type: 'choice', prompt: "She couldn't ___ the question.", options: ['answer', 'answered', 'to answer'], answer: 'answer', explain: "Después de couldn't → verbo base: answer.", hint: 'Forma base.', tags: ['couldnt', 'answer'] });
  add({ id: 'c20', level: 2, type: 'choice', prompt: 'We could ___ a sandcastle.', options: ['build', 'built', 'to build'], answer: 'build', explain: 'Después de could → verbo base: build.', hint: 'Forma base.', tags: ['could', 'build'] });

  [
    ['My cat was very old. It ___ jump on the bed.', "couldn't", 'Era muy viejo → ya no podía saltar → couldn\'t.', 'Era muy viejo.'],
    ['The music was very loud. I ___ hear my friend.', "couldn't", 'Con la música tan alta no oía → couldn\'t.', 'Loud = muy alta (de volumen).'],
    ['Mum practised every day, so she ___ run five kilometres.', 'could', 'Practicaba todos los días → sí podía → could.', 'Practicaba todos los días.'],
    ['Leo was a good climber. He ___ climb the big mountain.', 'could', 'Era buen escalador → could.', 'A good climber = un buen escalador.'],
    ["I didn't have my glasses. I ___ read the sign.", "couldn't", 'Sin gafas no podía leer → couldn\'t.', 'No tenía las gafas.'],
    ['The dog had a sore throat. It ___ bark.', "couldn't", 'Le dolía la garganta → no podía ladrar → couldn\'t.', 'Sore throat = dolor de garganta.'],
    ['I had a map in my pocket, so I ___ find the path.', 'could', 'Tenía un mapa → sí pude encontrar el camino → could.', 'Tenía un mapa.']
  ].forEach(function (r, i) {
    add({ id: 'c' + (21 + i), level: 2, type: 'gap', prompt: r[0] + " (could / couldn't)", answer: r[1], bank: CC, explain: r[2], hint: r[3], tags: [T(r[1])] });
  });

  add({ id: 'c28', level: 2, type: 'gap', prompt: '___ you catch the ball? — Yes, I could.', answer: 'could', explain: 'La pregunta empieza por Could.', hint: 'La respuesta es "Yes, I could".', tags: ['question', 'catch'], noLong: true });
  add({ id: 'c29', level: 2, type: 'gap', prompt: 'Could your brother swim when he was five? — No, he ___.', answer: "couldn't", explain: "No → couldn't.", hint: 'Empieza con No.', tags: ['short'] });
  add({ id: 'c30', level: 2, type: 'gap', prompt: 'Could they build a fire? — Yes, they ___.', answer: 'could', explain: 'Yes → could.', hint: 'Empieza con Yes.', tags: ['short', 'build'] });
  add({ id: 'c31', level: 2, type: 'choice', prompt: 'Which sentence is correct?', options: ['I could to swim.', 'I could swim.', 'I could swam.'], answer: 'I could swim.', explain: 'Could + verbo base, sin "to".', hint: 'Mira el verbo después de could.', tags: ['could'] });
  add({ id: 'c32', level: 2, type: 'choice', prompt: 'Could you ask the teacher? —', options: ['Yes, I could.', "Yes, I couldn't.", "Yes, I can't."], answer: 'Yes, I could.', explain: 'Yes + I + could.', hint: 'Yes va con could.', tags: ['short', 'ask'] });

  /* ---------- Nivel 3 · Domino: detectar errores y transformar ---------- */
  add({ id: 'c33', level: 3, type: 'truefalse', prompt: "She couldn't swam when she was three.", answer: false, explain: "Después de couldn't va el verbo base: She couldn't swim.", hint: 'Mira el verbo.', tags: ['couldnt'] });
  add({ id: 'c34', level: 3, type: 'truefalse', prompt: 'Could you answer the question? — Yes, I could.', answer: true, explain: 'Pregunta con Could y respuesta corta con Yes + could. ¡Correcta!', hint: 'Yes va con could.', tags: ['short', 'answer'] });
  add({ id: 'c35', level: 3, type: 'truefalse', prompt: 'We could to see the island from the bridge.', answer: false, explain: 'Sobra "to": We could see the island from the bridge.', hint: '¿Qué va después de could?', tags: ['could'] });
  add({ id: 'c36', level: 3, type: 'truefalse', prompt: "My dog couldn't catch the ball.", answer: true, explain: "Couldn't + catch (verbo base). ¡Correcta!", hint: 'Mira el verbo.', tags: ['couldnt', 'catch'] });
  add({ id: 'c37', level: 3, type: 'choice', prompt: "Yesterday I couldn't ___ my friend at the park.", options: ['meet', 'met', 'to meet'], answer: 'meet', explain: "Aunque hable del pasado, después de couldn't va el verbo base: meet.", hint: 'Could ya indica pasado.', tags: ['couldnt', 'meet'] });
  add({ id: 'c38', level: 3, type: 'gap', prompt: 'Make it negative: I could see the river. → I ___ see the river.', answer: "couldn't", explain: "La negativa de could es couldn't (could not).", hint: 'Añade not.', tags: ['couldnt', 'river'] });
  add({ id: 'c39', level: 3, type: 'gap', prompt: 'Make a question: You could build a boat. → ___ you build a boat?', answer: 'could', explain: 'En la pregunta, could va al principio: Could you build a boat?', hint: 'Mueve could al principio.', tags: ['question', 'build'], noLong: true });
  add({ id: 'c40', level: 3, type: 'truefalse', prompt: 'Could the girls meet early? — No, they could.', answer: false, explain: "Con No se usa couldn't: No, they couldn't.", hint: 'No va con…', tags: ['short', 'meet', 'early'] });

  EQ.bank = EQ.bank || {};
  EQ.bank.could = items;
})(window.EQ);
