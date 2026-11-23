/* sw.js — Service worker: guarda la app en caché para usarla sin conexión.
   Al cambiar archivos, sube el número de VERSION para que se actualice. */
var VERSION = 'eq-v5';
var FILES = [
  './', 'index.html', 'manifest.webmanifest',
  'css/tokens.css', 'css/app.css', 'css/exercises.css', 'css/print.css',
  'icons/icon.svg', 'icons/icon-180.png', 'icons/icon-192.png', 'icons/icon-512.png',
  'js/ui/dom.js', 'js/core/store.js', 'js/core/timer.js', 'js/a11y/settings.js', 'js/a11y/speech.js',
  'js/art/vocab-icons.js', 'js/content/vocab.js', 'js/content/grammar-cards.js', 'js/content/bank-could.js',
  'js/content/bank-connectors.js', 'js/content/bank-vocab.js', 'js/content/bank-sentences.js', 'js/content/bank-mixed.js',
  'js/content/exams.js', 'js/content/index.js',
  'js/engine/normalize.js', 'js/engine/diff.js', 'js/engine/checker.js', 'js/engine/srs.js', 'js/engine/picker.js',
  'js/engine/feedback.js', 'js/engine/rewards.js',
  'js/ui/components.js', 'js/exercises/renderers.js', 'js/ui/runner.js', 'js/print/sheets.js', 'js/core/router.js',
  'js/ui/screens/start.js', 'js/ui/screens/home.js', 'js/ui/screens/vocab.js', 'js/ui/screens/grammar.js', 'js/ui/screens/practice.js',
  'js/ui/screens/exam.js', 'js/ui/screens/progress.js', 'js/ui/screens/parents.js', 'js/ui/screens/settings.js',
  'js/ui/screens/print.js', 'js/core/app.js'
];
var OPTIONAL = ['fonts/OpenDyslexic-Regular.woff2', 'fonts/OpenDyslexic-Bold.woff2', 'fonts/OpenDyslexic-Regular.otf', 'fonts/OpenDyslexic-Bold.otf'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(FILES.map(function (f) { return new Request(f, { cache: 'reload' }); })).then(function () {
      return Promise.all(OPTIONAL.map(function (f) { return c.add(f).catch(function () {}); }));
    });
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  var url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // Red primero (así llegan las actualizaciones); si no hay conexión, se usa la copia guardada.
  // cache: 'no-cache' obliga a preguntar al servidor si hay versión nueva (no usa la caché HTTP de 10 min).
  e.respondWith(fetch(e.request, { cache: 'no-cache' }).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(e.request, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(e.request, { ignoreSearch: true }).then(function (hit) { return hit || caches.match('index.html'); });
  }));
});
