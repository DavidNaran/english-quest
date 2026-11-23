/* print.js — Elegir e imprimir fichas A4 (vista previa en pantalla). */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var state = { id: 'vocab', key: true, seed: 1 };

  EQ.router.add('print', 'Imprimir', function (main) {
    main.appendChild(EQ.ui.pageHead('🖨️ Fichas para imprimir', '#/home'));
    var chooser = h('div', { class: 'choice-row' });
    EQ.sheets.SHEETS.forEach(function (s) {
      chooser.appendChild(h('button', { type: 'button', class: 'choice-chip', 'aria-pressed': state.id === s.id ? 'true' : 'false', onclick: function () { state.id = s.id; EQ.router.refresh(); } }, s.icon + ' ' + s.title));
    });
    var keyInp = h('input', { type: 'checkbox' });
    keyInp.checked = state.key;
    keyInp.addEventListener('change', function () { state.key = keyInp.checked; EQ.router.refresh(); });
    var isExam = /^exam/.test(state.id), noVar = isExam || state.id === 'grammar';
    main.appendChild(h('div', { class: 'card stack' },
      h('p', null, 'Elige la ficha:'), chooser,
      h('label', { class: 'switch' }, keyInp, 'Incluir solucionario (en una hoja aparte)'),
      h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn', onclick: doPrint }, '🖨️ Imprimir'),
        noVar ? null : h('button', { type: 'button', class: 'btn secondary', onclick: function () { state.seed = 1 + Math.floor(Math.random() * 9999); EQ.router.refresh(); } }, '🔀 Otra combinación de ejercicios')),
      h('p', { class: 'small muted' }, 'En la ventana de impresión elige tamaño A4 y, si aparece, desactiva "encabezados y pies de página". En la tablet también puedes "Guardar como PDF".')));

    var preview = h('div', { class: 'sheet-preview', 'aria-label': 'Vista previa' });
    EQ.sheets.build(state.id, state.seed, state.key).forEach(function (p) { preview.appendChild(p); });
    main.appendChild(h('h2', { style: { marginTop: '1rem' } }, 'Vista previa'));
    main.appendChild(preview);
  });

  function doPrint() {
    var root = document.getElementById('print-root');
    EQ.clear(root);
    EQ.sheets.build(state.id, state.seed, state.key).forEach(function (p) { root.appendChild(p); });
    setTimeout(function () { window.print(); }, 60);
  }
})(window.EQ);
