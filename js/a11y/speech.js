/* speech.js — Síntesis de voz (Web Speech API) con alternativa si no hay voz.
   - Inglés: voz en-GB / en-US (elegible en Ajustes)
   - Español: voz es-ES para leer instrucciones */
(function (EQ) {
  'use strict';
  var synth = window.speechSynthesis || null;
  var supported = !!(synth && window.SpeechSynthesisUtterance);
  var voices = [];
  var current = null;

  function loadVoices() {
    if (!supported) return;
    try { voices = synth.getVoices() || []; } catch (e) { voices = []; }
  }
  if (supported) {
    loadVoices();
    if (typeof synth.addEventListener === 'function') synth.addEventListener('voiceschanged', loadVoices);
    else synth.onvoiceschanged = loadVoices;
  }

  function englishVoices() {
    return voices.filter(function (v) { return /^en([-_]|$)/i.test(v.lang); });
  }
  function pickVoice(lang) {
    if (!voices.length) loadVoices();
    if (lang === 'en') {
      var pref = EQ.settings.get().voiceEn;
      var list = englishVoices();
      if (pref) { var p = list.filter(function (v) { return v.voiceURI === pref; })[0]; if (p) return p; }
      var order = [/en[-_]GB/i, /en[-_]US/i, /en[-_](IE|AU|CA)/i, /^en/i];
      for (var i = 0; i < order.length; i++) {
        var local = list.filter(function (v) { return order[i].test(v.lang) && v.localService; })[0];
        if (local) return local;
        var any = list.filter(function (v) { return order[i].test(v.lang); })[0];
        if (any) return any;
      }
      return null;
    }
    var es = voices.filter(function (v) { return /^es[-_]ES/i.test(v.lang); })[0] || voices.filter(function (v) { return /^es/i.test(v.lang); })[0];
    return es || null;
  }

  /** ¿Se puede reproducir inglés? Si la lista de voces aún no ha cargado, se asume que sí (Safari). */
  function canSpeakEnglish() {
    if (!supported) return false;
    if (!voices.length) return true;
    return englishVoices().length > 0;
  }

  function say(text, opts) {
    opts = opts || {};
    var lang = opts.lang || 'en';
    if (!supported || !text) return Promise.resolve(false);
    return new Promise(function (resolve) {
      try {
        if (synth.speaking || synth.pending) synth.cancel();
        var u = new SpeechSynthesisUtterance(text);
        u.lang = lang === 'en' ? 'en-GB' : 'es-ES';
        var v = pickVoice(lang);
        if (v) { u.voice = v; u.lang = v.lang; }
        var rate = lang === 'en' ? (EQ.settings.get().rate || 0.85) : 1;
        if (opts.slow) rate = Math.max(0.5, rate - 0.3);
        u.rate = rate;
        u.pitch = 1;
        u.onend = function () { current = null; resolve(true); };
        u.onerror = function () { current = null; resolve(false); };
        current = u;
        synth.speak(u);
        // Algunos navegadores se "atascan" en pausa: reanudar por si acaso.
        if (synth.paused) synth.resume();
      } catch (e) { resolve(false); }
    });
  }

  function stop() { if (supported) { try { synth.cancel(); } catch (e) {} } }

  /** Botón 🔊 reutilizable. text puede ser función (texto dinámico). */
  function button(text, opts) {
    opts = opts || {};
    var label = opts.label || (opts.slow ? 'Escuchar despacio' : 'Escuchar');
    var btn = EQ.h('button', {
      type: 'button',
      class: 'speak-btn' + (opts.slow ? ' slow' : '') + (opts.className ? ' ' + opts.className : ''),
      'aria-label': label,
      title: label
    }, opts.slow ? '🐢' : '🔊', opts.showLabel ? EQ.h('span', null, opts.showLabel) : null);
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (!supported || (opts.lang !== 'es' && !canSpeakEnglish())) {
        EQ.ui.toast('Este dispositivo no tiene voz en ' + (opts.lang === 'es' ? 'español' : 'inglés') + '. Pide a un adulto que lo lea contigo 😊');
        return;
      }
      var t = typeof text === 'function' ? text() : text;
      btn.classList.add('speaking');
      say(t, { lang: opts.lang || 'en', slow: !!opts.slow }).then(function () { btn.classList.remove('speaking'); });
    });
    return btn;
  }

  EQ.speech = {
    supported: supported,
    say: say,
    stop: stop,
    button: button,
    canSpeakEnglish: canSpeakEnglish,
    englishVoices: function () { loadVoices(); return englishVoices(); },
    /** Fuerza el modo sin voz (para pruebas): EQ.speech.disable() */
    disable: function () { supported = false; EQ.speech.supported = false; }
  };
})(window.EQ);
