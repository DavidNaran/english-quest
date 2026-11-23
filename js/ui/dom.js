/* dom.js — Utilidades genéricas de DOM y aleatoriedad (sin dependencias). */
window.EQ = window.EQ || {};
(function (EQ) {
  'use strict';

  /** Crea un elemento: h('button', {class:'btn', onclick: fn}, 'Texto', otroNodo) */
  function h(tag, attrs) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'class') el.className = v;
      else if (k === 'html') el.innerHTML = v;
      else if (k === 'text') el.textContent = v;
      else if (k === 'style' && typeof v === 'object') Object.assign(el.style, v);
      else if (k.slice(0, 2) === 'on' && typeof v === 'function') el.addEventListener(k.slice(2).toLowerCase(), v);
      else if (v === true) el.setAttribute(k, '');
      else el.setAttribute(k, v);
    });
    for (var i = 2; i < arguments.length; i++) append(el, arguments[i]);
    return el;
  }
  function append(el, c) {
    if (c === null || c === undefined || c === false) return;
    if (Array.isArray(c)) { c.forEach(function (x) { append(el, x); }); return; }
    if (c instanceof Node) el.appendChild(c);
    else el.appendChild(document.createTextNode(String(c)));
  }
  function clear(el) { while (el.firstChild) el.removeChild(el.firstChild); return el; }
  function svg(markup) { var d = document.createElement('div'); d.innerHTML = markup; return d.firstElementChild; }

  /** Generador pseudoaleatorio con semilla (mulberry32) para fichas reproducibles. */
  function rng(seed) {
    var a = (seed >>> 0) || 1;
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function shuffle(arr, rnd) {
    rnd = rnd || Math.random;
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  /** Baraja asegurando que el resultado no coincide con el original (para ordenar). */
  function shuffleDifferent(arr, rnd) {
    if (arr.length < 2) return arr.slice();
    var s, tries = 0;
    do { s = shuffle(arr, rnd); tries++; } while (s.join('\u0001') === arr.join('\u0001') && tries < 20);
    return s;
  }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  function fmtMinutes(sec) {
    var m = Math.round(sec / 60);
    if (m < 60) return m + ' min';
    return Math.floor(m / 60) + ' h ' + (m % 60) + ' min';
  }
  function hashStr(s) { var h = 2166136261; for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }

  EQ.h = h;
  EQ.append = append;
  EQ.clear = clear;
  EQ.svg = svg;
  EQ.rng = rng;
  EQ.shuffle = shuffle;
  EQ.shuffleDifferent = shuffleDifferent;
  EQ.today = today;
  EQ.fmtMinutes = fmtMinutes;
  EQ.hashStr = hashStr;
  EQ.$ = function (s, r) { return (r || document).querySelector(s); };
})(window.EQ);
