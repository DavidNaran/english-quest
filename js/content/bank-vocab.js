/* bank-vocab.js — Cuaderno: 60 ejercicios de vocabulario (3 por palabra).
   Nivel 1: reconocer (imagen → palabra)
   Nivel 2: letras que faltan / ordenar letras / escuchar y elegir / traducir al español
   Nivel 3: escribir la palabra completa (desde imagen + español, o escuchándola)
   Los distractores son fijos (deterministas) para que los ejercicios sean siempre los mismos. */
(function (EQ) {
  'use strict';
  var V = EQ.vocab.list;
  var items = [];
  // Distractores pensados por parecido de significado o de forma
  var DIS = {
    mountain: ['island', 'forest'], forest: ['field', 'village'], village: ['bridge', 'forest'], field: ['lake', 'path'],
    lake: ['river', 'island'], island: ['lake', 'mountain'], river: ['path', 'lake'], path: ['river', 'bridge'],
    bridge: ['path', 'village'], late: ['early', 'meet'], meet: ['show', 'ask'], early: ['late', 'keep'],
    ask: ['answer', 'show'], answer: ['ask', 'meet'], show: ['keep', 'answer'], bark: ['catch', 'build'],
    catch: ['keep', 'bark'], build: ['catch', 'show'], keep: ['catch', 'build'], pocket: ['bridge', 'path']
  };
  var en = function (id) { return EQ.vocab.get(id).en; };

  // Letras ocultas para "Missing letters" (índices sobre la forma base)
  var HIDE = { mountain: [3, 5], forest: [3], village: [3, 5], field: [2], lake: [2], island: [1], river: [3], path: [2], bridge: [3], late: [1],
               meet: [2], early: [1, 2], ask: [1], answer: [3, 4], show: [2], bark: [2], catch: [2], build: [1], keep: [2], pocket: [2] };

  V.forEach(function (v, i) {
    var opts = [v.en].concat(DIS[v.id].map(en));
    // Nivel 1: reconocer la imagen
    items.push({
      id: 'v1-' + v.id, skill: 'vocab', level: 1, type: 'choice', icon: v.id,
      instr: '¿Qué es? Elige la palabra.', prompt: '', options: opts, answer: v.en,
      explain: v.en + ' = ' + v.esLabel + '.', hint: 'Empieza por "' + v.base[0] + '".', tags: [v.id]
    });

    // Nivel 2: alterna cuatro mecánicas distintas
    var m = i % 4, it;
    if (m === 0) {
      it = { type: 'missing', word: v.base, hide: HIDE[v.id], instr: 'Completa las letras que faltan.', icon: v.id, es: v.esLabel };
    } else if (m === 1) {
      it = { type: 'letters', word: v.base, instr: 'Ordena las letras para escribir la palabra.', icon: v.id, es: v.esLabel };
    } else if (m === 2) {
      it = { type: 'listen-choice', say: v.base, instr: 'Escucha y elige la palabra que oyes.', options: opts, answer: v.en, icon: v.id };
    } else {
      it = { type: 'translate', prompt: v.en, answer: v.es, instr: '¿Qué significa en español? Escríbelo.', icon: v.id };
    }
    it.id = 'v2-' + v.id; it.skill = 'vocab'; it.level = 2; it.tags = [v.id];
    it.explain = v.en + ' = ' + v.esLabel + '.';
    it.hint = m === 3 ? 'Mira el dibujo.' : 'Tiene ' + v.base.length + ' letras y empieza por "' + v.base[0] + '".';
    items.push(it);

    // Nivel 3: escribir la palabra
    var w = i % 2 === 0
      ? { type: 'write', instr: 'Escribe la palabra en inglés.', icon: v.id, es: v.esLabel }
      : { type: 'listen-write', say: v.base, instr: 'Escucha y escribe la palabra.', icon: v.id, es: v.esLabel };
    w.id = 'v3-' + v.id; w.skill = 'vocab'; w.level = 3; w.tags = [v.id]; w.word = v.id;
    w.explain = 'Se escribe ' + v.base.toUpperCase().split('').join(' ') + '.';
    w.hint = 'Empieza por "' + v.base[0] + '" y tiene ' + v.base.length + ' letras.';
    items.push(w);
  });

  EQ.bank = EQ.bank || {};
  EQ.bank.vocab = items;
})(window.EQ);
