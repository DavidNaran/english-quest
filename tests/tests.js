/* tests.js — Tests del corrector, de la repetición espaciada y validador de contenidos. */
(function (EQ) {
  'use strict';
  var results = [], groups = [];
  var current = null;
  function group(name, fn) { current = { name: name, items: [] }; groups.push(current); try { fn(); } catch (e) { ok(false, 'Excepción: ' + e.message + '\n' + e.stack); } }
  function ok(cond, msg) { current.items.push({ pass: !!cond, msg: msg }); results.push(!!cond); }
  function eq(a, b, msg) { ok(a === b, msg + ' (esperado: ' + JSON.stringify(b) + ', obtenido: ' + JSON.stringify(a) + ')'); }
  var C = EQ.checker.check;

  /* ======================= Corrector ======================= */
  group('Corrector: ortografía (write)', function () {
    var it = { id: 't1', type: 'write', word: 'mountain', tags: ['mountain'] };
    eq(C(it, 'mountain').correct, true, 'mountain correcto');
    eq(C(it, '  MOUNTAIN ').correct, true, 'mayúsculas y espacios no importan');
    var r = C(it, 'MOUNTAN');
    eq(r.correct, false, 'MOUNTAN no es correcto');
    eq(r.kind, 'spelling', 'MOUNTAN es error ortográfico (no de significado)');
    eq(r.diff.info.msg, '¡Casi lo tienes! Falta una letra.', 'mensaje "Falta una letra"');
    eq(r.diff.ops.filter(function (o) { return o.op === 'miss'; }).length, 1, 'una letra marcada como que falta');
    eq(C(it, 'muontain').kind, 'spelling', 'letras cambiadas de sitio = ortografía');
    eq(C(it, 'muontain').diff.info.swap, true, 'detecta letras intercambiadas');
    eq(C(it, 'forest').kind, 'comprehension', 'otra palabra del vocabulario = comprensión');
    eq(C(it, 'xyz').kind, 'comprehension', 'algo muy distinto = no la recuerda (comprensión)');
    eq(C(it, '').kind, 'empty', 'vacío');
    var v = { id: 't2', type: 'write', word: 'meet', tags: ['meet'] };
    eq(C(v, 'to meet').correct, true, '"to meet" aceptado');
    eq(C(v, 'meet').correct, true, '"meet" aceptado');
    eq(C(v, 'To Meet').correct, true, '"To Meet" aceptado');
    eq(C(v, 'met').kind, 'spelling', '"met" → ortografía (cerca)');
    var b = { id: 't3', type: 'listen-write', word: 'bridge', tags: ['bridge'] };
    eq(C(b, 'brige').kind, 'spelling', 'brige → ortografía');
    eq(C(b, 'brige').points, 0.5, 'casi = medio punto');
    var lk = { id: 't4', type: 'write', word: 'lake', tags: ['lake'] };
    eq(C(lk, 'late').kind, 'comprehension', 'late en vez de lake = otra palabra del vocabulario');
    ok(!!C(lk, 'late').other, 'indica qué significa la palabra escrita');
  });

  group("Corrector: could / couldn't", function () {
    var g = { id: 't5', type: 'gap', prompt: 'I ___ swim.', answer: "couldn't", tags: ['couldnt'], bank: ['could', "couldn't"] };
    eq(C(g, "couldn't").correct, true, "couldn't");
    eq(C(g, 'couldn’t').correct, true, 'couldn’t (apóstrofo tipográfico)');
    eq(C(g, 'could not').correct, true, '"could not" aceptado');
    eq(C(g, 'Could Not').correct, true, '"Could Not" aceptado');
    eq(C(g, 'couldnt').correct, true, 'couldnt sin apóstrofo → aceptado (nota ortográfica)');
    eq(C(g, 'could').kind, 'grammar', 'could en vez de couldn\'t = error gramatical');
    eq(C(g, 'coudn\'t').correct, true, "coudn't = acierto con nota de ortografía");
    eq(C(g, 'coudn\'t').note, 'spelling', 'lleva nota de ortografía');
    var q = { id: 't6', type: 'gap', prompt: '___ you swim?', answer: 'could', noLong: true, tags: ['question'] };
    eq(C(q, 'Could').correct, true, 'Could con mayúscula');
    eq(C(q, 'can').kind, 'grammar', 'can → gramática');
    var cn = { id: 't7', type: 'gap', prompt: 'It was cold, ___ I put on my coat.', answer: 'so', bank: ['so', 'because'], tags: ['so'] };
    eq(C(cn, 'because').kind, 'grammar', 'because en vez de so = gramática');
    eq(C(cn, 'So').correct, true, 'So con mayúscula');
  });

  group('Corrector: traducción, opciones y orden', function () {
    var t = { id: 't8', type: 'translate', prompt: 'River', answer: ['río'], tags: ['river'] };
    eq(C(t, 'rio').correct, true, 'sin tilde aceptado');
    eq(C(t, 'El río').correct, true, 'con artículo aceptado');
    eq(C(t, 'rion').correct, true, 'falta leve en español aceptada');
    eq(C(t, 'lago').kind, 'comprehension', 'lago = comprensión');
    var ch = { id: 't9', type: 'choice', options: ['Mountain', 'Island'], answer: 'Mountain', tags: ['mountain'] };
    eq(C(ch, 'Island').kind, 'comprehension', 'opción de vocabulario errónea = comprensión');
    var ch2 = { id: 't10', type: 'choice', options: ['could', "couldn't"], answer: 'could', tags: ['could'] };
    eq(C(ch2, "couldn't").kind, 'grammar', 'opción gramatical errónea = gramática');
    var o = { id: 't11', type: 'order', answer: 'I like the forest and the lake.', accept: ['I like the lake and the forest.'], tags: ['order'] };
    eq(C(o, ['I', 'like', 'the', 'forest', 'and', 'the', 'lake']).correct, true, 'orden correcto');
    eq(C(o, ['I', 'like', 'the', 'lake', 'and', 'the', 'forest']).correct, true, 'orden alternativo aceptado');
    var bad = C(o, ['like', 'I', 'the', 'forest', 'and', 'the', 'lake']);
    eq(bad.kind, 'order', 'orden incorrecto');
    eq(bad.firstBad, 0, 'señala la primera palabra mal colocada');
    eq(C(o, ['I', 'like']).incomplete, true, 'detecta frase incompleta');
    var tf = { id: 't12', type: 'truefalse', answer: false, skill: 'could', tags: ['could'] };
    eq(C(tf, false).correct, true, 'verdadero/falso');
  });

  group('Normalización', function () {
    eq(EQ.norm.base('  Hello   World!  '), 'hello world', 'espacios y puntuación final');
    eq(EQ.norm.contract("i could not swim"), "i couldn't swim", 'could not → couldn\'t');
    eq(EQ.norm.esFold('La Montaña'), 'montana', 'tildes y artículo');
  });

  /* ======================= Repetición espaciada ======================= */
  group('Repetición espaciada y maestría', function () {
    var d = EQ.store.data;
    d.srs = {}; d.items = {}; d.errors = {};
    var mc = { id: 'x1', type: 'choice', options: ['Lake', 'River'], answer: 'Lake', tags: ['lake'] };
    EQ.srs.record(mc, { correct: true, kind: 'ok' }, { attempt: 1 });
    EQ.srs.record(Object.assign({}, mc, { id: 'x2' }), { correct: true, kind: 'ok' }, { attempt: 1 });
    EQ.srs.record(Object.assign({}, mc, { id: 'x3' }), { correct: true, kind: 'ok' }, { attempt: 1 });
    eq(EQ.srs.get('lake').box, 3, 'tres aciertos → caja 3');
    ok(EQ.srs.status('lake') !== 'mastered', 'NO está dominada solo con opción múltiple');
    var wr = { id: 'x4', type: 'write', word: 'lake', tags: ['lake'] };
    d.session.n = 1;
    EQ.srs.record(wr, { correct: true, kind: 'ok' }, { attempt: 1 });
    ok(EQ.srs.status('lake') !== 'mastered', 'escrita bien en una sola sesión → todavía no dominada');
    d.session.n = 2;
    EQ.srs.record(Object.assign({}, wr, { id: 'x5' }), { correct: true, kind: 'ok' }, { attempt: 1 });
    eq(EQ.srs.status('lake'), 'mastered', 'reconocida + escrita en 2 sesiones → dominada');
    EQ.srs.record(Object.assign({}, wr, { id: 'x6', tags: ['river'] }), { correct: false, kind: 'spelling', typed: 'rivr', target: 'river' }, { attempt: 1, runId: 'a' });
    ok(d.errors.x6 && d.errors.x6.open, 'el fallo queda pendiente de repaso');
    ok(d.spelling.some(function (s) { return s.wrote === 'rivr'; }), 'se registra el error ortográfico');
    ok(EQ.srs.weakness('river') > EQ.srs.weakness('lake'), 'lo fallado pesa más que lo dominado');
    EQ.srs.record(Object.assign({}, wr, { id: 'x6', tags: ['river'] }), { correct: true, kind: 'ok' }, { attempt: 1, runId: 'b' });
    eq(d.errors.x6.open, false, 'acertarlo después cierra el error');
    d.srs = {}; d.items = {}; d.errors = {}; d.spelling = []; d.session.n = 1;
  });

  /* ======================= Contenidos ======================= */
  group('Contenidos: cantidades', function () {
    eq(EQ.bank.could.length, 40, "40 ejercicios de could/couldn't");
    eq(EQ.bank.connectors.length, 40, '40 ejercicios de conectores');
    eq(EQ.bank.vocab.length, 60, '60 ejercicios de vocabulario');
    eq(EQ.bank.sentences.length, 30, '30 de construcción de frases');
    eq(EQ.bank.mixed.length, 20, '20 mixtos');
    EQ.content.TOPICS.forEach(function (t) {
      [1, 2, 3].forEach(function (l) { ok(t.bank.some(function (x) { return x.level === l; }), t.title + ': tiene nivel ' + l); });
    });
    var sb = EQ.bank.connectors.filter(function (x) { return x.tags.indexOf('so') >= 0 || x.tags.indexOf('because') >= 0; }).length;
    ok(sb >= 15, 'al menos 15 ejercicios de so/because (hay ' + sb + ')');
    eq(EQ.grammar.list.length, 8, '8 fichas de gramática');
    eq(EQ.exams.list.length, 5, '5 exámenes');
  });

  group('Contenidos: vocabulario oficial', function () {
    var official = ['Mountain', 'Forest', 'Village', 'Field', 'Lake', 'Island', 'River', 'Path', 'Bridge', 'Late', 'To meet', 'Early', 'To ask', 'To answer', 'To show', 'To bark', 'To catch', 'To build', 'To keep', 'Pocket'];
    eq(EQ.vocab.list.map(function (v) { return v.en; }).join('|'), official.join('|'), 'las 20 palabras, en orden y bien escritas');
    EQ.vocab.list.forEach(function (v) { ok(EQ.art.has(v.id), 'ilustración para ' + v.en); });
    var nb = EQ.content.notebook();
    EQ.vocab.ids.forEach(function (id) {
      var its = nb.filter(function (x) { return (x.tags || []).indexOf(id) >= 0; });
      ok(its.some(function (x) { return EQ.srs.skillKind(x) === 'recog'; }), id + ': ejercicio de reconocimiento');
      ok(its.some(function (x) { return EQ.srs.skillKind(x) === 'spell'; }), id + ': ejercicio de escritura');
      var exams = EQ.exams.list.filter(function (e) { return e.list.some(function (x) { return (x.tags || []).indexOf(id) >= 0; }); }).length;
      ok(exams >= 2, id + ': aparece en ' + exams + ' exámenes (mín. 2)');
    });
  });

  group('Contenidos: exámenes', function () {
    EQ.exams.list.forEach(function (e) {
      eq(e.list.length, 20, e.title + ': 20 preguntas');
      EQ.exams.ORDER.forEach(function (s) { ok(e.list.some(function (x) { return x.section === s; }), e.title + ': sección ' + s); });
    });
  });

  function correctResponse(it) {
    switch (it.type) {
      case 'choice': case 'listen-choice': case 'truefalse': return it.answer;
      case 'gap': return Array.isArray(it.answer) ? it.answer[0] : it.answer;
      case 'translate': return Array.isArray(it.answer) ? it.answer[0] : it.answer;
      case 'order': return it.answer.replace(/[.?!]$/, '').split(' ');
      case 'match': return { mistakes: 0 };
      default: return EQ.checker.spellTarget(it);
    }
  }
  /** Texto que se presenta como correcto (para revisar la gramática). */
  function correctTexts(it) {
    var out = [];
    if (it.type === 'gap' && it.prompt) out.push(it.prompt.replace(/_{2,}/, Array.isArray(it.answer) ? it.answer[0] : it.answer).replace(/\(.*?\)/g, ''));
    else if (it.type === 'choice' && it.prompt && /_{2,}/.test(it.prompt)) out.push(it.prompt.replace(/_{2,}/, it.answer));
    else if (it.type === 'choice' && /\s/.test(it.answer)) out.push(it.answer);
    else if (it.type === 'truefalse' && it.answer === true) out.push(it.prompt);
    else if (it.type === 'order') out.push(it.answer);
    return out;
  }

  group('Contenidos: coherencia de cada ejercicio', function () {
    var all = EQ.content.all();
    var ids = {};
    var BAD_AFTER_COULD = /\bcould(n't)?\s+(to\s|\w+ed\b|swam|ran|built|met|caught|flew|wrote|rode|knew|saw|went|came|kept|showed|asked|answered|barked)/i;
    var problems = 0;
    all.forEach(function (it) {
      if (ids[it.id]) { ok(false, 'id repetido: ' + it.id); problems++; }
      ids[it.id] = 1;
      if (!EQ.renderers && !it.type) { ok(false, it.id + ': sin tipo'); problems++; }
      if (!it.explain && it.type !== 'match') { ok(false, it.id + ': falta la explicación'); problems++; }
      if (it.type === 'choice' || it.type === 'listen-choice') {
        if (it.options.indexOf(it.answer) < 0) { ok(false, it.id + ': la respuesta no está entre las opciones'); problems++; }
        var uniq = {}; it.options.forEach(function (o) { uniq[EQ.norm.base(o)] = (uniq[EQ.norm.base(o)] || 0) + 1; });
        if (Object.keys(uniq).some(function (k) { return uniq[k] > 1; })) { ok(false, it.id + ': opciones repetidas'); problems++; }
      }
      if (it.type === 'gap' && (it.prompt.match(/_{2,}/g) || []).length !== 1) { ok(false, it.id + ': el hueco debe aparecer una vez'); problems++; }
      var res = EQ.checker.check(it, correctResponse(it));
      if (!res.correct) { ok(false, it.id + ': el corrector no acepta su propia respuesta (' + JSON.stringify(correctResponse(it)) + ')'); problems++; }
      correctTexts(it).forEach(function (txt) {
        if (BAD_AFTER_COULD.test(txt)) { ok(false, it.id + ': después de could/couldn\'t debe ir el verbo base → "' + txt + '"'); problems++; }
      });
      if (it.type === 'choice' && it.options) {
        it.options.forEach(function (o) {
          if (o !== it.answer && EQ.checker.check(it, o).correct) { ok(false, it.id + ': dos opciones correctas'); problems++; }
        });
      }
    });
    EQ.grammar.list.forEach(function (c) {
      c.examples.forEach(function (e) { if (BAD_AFTER_COULD.test(e[0])) { ok(false, c.id + ': ejemplo con verbo no base: ' + e[0]); problems++; } });
    });
    ok(problems === 0, 'Revisados ' + all.length + ' ejercicios: ' + problems + ' problemas');
  });

  group('Contenidos: tiempo estimado', function () {
    var n = EQ.content.notebook().length + EQ.exams.list.reduce(function (a, e) { return a + e.list.length; }, 0) + EQ.grammar.list.reduce(function (a, c) { return a + c.practice.length; }, 0);
    var min = Math.round(n * 0.6 + 20 * 2 + 8 * 4);
    ok(n >= 300, n + ' ejercicios distintos + 20 fichas de vocabulario + 8 de gramática ≈ ' + min + ' min de trabajo (sin contar repasos)');
  });

  group('Fichas imprimibles', function () {
    EQ.sheets.SHEETS.forEach(function (s) {
      var pages = EQ.sheets.build(s.id, 7, true);
      ok(pages.length >= 1, s.title + ': ' + pages.length + ' página(s)');
      var again = EQ.sheets.build(s.id, 7, true);
      eq(again[0].textContent, pages[0].textContent, s.title + ': la misma semilla genera la misma ficha');
    });
  });

  /* ======================= Informe ======================= */
  var out = document.getElementById('out');
  var fails = results.filter(function (x) { return !x; }).length;
  groups.forEach(function (g) {
    var f = g.items.filter(function (i) { return !i.pass; }).length;
    var sec = document.createElement('section');
    sec.innerHTML = '<h2 class="' + (f ? 'fail' : 'pass') + '">' + (f ? '✘ ' : '✔ ') + g.name + ' (' + (g.items.length - f) + '/' + g.items.length + ')</h2>';
    var ul = document.createElement('ul');
    g.items.forEach(function (i) {
      if (i.pass && !/Revisados|ejercicios distintos/.test(i.msg)) return;
      var li = document.createElement('li'); li.className = i.pass ? 'pass' : 'fail';
      li.textContent = (i.pass ? '✔ ' : '✘ ') + i.msg; ul.appendChild(li);
    });
    sec.appendChild(ul); out.appendChild(sec);
  });
  var sum = document.getElementById('summary');
  sum.textContent = (fails ? '✘ ' + fails + ' fallos de ' : '✔ Todo correcto: ') + results.length + ' comprobaciones';
  sum.className = fails ? 'fail' : 'pass';
  window.__TEST_RESULT = { total: results.length, fails: fails, failures: [].concat.apply([], groups.map(function (g) { return g.items.filter(function (i) { return !i.pass; }).map(function (i) { return g.name + ': ' + i.msg; }); })) };
})(window.EQ);
