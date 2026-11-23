/* timer.js — Tiempo de estudio activo y sesiones.
   Solo cuenta mientras la pestaña está visible y ha habido interacción en el último minuto. */
(function (EQ) {
  'use strict';
  var TICK = 5000;          // ms
  var IDLE = 60000;         // ms sin tocar = inactiva
  var SESSION_GAP = 30 * 60 * 1000; // 30 min sin uso = nueva sesión
  var lastAct = Date.now();

  function day() {
    var d = EQ.store.data.stats.daily, t = EQ.today();
    if (!d[t]) d[t] = { sec: 0, answered: 0, ok: 0 };
    return d[t];
  }

  function startSession() {
    var s = EQ.store.data.session;
    var now = Date.now();
    if (!s.last || now - s.last > SESSION_GAP) s.n = (s.n || 0) + 1;
    s.last = now;
    EQ.store.save();
  }

  function activity() {
    var now = Date.now();
    if (now - EQ.store.data.session.last > SESSION_GAP) startSession();
    lastAct = now;
  }

  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, activity, { passive: true });
  });

  setInterval(function () {
    if (document.visibilityState !== 'visible') return;
    if (Date.now() - lastAct > IDLE) return;
    day().sec += TICK / 1000;
    EQ.store.data.session.last = Date.now();
    EQ.store.save();
  }, TICK);

  EQ.timer = {
    start: startSession,
    day: day,
    session: function () { return EQ.store.data.session.n || 1; },
    /** Segundos activos desde una marca de tiempo (para sugerir pausas). */
    activeSince: function (sinceMs) { return Math.round((Date.now() - sinceMs) / 1000); }
  };
})(window.EQ);
