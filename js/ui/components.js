/* components.js — Componentes de interfaz reutilizables. */
(function (EQ) {
  'use strict';
  var h = EQ.h;

  function toast(msg, ms) {
    var root = document.getElementById('toast-root');
    var t = h('div', { class: 'toast', role: 'status' }, msg);
    root.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, ms || 3500);
  }

  /** Modal accesible. buttons: [{label, class, value}] → Promise(value) */
  function modal(title, body, buttons) {
    return new Promise(function (resolve) {
      var root = document.getElementById('modal-root');
      var prev = document.activeElement;
      var box = h('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-label': title });
      var back = h('div', { class: 'modal-backdrop' }, box);
      function close(v) { root.removeChild(back); if (prev && prev.focus) prev.focus(); resolve(v); }
      box.appendChild(h('h2', null, title));
      if (body) box.appendChild(typeof body === 'string' ? h('p', null, body) : body);
      var row = h('div', { class: 'btn-row' });
      (buttons || [{ label: 'Vale', value: true }]).forEach(function (b) {
        row.appendChild(h('button', { type: 'button', class: 'btn ' + (b.class || ''), onclick: function () { close(b.value); } }, b.label));
      });
      box.appendChild(row);
      back.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(null); });
      root.appendChild(back);
      var f = box.querySelector('button'); if (f) f.focus();
    });
  }
  function confirm(title, text, yes, no) {
    return modal(title, text, [{ label: no || 'No, volver', class: 'secondary', value: false }, { label: yes || 'Sí', class: 'accent', value: true }]);
  }

  function celebrate() {
    var s = EQ.settings.get();
    if (!s.motion || !s.celebrate) return;
    var wrap = h('div', { class: 'celebrate', 'aria-hidden': 'true' });
    var bits = ['⭐', '🌟', '✨', '🍃', '🌼'];
    for (var i = 0; i < 18; i++) {
      wrap.appendChild(h('span', { style: { left: (Math.random() * 100) + '%', animationDelay: (Math.random() * 0.6) + 's' } }, bits[i % bits.length]));
    }
    document.body.appendChild(wrap);
    setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 2600);
  }

  /** Barra de progreso con texto visible (no depende solo del color). */
  function progressBar(value, max, label, text) {
    var pct = max ? Math.min(100, Math.round((value / max) * 100)) : 0;
    return h('div', { class: 'progress', role: 'progressbar', 'aria-valuemin': '0', 'aria-valuemax': String(max), 'aria-valuenow': String(value), 'aria-label': label || 'Progreso' },
      h('div', { class: 'progress-track' }, h('div', { class: 'progress-fill', style: { width: pct + '%' } })),
      h('span', { class: 'progress-label' }, text || (value + ' / ' + max)));
  }

  /** Kiko hablando (con botón para leer en voz alta en español). */
  function guide(text, opts) {
    opts = opts || {};
    var plain = String(text).replace(/<[^>]+>/g, '');
    var bubble = h('div', { class: 'bubble' }, h('p', { html: text }));
    var row = h('div', { class: 'guide' },
      h('div', { class: 'guide-avatar', html: EQ.art.guide }),
      bubble,
      EQ.speech.button(plain, { lang: 'es', label: 'Leer en voz alta' }));
    if (opts.autoRead && EQ.settings.get().autoRead) setTimeout(function () { EQ.speech.say(plain, { lang: 'es' }); }, 300);
    return row;
  }

  function pageHead(title, backHref, extra) {
    return h('div', { class: 'page-head' },
      backHref ? h('a', { class: 'btn secondary small back-btn', href: backHref, 'aria-label': 'Volver' }, '◀ Volver') : null,
      h('h1', null, title),
      h('span', { class: 'spacer' }),
      extra || null);
  }

  /** Texto en inglés con botón de audio al lado. */
  function enLine(text, cls) {
    return h('span', { class: 'row' }, EQ.speech.button(text), h('span', { class: cls || 'en' }, text));
  }

  function updateStars() {
    var el = document.getElementById('star-count');
    if (el) el.textContent = String(EQ.store.data.rewards.stars || 0);
  }

  EQ.ui = { toast: toast, modal: modal, confirm: confirm, celebrate: celebrate, progressBar: progressBar, guide: guide, pageHead: pageHead, enLine: enLine, updateStars: updateStars };
})(window.EQ);
