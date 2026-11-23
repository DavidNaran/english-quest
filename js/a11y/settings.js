/* settings.js — Preferencias visuales y de audio. Se aplican como variables CSS. */
(function (EQ) {
  'use strict';

  var FONTS = {
    verdana: { label: 'Verdana', css: 'Verdana, Tahoma, "DejaVu Sans", sans-serif' },
    arial: { label: 'Arial', css: 'Arial, Helvetica, "Liberation Sans", sans-serif' },
    opendyslexic: { label: 'OpenDyslexic', css: '"OpenDyslexic", Verdana, Tahoma, sans-serif' }
  };
  var BGS = [
    { id: 'cream', label: 'Crema', color: '#fbf5e9' },
    { id: 'peach', label: 'Melocotón', color: '#fcebdd' },
    { id: 'blue', label: 'Azul', color: '#e6f0fa' },
    { id: 'green', label: 'Verde', color: '#e7f4ea' },
    { id: 'grey', label: 'Gris', color: '#eeeeec' },
    { id: 'white', label: 'Blanco', color: '#ffffff' },
    { id: 'dark', label: 'Oscuro', color: '#1f2430' }
  ];
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var DEFAULTS = {
    font: 'verdana',
    size: 20,          // px (16-30)
    letter: 0.03,      // em (0 - 0.2)
    word: 0.12,        // em (0 - 0.6)
    line: 1.6,         // (1.3 - 2.2)
    bg: 'cream',
    motion: !reduced,
    rate: 0.85,        // velocidad de voz en inglés
    autoRead: false,   // leer instrucciones automáticamente
    voiceEn: '',       // voiceURI preferida
    celebrate: true
  };
  var LIMITS = { size: [16, 30, 2], letter: [0, 0.2, 0.03], word: [0, 0.6, 0.1], line: [1.3, 2.2, 0.15] };

  function get() {
    var s = EQ.store.data.settings;
    Object.keys(DEFAULTS).forEach(function (k) { if (s[k] === undefined) s[k] = DEFAULTS[k]; });
    return s;
  }

  function apply() {
    var s = get();
    var root = document.documentElement.style;
    root.setProperty('--font', (FONTS[s.font] || FONTS.verdana).css);
    root.setProperty('--fs', s.size + 'px');
    root.setProperty('--ls', s.letter.toFixed(2) + 'em');
    root.setProperty('--ws', s.word.toFixed(2) + 'em');
    root.setProperty('--lh', String(s.line.toFixed(2)));
    document.documentElement.setAttribute('data-bg', s.bg);
    document.documentElement.setAttribute('data-motion', s.motion ? 'on' : 'off');
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', s.bg === 'dark' ? '#1f2430' : '#2f7d6d');
  }

  function set(key, value) {
    var s = get();
    if (LIMITS[key]) {
      var l = LIMITS[key];
      value = Math.max(l[0], Math.min(l[1], Math.round(value * 100) / 100));
    }
    s[key] = value;
    EQ.store.save();
    apply();
  }

  function reset() {
    EQ.store.data.settings = JSON.parse(JSON.stringify(DEFAULTS));
    EQ.store.save();
    apply();
  }

  /** ¿Está disponible la fuente OpenDyslexic (instalada o en /fonts)? */
  function hasOpenDyslexic() {
    if (!document.fonts || !document.fonts.check) return false;
    try { return document.fonts.check('16px "OpenDyslexic"'); } catch (e) { return false; }
  }

  EQ.settings = { get: get, set: set, apply: apply, reset: reset, FONTS: FONTS, BGS: BGS, LIMITS: LIMITS, DEFAULTS: DEFAULTS, hasOpenDyslexic: hasOpenDyslexic };
})(window.EQ);
