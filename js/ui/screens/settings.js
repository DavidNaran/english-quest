/* settings.js — Ajustes de lectura, color, movimiento y voz (con vista previa en vivo). */
(function (EQ) {
  'use strict';
  var h = EQ.h;

  EQ.router.add('settings', 'Ajustes', function (main) {
    var S = EQ.settings;
    var s = S.get();
    function rerender() { var y = window.scrollY; EQ.router.refresh(); window.scrollTo(0, y); }
    function chip(label, pressed, onClick, extra) {
      return h('button', Object.assign({ type: 'button', class: 'choice-chip', 'aria-pressed': pressed ? 'true' : 'false', onclick: function () { onClick(); rerender(); } }, extra || {}), label);
    }
    function stepper(key, label, fmt) {
      var L = S.LIMITS[key];
      return h('div', { class: 'setting' },
        h('span', { class: 'setting-title', id: 'lbl-' + key }, label),
        h('div', { class: 'stepper', role: 'group', 'aria-labelledby': 'lbl-' + key },
          h('button', { type: 'button', class: 'btn secondary', 'aria-label': 'Menos', disabled: s[key] <= L[0] + 1e-9, onclick: function () { S.set(key, s[key] - L[2]); rerender(); } }, '−'),
          h('span', { class: 'value', 'aria-live': 'polite' }, fmt(s[key])),
          h('button', { type: 'button', class: 'btn secondary', 'aria-label': 'Más', disabled: s[key] >= L[1] - 1e-9, onclick: function () { S.set(key, s[key] + L[2]); rerender(); } }, '+')));
    }
    function toggle(key, label) {
      var inp = h('input', { type: 'checkbox' });
      inp.checked = !!s[key];
      inp.addEventListener('change', function () { S.set(key, inp.checked); rerender(); });
      return h('label', { class: 'switch' }, inp, label);
    }

    main.appendChild(EQ.ui.pageHead('⚙️ Ajustes', '#/home'));
    main.appendChild(h('div', { class: 'preview-box', style: { marginBottom: '14px' } },
      h('p', { style: { fontWeight: 700 } }, 'Vista previa'),
      h('p', { lang: 'en' }, 'When I was five, I could swim, but I couldn\'t ride a bike.'),
      h('p', null, 'Cuando tenía cinco años sabía nadar, pero no sabía montar en bici.')));

    var fontRow = h('div', { class: 'choice-row' });
    Object.keys(S.FONTS).forEach(function (k) {
      fontRow.appendChild(chip(S.FONTS[k].label, s.font === k, function () { S.set('font', k); }, { style: { fontFamily: S.FONTS[k].css } }));
    });
    var odNote = (s.font === 'opendyslexic' && !S.hasOpenDyslexic())
      ? h('p', { class: 'notice warn small' }, 'OpenDyslexic no está instalada en este dispositivo, así que se usa Verdana. El README explica cómo añadirla.')
      : null;

    var bgRow = h('div', { class: 'choice-row' });
    S.BGS.forEach(function (b) {
      bgRow.appendChild(h('button', { type: 'button', class: 'swatch' + (b.id === 'dark' ? ' dark' : ''), style: { background: b.color }, 'aria-pressed': s.bg === b.id ? 'true' : 'false', 'aria-label': 'Fondo ' + b.label, title: b.label, onclick: function () { S.set('bg', b.id); rerender(); } }));
    });

    var rateRow = h('div', { class: 'choice-row' });
    [[0.65, '🐢 Muy despacio'], [0.85, '🙂 Despacio'], [1, '🐇 Normal']].forEach(function (r) {
      rateRow.appendChild(chip(r[1], Math.abs(s.rate - r[0]) < 0.01, function () { S.set('rate', r[0]); }));
    });

    var voiceBox = h('div');
    function fillVoices() {
      EQ.clear(voiceBox);
      if (!EQ.speech.supported) { voiceBox.appendChild(h('p', { class: 'notice warn' }, 'Este navegador no tiene síntesis de voz. Los ejercicios de escuchar se convierten en "mira y elige / mira y escribe".')); return; }
      var list = EQ.speech.englishVoices();
      if (!list.length) { voiceBox.appendChild(h('p', { class: 'small muted' }, 'Buscando voces en inglés… Si no aparece ninguna, instala una voz inglesa en los ajustes del dispositivo (en iPad: Ajustes › Accesibilidad › Contenido leído › Voces).')); return; }
      var sel = h('select', { class: 'big', 'aria-label': 'Voz en inglés' });
      sel.appendChild(h('option', { value: '' }, 'Automática (recomendada)'));
      list.forEach(function (v) { var o = h('option', { value: v.voiceURI }, v.name + ' (' + v.lang + ')'); if (v.voiceURI === s.voiceEn) o.selected = true; sel.appendChild(o); });
      sel.addEventListener('change', function () { S.set('voiceEn', sel.value); EQ.speech.say('Hello! I could swim when I was five.'); });
      voiceBox.appendChild(sel);
    }
    fillVoices();
    if (EQ.speech.supported && !EQ.speech.englishVoices().length) setTimeout(fillVoices, 800);

    main.appendChild(h('div', { class: 'card' },
      h('div', { class: 'setting' }, h('span', { class: 'setting-title' }, '🔤 Tipo de letra'), fontRow, odNote),
      stepper('size', '🔠 Tamaño de letra', function (v) { return v + ' px'; }),
      stepper('letter', '↔️ Espacio entre letras', function (v) { return v.toFixed(2) + ' em'; }),
      stepper('word', '⬌ Espacio entre palabras', function (v) { return v.toFixed(1) + ' em'; }),
      stepper('line', '↕️ Espacio entre líneas', function (v) { return v.toFixed(2); }),
      h('div', { class: 'setting' }, h('span', { class: 'setting-title' }, '🎨 Color del fondo'), bgRow),
      h('div', { class: 'setting' }, h('span', { class: 'setting-title' }, '✨ Movimiento'), toggle('motion', 'Animaciones suaves'), h('br'), toggle('celebrate', 'Celebraciones con estrellas')),
      h('div', { class: 'setting' }, h('span', { class: 'setting-title' }, '🔊 Voz'),
        rateRow, h('div', { style: { marginTop: '10px' } }, toggle('autoRead', 'Leer las instrucciones en voz alta automáticamente')),
        h('div', { style: { marginTop: '10px' } }, voiceBox),
        h('div', { class: 'btn-row' }, EQ.speech.button('Hello! When I was five, I could swim.', { showLabel: 'Probar inglés' }), EQ.speech.button('Hola, soy Kiko. ¡Vamos a aprender inglés!', { lang: 'es', showLabel: 'Probar español' }))),
      h('div', { class: 'setting' }, h('button', { type: 'button', class: 'btn secondary', onclick: function () { S.reset(); rerender(); EQ.ui.toast('Ajustes como al principio ✔'); } }, '↺ Volver a los ajustes iniciales'))));
  });
})(window.EQ);
