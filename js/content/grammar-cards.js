/* grammar-cards.js — 8 fichas de gramática.
   scheme: filas de bloques {t: texto, k: subj|modal|neg|verb|conn|other|arrow, s: etiqueta pequeña} */
(function (EQ) {
  'use strict';
  var C = [
    {
      id: 'could', title: 'Could', icon: '🚀', group: 'could', tag: 'could',
      short: 'Lo que podía o sabía hacer',
      explain: [
        'Usamos <b>could</b> para decir lo que alguien <b>podía</b> o <b>sabía</b> hacer en el pasado.',
        'Could es igual para todos: I, you, he, she, it, we, they.',
        'Después de could va el verbo <b>tal cual</b> (forma base), sin "to".'
      ],
      scheme: [[{ t: 'I / She / We…', k: 'subj', s: 'quién' }, { t: 'could', k: 'modal', s: 'podía' }, { t: 'swim', k: 'verb', s: 'verbo base' }, { t: '…', k: 'other', s: 'resto' }]],
      examples: [
        ['When I was five, I could swim.', 'Cuando tenía cinco años, sabía nadar.'],
        ['My grandpa could build boats.', 'Mi abuelo sabía construir barcos.'],
        ['We could see the mountain from the bridge.', 'Podíamos ver la montaña desde el puente.']
      ],
      solved: [
        { q: 'When I was six, I ___ ride a bike. (Sí sabía)', a: 'could', why: 'Sí sabía hacerlo → could.' },
        { q: 'She could ___ very fast. (run / ran)', a: 'run', why: 'Después de could, el verbo va en forma base: run.' },
        { q: 'My dog could ___ the ball. (catch / to catch)', a: 'catch', why: 'Después de could no se pone "to".' }
      ],
      mistakes: [
        { wrong: 'I could to swim.', right: 'I could swim.', why: 'Después de could no va "to".' },
        { wrong: 'She could swam.', right: 'She could swim.', why: 'El verbo va en forma base, no en pasado.' },
        { wrong: 'He coulds swim.', right: 'He could swim.', why: 'Could nunca cambia: no lleva -s.' }
      ],
      trick: { icon: '🚀', text: 'Could es como un cohete: lleva al verbo tal cual, sin "to" y sin cambios.' },
      practice: [
        { type: 'choice', prompt: 'My grandma was a great cook. She ___ make delicious cakes.', options: ['could', "couldn't"], answer: 'could', explain: 'Era muy buena cocinera → sí podía → could.', hint: '¿Sabía hacerlo o no?' },
        { type: 'choice', prompt: 'When I was seven, I could ___ a kite.', options: ['fly', 'flew', 'to fly'], answer: 'fly', explain: 'Después de could → verbo base: fly.', hint: 'Sin "to" y sin pasado.' },
        { type: 'choice', prompt: 'Which sentence is correct?', options: ['He could climb trees.', 'He could climbed trees.', 'He coulds climb trees.'], answer: 'He could climb trees.', explain: 'Could + verbo base, y could no lleva -s.', hint: 'Mira el verbo que va después de could.' },
        { type: 'gap', prompt: 'My brother practised a lot. At the end of the summer, he ___ swim. (could / couldn\'t)', answer: 'could', bank: ['could', "couldn't"], explain: 'Practicó mucho → al final sí sabía → could.', hint: 'Practicó mucho…' },
        { type: 'truefalse', prompt: 'We could to see the island.', answer: false, explain: 'Sobra "to": We could see the island.', hint: '¿Qué va después de could?' }
      ]
    },
    {
      id: 'couldnt', title: "Couldn't", icon: '🙅', group: 'could', tag: 'couldnt',
      short: 'Lo que no podía o no sabía hacer',
      explain: [
        "<b>Couldn't</b> es la forma corta de <b>could not</b>.",
        "Significa <b>no podía</b> o <b>no sabía</b> hacer algo en el pasado.",
        "Después de couldn't también va el verbo en forma base, sin \"to\"."
      ],
      scheme: [[{ t: 'I / He / They…', k: 'subj', s: 'quién' }, { t: "couldn't", k: 'neg', s: 'no podía' }, { t: 'ride', k: 'verb', s: 'verbo base' }, { t: '…', k: 'other', s: 'resto' }],
               [{ t: 'could not', k: 'neg', s: 'forma larga' }, { t: '=', k: 'arrow' }, { t: "couldn't", k: 'neg', s: 'forma corta' }]],
      examples: [
        ["I couldn't ride a bike.", 'No sabía montar en bici.'],
        ["The dog couldn't catch the ball.", 'El perro no podía coger la pelota.'],
        ["We couldn't cross the river.", 'No podíamos cruzar el río.']
      ],
      solved: [
        { q: 'When I was a baby, I ___ walk. (No sabía)', a: "couldn't", why: 'Los bebés aún no saben andar → couldn\'t.' },
        { q: 'It was very dark. We ___ see the path.', a: "couldn't", why: 'Con mucha oscuridad no se ve → couldn\'t.' },
        { q: 'I couldn\'t ___ the door. (open / opened)', a: 'open', why: "Después de couldn't → verbo base: open." }
      ],
      mistakes: [
        { wrong: "I couldn't to read.", right: "I couldn't read.", why: 'Sin "to".' },
        { wrong: "I didn't could swim.", right: "I couldn't swim.", why: "Para negar, se usa couldn't (no didn't)." },
        { wrong: 'I couldnt swim.', right: "I couldn't swim.", why: "No olvides el apóstrofo ' entre la n y la t." }
      ],
      trick: { icon: "'", text: "El apóstrofo ' es una o que se ha escondido: could not → couldn't." },
      practice: [
        { type: 'choice', prompt: 'The bird had a broken wing. It ___ fly.', options: ['could', "couldn't"], answer: "couldn't", explain: 'Con un ala rota no podía volar → couldn\'t.', hint: '¿Puede volar con un ala rota?' },
        { type: 'choice', prompt: "My little sister couldn't ___ her name.", options: ['write', 'wrote', 'to write'], answer: 'write', explain: "Después de couldn't → verbo base: write.", hint: 'Forma base, sin "to".' },
        { type: 'gap', prompt: 'I lost my key. I ___ open the door. (could / couldn\'t)', answer: "couldn't", bank: ['could', "couldn't"], explain: 'Sin llave no se puede abrir → couldn\'t.', hint: 'Perdí la llave…' },
        { type: 'truefalse', prompt: "She couldn't swim when she was three.", answer: true, explain: "Couldn't + swim (verbo base): está bien.", hint: 'Mira el verbo después de couldn\'t.' },
        { type: 'truefalse', prompt: "He didn't could climb the mountain.", answer: false, explain: "Se dice: He couldn't climb the mountain.", hint: '¿Se usa didn\'t con could?' }
      ]
    },
    {
      id: 'question', title: 'Preguntas con could', icon: '❓', group: 'could', tag: 'question',
      short: 'Could + quién + verbo…?',
      explain: [
        'Para preguntar, ponemos <b>could al principio</b>.',
        'Después va la persona y luego el verbo en forma base.',
        'No olvides el signo <b>?</b> al final (en inglés solo va al final).'
      ],
      scheme: [[{ t: 'Could', k: 'modal', s: '1.º' }, { t: 'you / she…', k: 'subj', s: '2.º quién' }, { t: 'climb', k: 'verb', s: '3.º verbo base' }, { t: 'a tree?', k: 'other', s: 'resto + ?' }]],
      examples: [
        ['Could you climb a tree?', '¿Sabías trepar a un árbol?'],
        ['Could she swim when she was four?', '¿Sabía nadar cuando tenía cuatro años?'],
        ['Could they see the island?', '¿Podían ver la isla?']
      ],
      solved: [
        { q: 'You could ride a bike. → ¿Pregunta?', a: 'Could you ride a bike?', why: 'Could pasa al principio y se añade ?' },
        { q: '___ he read when he was five?', a: 'Could', why: 'La pregunta empieza por Could (con mayúscula).' }
      ],
      mistakes: [
        { wrong: 'You could swim?', right: 'Could you swim?', why: 'En la pregunta, could va primero.' },
        { wrong: 'Could you swam?', right: 'Could you swim?', why: 'Verbo base: swim.' },
        { wrong: 'Did you could swim?', right: 'Could you swim?', why: 'Con could no se usa did.' }
      ],
      trick: { icon: '🐸', text: 'En las preguntas, could salta al principio como una rana.' },
      practice: [
        { type: 'choice', prompt: 'Choose the correct question.', options: ['Could you ride a bike?', 'You could ride a bike?', 'Could you rode a bike?'], answer: 'Could you ride a bike?', explain: 'Could + you + verbo base + ?', hint: 'Could va el primero.' },
        { type: 'order', answer: 'Could your dog catch the ball?', explain: 'Could + your dog + catch + the ball + ?', hint: 'Empieza por Could.' },
        { type: 'gap', prompt: 'You could build a boat. → ___ you build a boat?', answer: 'could', explain: 'Para preguntar, could va al principio: Could you build a boat?', hint: 'Mueve could al principio.' },
        { type: 'truefalse', prompt: 'Did she could answer the question?', answer: false, explain: 'Se dice: Could she answer the question?', hint: '¿Hace falta did?' }
      ]
    },
    {
      id: 'short', title: 'Respuestas cortas', icon: '💬', group: 'could', tag: 'short',
      short: 'Yes, I could. / No, I couldn\'t.',
      explain: [
        'A una pregunta con could respondemos de forma corta.',
        '<b>Yes</b> + persona + <b>could</b>.',
        '<b>No</b> + persona + <b>couldn\'t</b>.',
        'En la respuesta corta no se repite el verbo.'
      ],
      scheme: [[{ t: 'Yes,', k: 'other', s: 'sí' }, { t: 'I / he / they', k: 'subj', s: 'quién' }, { t: 'could.', k: 'modal', s: '' }],
               [{ t: 'No,', k: 'other', s: 'no' }, { t: 'I / he / they', k: 'subj', s: 'quién' }, { t: "couldn't.", k: 'neg', s: '' }]],
      examples: [
        ['Could you swim? — Yes, I could.', '¿Sabías nadar? — Sí.'],
        ["Could he read? — No, he couldn't.", '¿Sabía leer? — No.'],
        ['Could they cross the bridge? — Yes, they could.', '¿Pudieron cruzar el puente? — Sí.']
      ],
      solved: [
        { q: 'Could your cat jump? — No, it ___.', a: "couldn't", why: "Empieza con No → couldn't." },
        { q: 'Could you see the lake? — Yes, I ___.', a: 'could', why: 'Empieza con Yes → could.' }
      ],
      mistakes: [
        { wrong: "Yes, I couldn't.", right: 'Yes, I could.', why: 'Yes va con could.' },
        { wrong: 'No, I could.', right: "No, I couldn't.", why: "No va con couldn't." },
        { wrong: 'Yes, could.', right: 'Yes, I could.', why: 'Falta la persona (I).' }
      ],
      trick: { icon: '🙂', text: "Yes ➜ could. No ➜ couldn't. Si empieza con No, termina con n't." },
      practice: [
        { type: 'choice', prompt: 'Could you swim when you were four? — Yes, I ___.', options: ['could', "couldn't"], answer: 'could', explain: 'Yes → could.', hint: 'Empieza con Yes.' },
        { type: 'choice', prompt: 'Could your brother read when he was two? — No, he ___.', options: ['could', "couldn't"], answer: "couldn't", explain: "No → couldn't.", hint: 'Empieza con No.' },
        { type: 'choice', prompt: 'Could they build a fire?', options: ['Yes, they could.', "Yes, they couldn't.", 'Yes, could they.'], answer: 'Yes, they could.', explain: 'Yes + they + could.', hint: 'Yes + persona + could.' },
        { type: 'gap', prompt: 'Could the dog catch the ball? — No, it ___.', answer: "couldn't", explain: "No → couldn't.", hint: 'Empieza con No.' }
      ]
    },
    {
      id: 'and', title: 'And', icon: '➕', group: 'connectors', tag: 'and',
      short: 'y — añadir información',
      explain: [
        '<b>And</b> significa <b>y</b>.',
        'Sirve para <b>sumar</b> o añadir información: dos cosas que van juntas.'
      ],
      scheme: [[{ t: 'idea 1', k: 'other', s: '' }, { t: 'and', k: 'conn', s: 'y ➕' }, { t: 'idea 2', k: 'other', s: '' }]],
      examples: [
        ['I like apples and bananas.', 'Me gustan las manzanas y los plátanos.'],
        ['We went to the forest and we saw a deer.', 'Fuimos al bosque y vimos un ciervo.'],
        ['There is a lake and a bridge in my village.', 'Hay un lago y un puente en mi pueblo.']
      ],
      solved: [
        { q: 'I have a pen ___ a pencil.', a: 'and', why: 'Sumamos dos cosas → and.' },
        { q: 'My dog is big ___ friendly.', a: 'and', why: 'Dos cosas buenas que se suman → and.' }
      ],
      mistakes: [
        { wrong: 'I can swim, and I can\'t fly.', right: "I can swim, but I can't fly.", why: 'Si las ideas se oponen (sí / no), es mejor but.' }
      ],
      trick: { icon: '➕', text: 'And es un signo más: suma una cosa a otra.' },
      practice: [
        { type: 'choice', prompt: 'I like the forest ___ the river.', options: ['and', 'but'], answer: 'and', explain: 'Me gustan las dos cosas: se suman → and.', hint: '¿Se suman o se oponen?' },
        { type: 'choice', prompt: 'We swam in the lake ___ we played in the field.', options: ['and', 'but'], answer: 'and', explain: 'Dos cosas que hicimos: se suman → and.', hint: 'Hicimos las dos cosas.' },
        { type: 'gap', prompt: 'I have a dog ___ a cat. (and / but)', answer: 'and', bank: ['and', 'but'], explain: 'Tengo las dos mascotas → and.', hint: 'Suma.' },
        { type: 'truefalse', prompt: 'I like apples but bananas.', answer: false, explain: 'Me gustan las dos → I like apples and bananas.', hint: '¿Se oponen?' }
      ]
    },
    {
      id: 'but', title: 'But', icon: '⚖️', group: 'connectors', tag: 'but',
      short: 'pero — contrastar',
      explain: [
        '<b>But</b> significa <b>pero</b>.',
        'Une dos ideas que se <b>oponen</b> o contrastan: una cosa sí y otra no, o algo inesperado.',
        'Normalmente va con una coma antes: <i>I can swim, but…</i>'
      ],
      scheme: [[{ t: 'idea 1 (sí)', k: 'other', s: '' }, { t: ', but', k: 'conn', s: 'pero ⚖️' }, { t: 'idea 2 (no)', k: 'other', s: '' }]],
      examples: [
        ["I can swim, but I can't fly.", 'Sé nadar, pero no sé volar.'],
        ['The lake was beautiful, but the water was very cold.', 'El lago era bonito, pero el agua estaba muy fría.'],
        ["Tom could run fast, but he couldn't swim.", 'Tom sabía correr rápido, pero no sabía nadar.']
      ],
      solved: [
        { q: "I like dogs, ___ I don't like cats.", a: 'but', why: 'Me gustan / no me gustan → se oponen → but.' },
        { q: "I wanted to cross the river, ___ there wasn't a bridge.", a: 'but', why: 'Quería cruzar, pero algo lo impedía → but.' }
      ],
      mistakes: [
        { wrong: 'I like apples but bananas.', right: 'I like apples and bananas.', why: 'Si no hay contraste (me gustan las dos), se usa and.' }
      ],
      trick: { icon: '⚖️', text: 'But es una balanza: en un lado algo sí, en el otro algo no.' },
      practice: [
        { type: 'choice', prompt: "I can ride a bike, ___ I can't ride a horse.", options: ['and', 'but'], answer: 'but', explain: 'Sé / no sé → contraste → but.', hint: 'Una cosa sí y otra no.' },
        { type: 'choice', prompt: 'The mountain was very high, ___ we climbed to the top.', options: ['and', 'but'], answer: 'but', explain: 'Era difícil y aun así lo hicimos → algo inesperado → but.', hint: '¿Es algo sorprendente?' },
        { type: 'gap', prompt: "Kate can sing, ___ she can't dance. (and / but)", answer: 'but', bank: ['and', 'but'], explain: 'Sabe cantar / no sabe bailar → but.', hint: 'Sí / no.' },
        { type: 'truefalse', prompt: "I can swim, but I can't fly.", answer: true, explain: 'Contraste entre sí y no → but. ¡Correcta!', hint: '¿Se oponen las ideas?' }
      ]
    },
    {
      id: 'so', title: 'So', icon: '➡️', group: 'connectors', tag: 'so',
      short: 'así que — la consecuencia',
      explain: [
        '<b>So</b> significa <b>así que</b> o <b>por eso</b>.',
        'Primero va lo que pasa (la causa) y <b>después de so va el resultado</b> (la consecuencia).'
      ],
      scheme: [[{ t: 'It was raining', k: 'other', s: '1.º causa' }, { t: ', so', k: 'conn', s: 'así que ➡️' }, { t: 'I stayed at home.', k: 'other', s: '2.º consecuencia' }]],
      compare: true,
      examples: [
        ['It was raining, so I stayed at home.', 'Llovía, así que me quedé en casa.'],
        ['I was hungry, so I ate a sandwich.', 'Tenía hambre, así que me comí un bocadillo.'],
        ["The river was deep, so we couldn't cross it.", 'El río era profundo, así que no pudimos cruzarlo.']
      ],
      solved: [
        { q: 'I was tired, ___ I went to bed early.', a: 'so', why: 'Cansada → resultado: me fui a la cama → so.' },
        { q: 'It was very late, ___ we went home.', a: 'so', why: 'Era tarde → resultado: nos fuimos a casa → so.' }
      ],
      mistakes: [
        { wrong: 'I stayed at home, so it was raining.', right: 'It was raining, so I stayed at home.', why: 'Después de so va el resultado, no la causa.' },
        { wrong: 'It was cold, because I put on my coat.', right: 'It was cold, so I put on my coat.', why: 'Ponerse el abrigo es la consecuencia → so.' }
      ],
      trick: { icon: '➡️', text: 'So mira hacia delante: primero pasa algo ➡️ y después viene el resultado.' },
      practice: [
        { type: 'choice', prompt: 'It was cold, ___ I put on my coat.', options: ['so', 'because'], answer: 'so', explain: 'Ponerme el abrigo es el resultado → so.', hint: '¿Lo que viene después es la causa o el resultado?' },
        { type: 'choice', prompt: 'I was thirsty, ___ I drank some water.', options: ['so', 'because'], answer: 'so', explain: 'Beber agua es la consecuencia de tener sed → so.', hint: 'Tenía sed ➡️ …' },
        { type: 'choice', prompt: 'Find the consequence (la consecuencia): "I was tired, so I went to bed early."', options: ['I went to bed early.', 'I was tired.'], answer: 'I went to bed early.', explain: 'Lo que va después de so es la consecuencia.', hint: 'Mira lo que va después de so.' },
        { type: 'gap', prompt: 'The bridge was broken, ___ we stayed in the village. (so / because)', answer: 'so', bank: ['so', 'because'], explain: 'Quedarnos en el pueblo es el resultado → so.', hint: 'El puente roto ➡️ …' }
      ]
    },
    {
      id: 'because', title: 'Because', icon: '🔍', group: 'connectors', tag: 'because',
      short: 'porque — la causa',
      explain: [
        '<b>Because</b> significa <b>porque</b>.',
        '<b>Después de because va la causa</b>: el motivo, el porqué.',
        'Responde a la pregunta <b>Why?</b> (¿Por qué?).'
      ],
      scheme: [[{ t: 'I stayed at home', k: 'other', s: 'lo que pasó' }, { t: 'because', k: 'conn', s: 'porque ⬅️' }, { t: 'it was raining.', k: 'other', s: 'la causa' }]],
      compare: true,
      examples: [
        ['I stayed at home because it was raining.', 'Me quedé en casa porque llovía.'],
        ['My dog barked because it saw a cat.', 'Mi perro ladró porque vio un gato.'],
        ["We couldn't cross the river because there wasn't a bridge.", 'No pudimos cruzar el río porque no había puente.']
      ],
      solved: [
        { q: 'I put on my coat ___ it was cold.', a: 'because', why: '¿Por qué me puse el abrigo? Porque hacía frío → because.' },
        { q: 'We were happy ___ we won the game.', a: 'because', why: 'Ganar es el motivo de estar contentos → because.' }
      ],
      mistakes: [
        { wrong: 'It was raining because I stayed at home.', right: 'I stayed at home because it was raining.', why: 'Después de because va la causa (la lluvia).' },
        { wrong: 'Because it was cold?', right: 'Why…? — Because it was cold.', why: 'Why pregunta, because responde.' }
      ],
      trick: { icon: '🔍', text: 'Because responde a ¿por qué? ¿Por qué me quedé en casa? Because it was raining.' },
      practice: [
        { type: 'choice', prompt: 'I stayed at home ___ it was raining.', options: ['so', 'because'], answer: 'because', explain: 'La lluvia es la causa → because.', hint: '¿Por qué me quedé en casa?' },
        { type: 'choice', prompt: 'Find the cause (la causa): "The children were happy because it was snowing."', options: ['It was snowing.', 'The children were happy.'], answer: 'It was snowing.', explain: 'Lo que va después de because es la causa.', hint: 'Mira lo que va después de because.' },
        { type: 'gap', prompt: 'We stayed in the village ___ the bridge was broken. (so / because)', answer: 'because', bank: ['so', 'because'], explain: 'El puente roto es el motivo → because.', hint: '¿Por qué nos quedamos?' },
        { type: 'choice', prompt: 'Which sentence means the same? "It was late, so I went home."', options: ['I went home because it was late.', 'It was late because I went home.', 'I went home, so it was late.'], answer: 'I went home because it was late.', explain: 'Misma historia: causa = era tarde. Con because, la causa va detrás.', hint: '¿Cuál es la causa? Debe ir después de because.' }
      ]
    }
  ];

  // Normaliza los ejercicios de práctica de cada ficha
  C.forEach(function (card) {
    card.practice.forEach(function (it, i) {
      it.id = 'g-' + card.id + '-' + (i + 1);
      it.skill = card.group === 'could' ? 'could' : 'connectors';
      it.level = it.level || 1;
      it.tags = it.tags || [card.tag];
    });
  });

  var byId = {};
  C.forEach(function (c) { byId[c.id] = c; });
  EQ.grammar = { list: C, get: function (id) { return byId[id]; } };
})(window.EQ);
