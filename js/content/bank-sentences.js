/* bank-sentences.js — Cuaderno: 30 ejercicios de construcción de frases (ordenar palabras).
   answer: la frase correcta. accept: otros órdenes también correctos.
   La primera palabra lleva mayúscula y las comas van pegadas a su palabra como pista. */
(function (EQ) {
  'use strict';
  var S = [
    // Nivel 1 · Aprendo
    [1, 'I could ride a bike.', [], ['could']],
    [1, "She couldn't climb the tree.", [], ['couldnt']],
    [1, 'Could you swim?', [], ['question']],
    [1, 'Yes, I could.', [], ['short']],
    [1, "No, he couldn't.", [], ['short']],
    [1, 'I like the forest and the lake.', ['I like the lake and the forest.'], ['and', 'forest', 'lake']],
    [1, 'We walked across the bridge.', [], ['bridge']],
    [1, 'My dog barked at the cat.', [], ['bark']],
    [1, 'Keep the key in your pocket.', [], ['keep', 'pocket']],
    [1, 'We got up early.', [], ['early']],
    // Nivel 2 · Practico
    [2, 'When I was five, I could swim.', [], ['could']],
    [2, "I couldn't catch the ball.", [], ['couldnt', 'catch']],
    [2, 'Could you build a sandcastle?', [], ['question', 'build']],
    [2, "I can swim, but I can't fly.", [], ['but']],
    [2, 'It was raining, so I stayed at home.', [], ['so']],
    [2, 'I stayed at home because it was raining.', [], ['because']],
    [2, 'We met our friends in the village.', [], ['meet', 'village']],
    [2, 'There is an island in the lake.', [], ['island', 'lake']],
    [2, 'Follow the path to the river.', ['Follow the river to the path.'], ['path', 'river']],
    [2, 'Could your sister answer the question?', [], ['question', 'answer']],
    // Nivel 3 · Domino
    [3, "When I was three, I couldn't read.", [], ['couldnt']],
    [3, "The river was deep, so we couldn't cross it.", [], ['so', 'couldnt', 'river']],
    [3, "We couldn't cross the river because there wasn't a bridge.", [], ['because', 'couldnt', 'river', 'bridge']],
    [3, 'My grandpa could build boats when he was young.', [], ['could', 'build']],
    [3, 'I asked a question, but nobody answered.', [], ['but', 'ask', 'answer']],
    [3, 'Could you see the mountain from the bridge?', ['Could you see the bridge from the mountain?'], ['question', 'mountain', 'bridge']],
    [3, "I got up late, so I couldn't catch the bus.", [], ['so', 'late', 'catch']],
    [3, 'My dog barked because it saw a cat.', [], ['because', 'bark']],
    [3, "We were late because we couldn't find the path.", ["We couldn't find the path because we were late."], ['because', 'late', 'path']],
    [3, 'I kept the shell in my pocket and showed it to my mum.', [], ['and', 'keep', 'pocket', 'show']]
  ];
  var items = S.map(function (r, i) {
    return {
      id: 's' + String(i + 1).padStart(2, '0'), skill: 'sentence', level: r[0], type: 'order',
      answer: r[1], accept: r[2], tags: ['order'].concat(r[3]),
      explain: 'La frase correcta es: ' + r[1],
      hint: 'La palabra con mayúscula va primero.'
    };
  });
  EQ.bank = EQ.bank || {};
  EQ.bank.sentences = items;
})(window.EQ);
