/* app.js — Arranque de la aplicación. */
(function (EQ) {
  'use strict';
  EQ.settings.apply();
  EQ.timer.start();
  EQ.store.onReset(function () { EQ.settings.apply(); EQ.ui.updateStars(); });
  EQ.router.start();

  if (!EQ.store.persistent) {
    setTimeout(function () { EQ.ui.toast('Aviso: este navegador no deja guardar el progreso (¿modo privado?). Funciona, pero se perderá al cerrar.', 7000); }, 800);
  }

  // PWA: solo funciona servida por http(s), no abriendo el archivo directamente
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(function (reg) {
        reg.update();
      }).catch(function (e) { console.warn('Service worker no registrado', e); });
    });
    // Cuando se instala una versión nueva, recargar una vez para mostrarla (sin perder el progreso).
    var hadController = !!navigator.serviceWorker.controller, reloaded = false;
    navigator.serviceWorker.addEventListener('controllerchange', function () {
      if (!hadController || reloaded) { hadController = true; return; }
      reloaded = true;
      EQ.store.saveNow();
      location.reload();
    });
  }
})(window.EQ);
