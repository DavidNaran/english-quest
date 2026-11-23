/* exams.js — 5 simulacros de examen (20 preguntas, 1 punto cada una).
   Secciones: A could/couldn't · B conectores · C traducción · D escritura de vocabulario
   · E completar frases · F ordenar palabras. Dificultad creciente del 1 al 5. */
(function (EQ) {
  'use strict';
  var CC = ['could', "couldn't"];
  var SECTIONS = {
    could: { letter: 'A', title: "Could y couldn't" },
    connectors: { letter: 'B', title: 'And, but, so, because' },
    translate: { letter: 'C', title: 'Traducción de vocabulario' },
    spelling: { letter: 'D', title: 'Escribe la palabra' },
    complete: { letter: 'E', title: 'Completa las frases' },
    order: { letter: 'F', title: 'Ordena las palabras' }
  };
  var T = function (a) { return a === 'could' ? 'could' : 'couldnt'; };
  function vChoiceEn(id, opts) { // ¿Qué significa 'mountain'?
    var v = EQ.vocab.get(id);
    return { type: 'choice', prompt: '¿Qué significa "' + v.en + '"?', options: [v.esLabel].concat(opts), answer: v.esLabel, explain: v.en + ' = ' + v.esLabel + '.', hint: 'Piensa en el dibujo de la palabra.', tags: [id], icon: null };
  }
  function vChoiceEs(id, optIds) { // ¿Cómo se dice 'pueblo'?
    var v = EQ.vocab.get(id);
    return { type: 'choice', prompt: '¿Cómo se dice "' + v.esLabel + '" en inglés?', options: [v.en].concat(optIds.map(function (o) { return EQ.vocab.get(o).en; })), answer: v.en, explain: v.esLabel + ' = ' + v.en + '.', hint: 'Empieza por "' + v.base[0] + '".', tags: [id] };
  }
  function vTranslate(id) {
    var v = EQ.vocab.get(id);
    return { type: 'translate', prompt: v.en, answer: v.es, explain: v.en + ' = ' + v.esLabel + '.', hint: 'Recuerda su dibujo.', tags: [id] };
  }
  function vWrite(id) {
    var v = EQ.vocab.get(id);
    return { type: 'write', word: id, icon: id, es: v.esLabel, explain: 'Se escribe ' + v.base.toUpperCase().split('').join(' ') + '.', hint: 'Empieza por "' + v.base[0] + '" y tiene ' + v.base.length + ' letras.', tags: [id] };
  }
  function cc(prompt, ans, explain, hint, extra) {
    return { type: 'choice', prompt: prompt, options: CC, answer: ans, explain: explain, hint: hint, tags: [T(ans)].concat(extra || []) };
  }
  function ccGap(prompt, ans, explain, hint, extra) {
    return { type: 'gap', prompt: prompt + " (could / couldn't)", bank: CC, answer: ans, explain: explain, hint: hint, tags: [T(ans)].concat(extra || []) };
  }
  function conn(prompt, opts, ans, explain, extra) {
    return { type: 'choice', prompt: prompt, options: opts, answer: ans, explain: explain, hint: (ans === 'so' || ans === 'because') ? '¿Lo que viene después es la causa o el resultado?' : '¿Las ideas se suman o se oponen?', tags: [ans].concat(extra || []) };
  }
  function connGap(prompt, opts, ans, explain, extra) {
    return { type: 'gap', prompt: prompt + ' (' + opts.join(' / ') + ')', bank: opts, answer: ans, explain: explain, hint: (ans === 'so' || ans === 'because') ? '¿Causa o resultado?' : '¿Suma o contraste?', tags: [ans].concat(extra || []) };
  }
  function vGap(prompt, id, es) {
    var v = EQ.vocab.get(id);
    return { type: 'gap', prompt: prompt + ' (' + es + ')', answer: v.base, spellCheck: true, explain: es + ' = ' + v.en + '.', hint: 'Empieza por "' + v.base[0] + '".', tags: [id] };
  }
  function ord(answer, accept, tags) {
    return { type: 'order', answer: answer, accept: accept || [], explain: 'La frase correcta es: ' + answer, hint: 'La palabra con mayúscula va primero.', tags: ['order'].concat(tags || []) };
  }

  var EXAMS = [
    {
      n: 1, title: 'Examen 1', sub: 'Para empezar', items: {
        could: [
          cc('When I was a baby, I ___ talk.', "couldn't", 'Los bebés todavía no saben hablar → couldn\'t.', '¿Un bebé sabe hablar?'),
          cc('My cat was very fast. It ___ catch mice.', 'could', 'Era muy rápido → sí podía → could.', 'Era muy rápido.', ['catch']),
          cc('Could you swim when you were six? — Yes, I ___.', 'could', 'Yes → could.', 'Empieza con Yes.', ['short']),
          { type: 'choice', prompt: "She couldn't ___ the tree.", options: ['climb', 'climbed', 'to climb'], answer: 'climb', explain: "Después de couldn't → verbo base.", hint: 'Sin "to" y sin pasado.', tags: ['couldnt'] }
        ],
        connectors: [
          conn('I like the forest ___ the river.', ['and', 'but'], 'and', 'Me gustan los dos → and.', ['forest', 'river']),
          conn("I can ride a bike, ___ I can't ride a horse.", ['and', 'but'], 'but', 'Sé / no sé → but.'),
          conn('It was hot, ___ I opened the window.', ['so', 'because'], 'so', 'Abrir la ventana es la consecuencia → so.'),
          conn('I opened the window ___ it was hot.', ['so', 'because'], 'because', 'El calor es la causa → because.')
        ],
        translate: [vChoiceEn('mountain', ['río', 'puente']), vChoiceEs('village', ['field', 'lake']), vTranslate('lake')],
        spelling: [vWrite('forest'), vWrite('river'), vWrite('bridge'), vWrite('pocket')],
        complete: [
          vGap('We swam in the ___.', 'lake', 'lago'),
          vGap('Dogs ___ at cats.', 'bark', 'ladrar'),
          ccGap('It was very dark, so I ___ see.', "couldn't", 'Con oscuridad no se ve → couldn\'t.', 'Estaba muy oscuro.')
        ],
        order: [ord('I could swim when I was five.', [], ['could']), ord('Could you climb a tree?', [], ['question'])]
      }
    },
    {
      n: 2, title: 'Examen 2', sub: 'Un poco más', items: {
        could: [
          cc('The box was very heavy. I ___ carry it.', "couldn't", 'Muy pesada → no podía → couldn\'t.', 'Heavy = pesada.'),
          cc('My brother was a good swimmer. He ___ swim across the lake.', 'could', 'Buen nadador → could.', 'Era buen nadador.', ['lake']),
          cc('Could your dog catch the ball? — No, it ___.', "couldn't", "No → couldn't.", 'Empieza con No.', ['short', 'catch']),
          { type: 'gap', prompt: '___ you build a sandcastle? — Yes, I could.', answer: 'could', noLong: true, explain: 'La pregunta empieza por Could.', hint: 'La respuesta es "Yes, I could".', tags: ['question', 'build'] }
        ],
        connectors: [
          conn('We went to the island ___ we saw dolphins.', ['and', 'but'], 'and', 'Dos cosas que pasaron → and.', ['island']),
          conn("The path was long, ___ it wasn't difficult.", ['and', 'but'], 'but', 'Largo pero no difícil → contraste → but.', ['path']),
          conn('I was tired, ___ I went to bed early.', ['so', 'because'], 'so', 'Irme a la cama es la consecuencia → so.', ['early']),
          conn('We were happy ___ we won the game.', ['so', 'because'], 'because', 'Ganar es la causa → because.')
        ],
        translate: [vChoiceEn('early', ['tarde', 'campo']), vChoiceEs('island', ['lake', 'river']), vTranslate('show')],
        spelling: [vWrite('mountain'), vWrite('village'), vWrite('field'), vWrite('path')],
        complete: [
          vGap('I got up ___ and I missed the bus.', 'late', 'tarde'),
          vGap('Can you ___ me your new bike?', 'show', 'mostrar'),
          ccGap('The bird had a broken wing, so it ___ fly.', "couldn't", 'Con un ala rota no podía volar.', 'Ala rota…')
        ],
        order: [ord('It was sunny, so we went to the lake.', [], ['so', 'lake']), ord("We couldn't see the island.", [], ['couldnt', 'island'])]
      }
    },
    {
      n: 3, title: 'Examen 3', sub: 'A mitad del camino', items: {
        could: [
          ccGap('When I was two, I ___ read.', "couldn't", 'Con dos años no se sabe leer → couldn\'t.', '¿Con dos años se sabe leer?'),
          ccGap('My grandma was a great cook. She ___ make delicious cakes.', 'could', 'Gran cocinera → could.', 'Era una gran cocinera.'),
          { type: 'choice', prompt: 'Choose the correct question.', options: ['Could she answer the question?', 'Could she answered the question?', 'She could answer the question?'], answer: 'Could she answer the question?', explain: 'Could + she + verbo base + ?', hint: 'Could va primero y el verbo en forma base.', tags: ['question', 'answer'] },
          { type: 'choice', prompt: 'Could they cross the bridge? —', options: ['Yes, they could.', "Yes, they couldn't.", "Yes, they can't."], answer: 'Yes, they could.', explain: 'Yes + they + could.', hint: 'Yes va con could.', tags: ['short', 'bridge'] }
        ],
        connectors: [
          conn("The river was deep, ___ we couldn't swim in it.", ['so', 'because', 'but'], 'so', 'No poder nadar es la consecuencia → so.', ['river']),
          conn("We couldn't swim in the river ___ it was deep.", ['so', 'because', 'but'], 'because', 'La profundidad es la causa → because.', ['river']),
          conn("I like reading, ___ I don't like writing.", ['and', 'but'], 'but', 'Me gusta / no me gusta → but.'),
          conn('I have a dog ___ a cat.', ['and', 'but'], 'and', 'Tengo los dos → and.')
        ],
        translate: [
          { type: 'choice', prompt: '¿Qué significa "to catch"?', options: ['coger / atrapar', 'construir', 'guardar'], answer: 'coger / atrapar', explain: 'To catch = coger / atrapar.', hint: 'Piensa en una pelota.', tags: ['catch'] },
          vChoiceEs('ask', ['answer', 'show']),
          vTranslate('bridge')
        ],
        spelling: [vWrite('island'), vWrite('early'), vWrite('build'), vWrite('answer')],
        complete: [
          vGap('I always ___ my money in my pocket.', 'keep', 'guardar'),
          vGap("Let's ___ at the park at five o'clock.", 'meet', 'quedar'),
          connGap("I couldn't open the door ___ I didn't have the key.", ['so', 'because'], 'because', 'No tener la llave es la causa → because.')
        ],
        order: [ord("I couldn't see the path because it was dark.", [], ['because', 'couldnt', 'path']), ord('Could your sister ride a bike?', [], ['question'])]
      }
    },
    {
      n: 4, title: 'Examen 4', sub: 'Casi como el de verdad', items: {
        could: [
          ccGap('The dog had a sore leg. It ___ run.', "couldn't", 'Le dolía la pata → no podía correr.', 'Sore leg = pata dolorida.'),
          { type: 'choice', prompt: 'Which sentence is correct?', options: ["I couldn't to swim.", "I couldn't swim.", "I couldn't swam."], answer: "I couldn't swim.", explain: "Couldn't + verbo base, sin to.", hint: 'Mira el verbo.', tags: ['couldnt'] },
          { type: 'truefalse', prompt: 'When she was five, she could rode a bike.', answer: false, explain: 'Después de could va el verbo base: she could ride a bike.', hint: 'Mira el verbo después de could.', tags: ['could'] },
          { type: 'gap', prompt: 'Could you answer all the questions? — No, I ___.', answer: "couldn't", explain: "No → couldn't.", hint: 'Empieza con No.', tags: ['short', 'answer'] }
        ],
        connectors: [
          connGap('It was very late, ___ we went home.', ['so', 'because'], 'so', 'Irnos a casa es la consecuencia → so.', ['late']),
          connGap('We went home ___ it was very late.', ['so', 'because'], 'because', 'Ser tarde es la causa → because.', ['late']),
          { type: 'choice', prompt: 'Find the cause (la causa): "I couldn\'t sleep because the dog was barking."', options: ['The dog was barking.', "I couldn't sleep."], answer: 'The dog was barking.', explain: 'La causa va después de because.', hint: 'Mira lo que va después de because.', tags: ['because', 'bark'] },
          conn('I wanted to go to the mountain, ___ it was raining.', ['and', 'but', 'because'], 'but', 'Quería ir, pero llovía → but.', ['mountain'])
        ],
        translate: [vChoiceEn('keep', ['mostrar', 'preguntar']), vTranslate('field'), vTranslate('late')],
        spelling: [vWrite('lake'), vWrite('catch'), vWrite('bark'), vWrite('forest')],
        complete: [
          vGap('We could ___ a big sandcastle.', 'build', 'construir'),
          vGap('Can I ___ you a question?', 'ask', 'preguntar'),
          vGap('I got up ___, so I had time for breakfast.', 'early', 'temprano')
        ],
        order: [ord('We met at the lake because it was sunny.', [], ['meet', 'lake', 'because']), ord('Could you see the island from the mountain?', ['Could you see the mountain from the island?'], ['question', 'island', 'mountain'])]
      }
    },
    {
      n: 5, title: 'Examen 5', sub: 'Reto final', items: {
        could: [
          { type: 'gap', prompt: 'Make it negative: I could find the path. → I ___ find the path.', answer: "couldn't", explain: "La negativa de could es couldn't.", hint: 'Añade not.', tags: ['couldnt', 'path'] },
          { type: 'gap', prompt: 'Make a question: She could keep a secret. → ___ she keep a secret?', answer: 'could', noLong: true, explain: 'Could va al principio de la pregunta.', hint: 'Mueve could al principio.', tags: ['question', 'keep'] },
          { type: 'truefalse', prompt: "Could you hear the music? — Yes, I couldn't.", answer: false, explain: 'Yes va con could: Yes, I could.', hint: 'Yes va con…', tags: ['short'] },
          cc('My little brother ___ read when he was three, but now he can.', "couldn't", 'Ahora sí sabe ("but now he can") → antes no → couldn\'t.', 'Fíjate en "but now he can".', ['but'])
        ],
        connectors: [
          { type: 'choice', prompt: 'Join the sentences: "I got up late." + "I missed the bus."', options: ['I got up late, so I missed the bus.', 'I got up late because I missed the bus.', 'I missed the bus, so I got up late.'], answer: 'I got up late, so I missed the bus.', explain: 'Primero la causa (me levanté tarde) y después so + la consecuencia.', hint: '¿Qué pasó primero?', tags: ['so', 'late'] },
          { type: 'choice', prompt: 'Which sentence means the same? "We stayed inside because it was snowing."', options: ['It was snowing, so we stayed inside.', 'We stayed inside, so it was snowing.', 'It was snowing because we stayed inside.'], answer: 'It was snowing, so we stayed inside.', explain: 'La causa (nevaba) va antes de so.', hint: 'Busca la causa.', tags: ['so', 'because'] },
          connGap("Lucy can swim, ___ she can't dive.", ['and', 'but', 'so', 'because'], 'but', 'Sabe / no sabe → but.'),
          connGap("We couldn't play outside ___ it was raining.", ['but', 'so', 'because'], 'because', 'La lluvia es la causa → because.')
        ],
        translate: [vChoiceEn('answer', ['preguntar', 'quedar']), vTranslate('pocket'), vTranslate('build')],
        spelling: [vWrite('village'), vWrite('keep'), vWrite('show'), vWrite('river')],
        complete: [
          vGap('Can you ___ the ball?', 'catch', 'atrapar'),
          vGap('Please ___ the question.', 'answer', 'responder'),
          vGap('There was a big ___ over the river.', 'bridge', 'puente')
        ],
        order: [ord("I couldn't answer the question, so I asked my teacher.", [], ['so', 'couldnt', 'answer', 'ask']), ord("When I was little, I couldn't swim in the lake.", [], ['couldnt', 'lake'])]
      }
    }
  ];

  // Aplana cada examen en una lista ordenada por secciones, con ids estables
  var ORDER = ['could', 'connectors', 'translate', 'spelling', 'complete', 'order'];
  EXAMS.forEach(function (ex) {
    var list = [];
    ORDER.forEach(function (sec) {
      (ex.items[sec] || []).forEach(function (it) {
        it.section = sec;
        it.skill = sec === 'could' ? 'could' : sec === 'connectors' ? 'connectors' : sec === 'order' ? 'sentence' : 'vocab';
        it.level = Math.min(3, Math.ceil(ex.n / 2));
        it.id = 'e' + ex.n + '-' + (list.length + 1);
        list.push(it);
      });
    });
    ex.list = list;
  });

  EQ.exams = { list: EXAMS, SECTIONS: SECTIONS, ORDER: ORDER, get: function (n) { return EXAMS[n - 1]; } };
})(window.EQ);
