/* router.js — Navegación por hash: #/pantalla/param1/param2?clave=valor */
(function (EQ) {
  'use strict';
  var routes = {};
  var TITLES = {};

  function parse(hash) {
    var raw = (hash || '').replace(/^#\/?/, '');
    var parts = raw.split('?');
    var path = parts[0].split('/').filter(Boolean);
    var query = {};
    (parts[1] || '').split('&').forEach(function (kv) {
      if (!kv) return;
      var p = kv.split('=');
      query[decodeURIComponent(p[0])] = decodeURIComponent(p[1] || '');
    });
    return { name: path[0] || 'home', params: path.slice(1), query: query };
  }

  function render() {
    var r = parse(location.hash);
    var fn = routes[r.name] || routes.home;
    var main = document.getElementById('main');
    EQ.speech.stop();
    EQ.clear(main);
    try {
      fn(main, r.params, r.query);
    } catch (e) {
      console.error(e);
      main.appendChild(EQ.h('div', { class: 'card' }, EQ.h('h1', null, 'Ups, algo ha fallado'), EQ.h('p', null, 'Vuelve al inicio e inténtalo otra vez.'), EQ.h('a', { class: 'btn', href: '#/home' }, 'Ir al inicio')));
    }
    document.title = (TITLES[r.name] ? TITLES[r.name] + ' · ' : '') + 'English Quest';
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
    EQ.ui.updateStars();
  }

  EQ.router = {
    add: function (name, title, fn) { routes[name] = fn; TITLES[name] = title; },
    start: function () { window.addEventListener('hashchange', render); render(); },
    go: function (hash) { if (location.hash === hash) render(); else location.hash = hash; },
    refresh: render,
    parse: parse
  };
})(window.EQ);
