/* store.js — Persistencia local (localStorage) con esquema versionado.
   Si localStorage no está disponible (p. ej. modo privado), se usa memoria. */
(function (EQ) {
  'use strict';
  var KEY = 'eq.v1';
  var VERSION = 1;
  var memory = null;
  var timer = null;
  var listeners = [];

  function defaults() {
    return {
      version: VERSION,
      createdAt: Date.now(),
      settings: {},          // ver a11y/settings.js
      srs: {},               // clave (vocab id o etiqueta gramatical) -> estado de memoria
      items: {},             // id de ejercicio -> {seen, ok, fail, firstOk, lastTs}
      errors: {},            // id de ejercicio -> {n, open, lastTs, type}
      spelling: [],          // [{wrote, right, ts}] errores ortográficos (máx. 200)
      runs: {},              // estado de tandas/exámenes en curso (para "Continuar")
      resume: null,          // {route, label, runKey}
      sets: {},              // clave de tanda -> {best, last, count}
      exams: [],             // [{exam, mode, grade, ts, bySection, wrongIds}]
      stats: { daily: {}, answered: 0, correctFirst: 0, fixedAfterError: 0, runsDone: 0, vocabVisited: {} },
      rewards: { stars: 0, badges: {}, log: [] },
      session: { n: 0, last: 0 }
    };
  }

  function storageOk() {
    try { var k = '__eq_test'; localStorage.setItem(k, '1'); localStorage.removeItem(k); return true; }
    catch (e) { return false; }
  }
  var persistent = storageOk();

  function merge(base, saved) {
    if (!saved || typeof saved !== 'object') return base;
    Object.keys(saved).forEach(function (k) {
      if (base[k] && typeof base[k] === 'object' && !Array.isArray(base[k]) && saved[k] && typeof saved[k] === 'object' && !Array.isArray(saved[k])) {
        base[k] = merge(base[k], saved[k]);
      } else {
        base[k] = saved[k];
      }
    });
    return base;
  }

  function migrate(data) {
    // Futuras migraciones: if (data.version < 2) { ... data.version = 2; }
    data.version = VERSION;
    return data;
  }

  function load() {
    var raw = null;
    if (persistent) { try { raw = localStorage.getItem(KEY); } catch (e) { raw = null; } }
    var data = defaults();
    if (raw) {
      try { data = merge(data, JSON.parse(raw)); } catch (e) { console.warn('Progreso dañado, se empieza de cero', e); }
    } else if (memory) {
      data = memory;
    }
    return migrate(data);
  }

  var state = load();

  function saveNow() {
    clearTimeout(timer); timer = null;
    memory = state;
    if (!persistent) return false;
    try { localStorage.setItem(KEY, JSON.stringify(state)); return true; }
    catch (e) { console.warn('No se pudo guardar', e); return false; }
  }
  function save() {
    if (timer) return;
    timer = setTimeout(saveNow, 250);
  }

  EQ.store = {
    get data() { return state; },
    persistent: persistent,
    save: save,
    saveNow: saveNow,
    /** Reinicia todo el progreso. Conserva los ajustes visuales si keepSettings. */
    resetAll: function (keepSettings) {
      var settings = state.settings;
      state = defaults();
      if (keepSettings) state.settings = settings;
      saveNow();
      listeners.forEach(function (fn) { fn(); });
    },
    replace: function (obj) {
      state = migrate(merge(defaults(), obj));
      saveNow();
      listeners.forEach(function (fn) { fn(); });
    },
    onReset: function (fn) { listeners.push(fn); },
    exportJSON: function () { return JSON.stringify(state, null, 2); }
  };

  window.addEventListener('pagehide', saveNow);
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden') saveNow(); });
})(window.EQ);
