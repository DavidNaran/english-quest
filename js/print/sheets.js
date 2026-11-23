/* sheets.js — Fichas A4 imprimibles con solucionario en página aparte.
   Las fichas usan una semilla: la misma semilla produce la misma ficha. */
(function (EQ) {
  'use strict';
  var h = EQ.h;

  var SHEETS = [
    { id: 'vocab', title: 'Vocabulario · Unit 2', icon: '🏞️' },
    { id: 'grammar', title: 'Resumen de gramática', icon: '📘', noKey: true },
    { id: 'could', title: "Could y couldn't", icon: '🦸' },
    { id: 'connectors', title: 'And, but, so, because', icon: '🔗' },
    { id: 'sentence', title: 'Construir frases', icon: '🧱' },
    { id: 'mixed', title: 'Repaso mixto', icon: '🎲' },
    { id: 'exam1', title: 'Examen 1', icon: '📝' }, { id: 'exam2', title: 'Examen 2', icon: '📝' },
    { id: 'exam3', title: 'Examen 3', icon: '📝' }, { id: 'exam4', title: 'Examen 4', icon: '📝' },
    { id: 'exam5', title: 'Examen 5', icon: '📝' }
  ];

  function head(title) {
    return h('div', { class: 'sheet-head' }, h('div', null, h('h1', null, title), h('div', { class: 'name-line' }, 'English · 4.º de Primaria · Unit 2')),
      h('div', { class: 'name-line' }, 'Nombre: ____________________', h('br'), 'Fecha: ______________'));
  }
  function line(long) { return h('span', { class: 'line' + (long ? ' long' : '') }); }
  function withLines(text) {
    var span = h('span');
    String(text).split(/(_{2,})/).forEach(function (p) { if (/^_{2,}$/.test(p)) span.appendChild(line()); else span.appendChild(document.createTextNode(p)); });
    return span;
  }
  function pic(id) { return h('span', { class: 'pic-p', html: EQ.art.icon(id) }); }

  /** Un ejercicio en papel. */
  function paperItem(it, rnd) {
    var li = h('li');
    switch (it.type) {
      case 'choice': case 'listen-choice':
        if (it.icon && !it.prompt) li.appendChild(pic(it.icon));
        else if (it.prompt) li.appendChild(withLines(it.prompt));
        li.appendChild(h('div', { class: 'opts' }, EQ.shuffle(it.options, rnd).map(function (o) { return h('span', { class: 'opt-p' }, o); })));
        break;
      case 'truefalse':
        li.appendChild(h('span', { class: 'tf-p' }, it.prompt));
        break;
      case 'gap':
        li.appendChild(withLines(it.prompt));
        break;
      case 'translate':
        li.appendChild(h('span', null, h('b', null, it.prompt), ' = ', line()));
        break;
      case 'write': case 'listen-write':
        li.appendChild(h('span', { class: 'vcell' }, pic(it.word), h('span', null, '(' + (it.es || EQ.vocab.get(it.word).esLabel) + ') ', line())));
        break;
      case 'missing':
        var w = EQ.vocab.get(it.word).base;
        li.appendChild(h('span', { class: 'missing-p' }, w.split('').map(function (c, i) { return (it.hide || []).indexOf(i) >= 0 ? '_' : c; }).join(' ')));
        li.appendChild(h('span', null, '  (' + it.es + ')'));
        break;
      case 'letters':
        var b = EQ.vocab.get(it.word).base;
        li.appendChild(h('span', null, h('span', { class: 'missing-p' }, EQ.shuffleDifferent(b.replace(/\s/g, '').split(''), rnd).join(' ')), '  (' + it.es + ') → ', line()));
        break;
      case 'order':
        var words = it.answer.replace(/[.?!]$/, '').split(' ');
        li.appendChild(h('div', { class: 'tiles-p' }, EQ.shuffleDifferent(words, rnd).map(function (x) { return h('span', { class: 'tile-p' }, x); })));
        li.appendChild(line(true));
        break;
      default:
        li.appendChild(document.createTextNode(it.prompt || ''));
    }
    return li;
  }
  function keyText(it) {
    if (it.type === 'translate') return (Array.isArray(it.answer) ? it.answer.join(' / ') : it.answer);
    return EQ.feedback.answerText(it);
  }
  function keyList(items) {
    return h('ol', { class: 'key' }, items.map(function (it) { return h('li', null, h('span', { class: 'ans' }, keyText(it)), it.explain ? h('span', { class: 'why' }, ' — ' + it.explain) : null); }));
  }

  function sample(bank, n, rnd) {
    var by = [1, 2, 3].map(function (l) { return EQ.shuffle(bank.filter(function (x) { return x.level === l; }), rnd); });
    var per = Math.ceil(n / 3), out = [];
    by.forEach(function (list) { out = out.concat(list.slice(0, per)); });
    return out.slice(0, n);
  }

  var INSTR = {
    choice: 'Rodea la respuesta correcta.', truefalse: 'Marca si la frase está bien o tiene un error.', gap: 'Completa los huecos.',
    translate: 'Escribe el significado en español.', write: 'Escribe la palabra en inglés.', missing: 'Completa las letras que faltan.',
    letters: 'Ordena las letras y escribe la palabra.', order: 'Ordena las palabras y escribe la frase.'
  };
  function paperType(t) { return t === 'listen-choice' ? 'choice' : t === 'listen-write' ? 'write' : t; }

  /** Agrupa los ejercicios por tipo, con una instrucción por bloque. */
  function blocks(items, rnd, titles) {
    var groups = [], cur = null;
    items.forEach(function (it) {
      var t = titles ? it.section : paperType(it.type);
      if (!cur || cur.t !== t) { cur = { t: t, items: [] }; groups.push(cur); }
      cur.items.push(it);
    });
    var n = 0, frag = document.createDocumentFragment(), flat = [];
    groups.forEach(function (g) {
      var title = titles ? (EQ.exams.SECTIONS[g.t].letter + '. ' + EQ.exams.SECTIONS[g.t].title) : (INSTR[g.t] || '');
      frag.appendChild(h('h2', null, title));
      var twoCols = !titles && ['write', 'translate', 'missing', 'letters'].indexOf(g.t) >= 0;
      var ol = h('ol', { start: String(n + 1), class: twoCols ? 'cols' : null });
      g.items.forEach(function (it) { ol.appendChild(paperItem(Object.assign({}, it, { type: paperType(it.type) }), rnd)); flat.push(it); n++; });
      frag.appendChild(ol);
    });
    return { node: frag, flat: flat };
  }

  function grammarSheet() {
    var pages = [], page = null;
    EQ.grammar.list.forEach(function (c, i) {
      if (i % 4 === 0) { page = h('section', { class: 'sheet' }, head('Resumen de gramática' + (i ? ' (continuación)' : ''))); pages.push(page); }
      page.appendChild(h('h2', null, c.icon + ' ' + c.title + ' — ' + c.short));
      page.appendChild(h('p', { html: c.explain.join(' ') }));
      page.appendChild(h('p', null, h('b', null, 'Esquema: '), c.scheme.map(function (r) { return r.map(function (b) { return b.t; }).join(' + '); }).join('   |   ')));
      page.appendChild(h('ul', null, c.examples.slice(0, 2).map(function (e) { return h('li', null, h('b', null, e[0]), ' — ' + e[1]); })));
      page.appendChild(h('p', null, '💡 ' + c.trick.text));
    });
    return pages;
  }

  /** Genera las páginas de una ficha. Devuelve [nodo página, ...] */
  function build(id, seed, withKey) {
    var rnd = EQ.rng(seed || 1);
    var meta = SHEETS.filter(function (s) { return s.id === id; })[0] || SHEETS[0];
    if (id === 'grammar') return grammarSheet();
    var items, titles = false;
    if (/^exam\d$/.test(id)) { items = EQ.exams.get(parseInt(id.slice(4), 10)).list; titles = true; }
    else if (id === 'vocab') {
      var words = EQ.shuffle(EQ.vocab.list, rnd);
      items = words.slice(0, 8).map(function (v) { return { type: 'write', word: v.id, es: v.esLabel, explain: v.en + ' = ' + v.esLabel, answer: v.base }; })
        .concat(words.slice(8, 14).map(function (v) { return { type: 'translate', prompt: v.en, answer: v.es, explain: '' }; }))
        .concat(words.slice(14, 17).map(function (v) { return EQ.content.item('v2-' + v.id).type === 'missing' ? EQ.content.item('v2-' + v.id) : { type: 'letters', word: v.id, es: v.esLabel, explain: '' }; }))
        .concat(words.slice(17, 20).map(function (v) { return { type: 'letters', word: v.id, es: v.esLabel, explain: '' }; }));
    } else {
      var t = EQ.content.topic(id);
      items = sample(t.bank, id === 'sentence' ? 10 : 14, rnd);
    }
    var b = blocks(items, rnd, titles);
    var sheet = h('section', { class: 'sheet' }, head(meta.title), b.node, h('p', { class: 'foot' }, 'English Quest · ficha n.º ' + seed));
    var pages = [sheet];
    if (withKey && !meta.noKey) {
      pages.push(h('section', { class: 'sheet' }, head('Solucionario · ' + meta.title), h('p', { class: 'foot' }, 'Para el profesor o la familia. Ficha n.º ' + seed), keyList(b.flat)));
    }
    return pages;
  }

  EQ.sheets = { SHEETS: SHEETS, build: build };
})(window.EQ);
