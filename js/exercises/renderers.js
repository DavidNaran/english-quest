/* renderers.js — Un renderizador por tipo de ejercicio.
   Contrato: EQ.renderers[type](item, el, ctx) → {
     get(): respuesta | null, lock(), retry(), showResult(res, state), showSolution(), focus()
   }
   ctx.changed(): la respuesta ha cambiado · ctx.submit(): pulsar Intro
   Todo funciona tocando (sin arrastrar). */
(function (EQ) {
  'use strict';
  var h = EQ.h;

  var INSTR = {
    'choice': 'Elige la respuesta correcta.',
    'truefalse': '¿La frase está bien escrita?',
    'gap': 'Escribe la palabra que falta.',
    'translate': '¿Qué significa en español? Escríbelo.',
    'write': 'Escribe la palabra en inglés.',
    'listen-write': 'Escucha y escribe la palabra.',
    'listen-choice': 'Escucha y elige la palabra que oyes.',
    'order': 'Toca las palabras en orden para formar la frase.',
    'letters': 'Toca las letras en orden para escribir la palabra.',
    'missing': 'Toca las letras que faltan.',
    'match': 'Une cada palabra con su pareja.'
  };
  function instruction(item) {
    if (item.instr) return item.instr;
    if (item.type === 'choice' && item.icon && !item.prompt) return '¿Qué es? Elige la palabra.';
    if (item.type === 'gap' && item.bank) return 'Escribe la palabra que falta. Puedes tocar una de abajo.';
    return INSTR[item.type] || '';
  }
  function isSpanish(text) { return /^[¿¡]/.test(text) || /^(Elige|Escribe|Toca|Traduce)/.test(text); }
  function speakable(text) { return String(text).replace(/_{2,}/g, ' ... ').replace(/\(.*?\)/g, ' '); }

  /** Frase con huecos ___ resaltados + botón de audio. */
  function promptLine(text) {
    if (!text) return null;
    var es = isSpanish(text);
    var span = h('span', { class: 'en-text', lang: es ? 'es' : 'en' });
    String(text).split(/(_{2,})/).forEach(function (part) {
      if (/^_{2,}$/.test(part)) span.appendChild(h('span', { class: 'gap-mark', 'aria-label': 'hueco' }, ' '));
      else span.appendChild(document.createTextNode(part));
    });
    return h('div', { class: 'prompt' }, EQ.speech.button(speakable(text), { lang: es ? 'es' : 'en' }), span);
  }
  function pic(id) { return id && EQ.art.has(id) ? h('div', { class: 'prompt-pic', html: EQ.art.icon(id) }) : null; }
  function input(ctx, label) {
    var inp = h('input', { class: 'answer-input', type: 'text', autocomplete: 'off', autocorrect: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-label': label || 'Tu respuesta', inputmode: 'text', enterkeyhint: 'done' });
    inp.addEventListener('input', function () { ctx.changed(); });
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); ctx.submit(); } });
    return inp;
  }
  function noVoice() { return !EQ.speech.supported || !EQ.speech.canSpeakEnglish(); }

  /* ---------- Opción múltiple (también escuchar y elegir) ---------- */
  function choice(item, el, ctx) {
    var selected = null, buttons = [];
    if (item.type === 'listen-choice') {
      if (noVoice()) {
        el.appendChild(h('p', { class: 'fallback-note' }, '🔇 No hay voz en este dispositivo: mira el dibujo y elige la palabra.'));
        el.appendChild(pic(item.icon));
      } else {
        var big = EQ.speech.button(item.say, { label: 'Escuchar la palabra' });
        el.appendChild(h('div', { class: 'listen-big' }, big, EQ.speech.button(item.say, { slow: true }), h('span', { class: 'small muted' }, 'Puedes escucharlo todas las veces que quieras.')));
        setTimeout(function () { EQ.speech.say(item.say); }, 350);
      }
    } else {
      if (item.icon) el.appendChild(pic(item.icon));
      if (item.prompt) el.appendChild(promptLine(item.prompt));
    }
    var opts = EQ.shuffle(item.options);
    var short = opts.every(function (o) { return String(o).length <= 16; });
    var group = h('div', { class: 'options' + (short && opts.length <= 4 ? ' two' : ''), role: 'radiogroup', 'aria-label': 'Opciones' });
    opts.forEach(function (o) {
      var b = h('button', { type: 'button', class: 'opt', role: 'radio', 'aria-checked': 'false', 'data-value': o },
        h('span', { class: 'opt-mark', 'aria-hidden': 'true' }), h('span', { lang: /[áéíóúñ]/.test(o) || item.section === 'translate' && /^¿Qué/.test(item.prompt) ? 'es' : 'en' }, o));
      b.addEventListener('click', function () {
        if (b.disabled) return;
        selected = o;
        buttons.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        ctx.changed();
      });
      buttons.push(b); group.appendChild(b);
    });
    el.appendChild(group);
    return {
      get: function () { return selected; },
      lock: function () { buttons.forEach(function (b) { b.disabled = true; }); },
      retry: function () {
        selected = null;
        buttons.forEach(function (b) { b.setAttribute('aria-checked', 'false'); if (!b.classList.contains('is-wrong')) b.disabled = false; });
      },
      showResult: function (res) {
        buttons.forEach(function (b) {
          if (b.getAttribute('data-value') !== selected) return;
          b.classList.add(res.correct ? 'is-correct' : 'is-wrong');
          b.setAttribute('aria-label', b.textContent + (res.correct ? ' — correcta' : ' — no es correcta'));
        });
      },
      showSolution: function () {
        buttons.forEach(function (b) { if (b.getAttribute('data-value') === item.answer) b.classList.add('is-correct'); b.disabled = true; });
      },
      focus: function () { if (buttons[0]) buttons[0].focus(); }
    };
  }

  /* ---------- ¿Correcta o incorrecta? ---------- */
  function truefalse(item, el, ctx) {
    el.appendChild(promptLine(item.prompt));
    var selected = null, buttons = [];
    var group = h('div', { class: 'options two', role: 'radiogroup', 'aria-label': 'Opciones' });
    [[true, '✔ Está bien'], [false, '✘ Tiene un error']].forEach(function (p) {
      var b = h('button', { type: 'button', class: 'opt', role: 'radio', 'aria-checked': 'false' }, h('span', { class: 'opt-mark', 'aria-hidden': 'true' }), p[1]);
      b._v = p[0];
      b.addEventListener('click', function () {
        if (b.disabled) return;
        selected = p[0];
        buttons.forEach(function (x) { x.setAttribute('aria-checked', x === b ? 'true' : 'false'); });
        ctx.changed();
      });
      buttons.push(b); group.appendChild(b);
    });
    el.appendChild(group);
    return {
      get: function () { return selected; },
      lock: function () { buttons.forEach(function (b) { b.disabled = true; }); },
      retry: function () { selected = null; buttons.forEach(function (b) { b.setAttribute('aria-checked', 'false'); if (!b.classList.contains('is-wrong')) b.disabled = false; }); },
      showResult: function (res) { buttons.forEach(function (b) { if (b._v === selected) b.classList.add(res.correct ? 'is-correct' : 'is-wrong'); }); },
      showSolution: function () { buttons.forEach(function (b) { if (b._v === item.answer) b.classList.add('is-correct'); b.disabled = true; }); },
      focus: function () { buttons[0].focus(); }
    };
  }

  /* ---------- Huecos para escribir ---------- */
  function gap(item, el, ctx) {
    el.appendChild(promptLine(item.prompt));
    var inp = input(ctx, 'Palabra que falta');
    el.appendChild(inp);
    if (item.bank) {
      var bank = h('div', { class: 'word-bank' }, h('span', { class: 'lbl' }, 'Toca para escribir:'));
      item.bank.forEach(function (w) {
        bank.appendChild(h('button', { type: 'button', class: 'chip', lang: 'en', onclick: function () { if (inp.disabled) return; inp.value = w; ctx.changed(); } }, w));
      });
      el.appendChild(bank);
    }
    return {
      get: function () { return inp.value; },
      lock: function () { inp.disabled = true; },
      retry: function () { inp.disabled = false; inp.select(); },
      showResult: function () {}, showSolution: function () { inp.disabled = true; },
      focus: function () { if (!('ontouchstart' in window)) inp.focus(); }
    };
  }

  /* ---------- Traducir al español ---------- */
  function translate(item, el, ctx) {
    if (item.icon) el.appendChild(pic(item.icon));
    el.appendChild(h('div', { class: 'prompt' }, EQ.speech.button(item.prompt), h('span', { class: 'en-text', lang: 'en' }, item.prompt)));
    var inp = input(ctx, 'Traducción en español');
    inp.setAttribute('lang', 'es');
    el.appendChild(inp);
    el.appendChild(h('p', { class: 'small muted' }, 'No te preocupes por las tildes.'));
    return {
      get: function () { return inp.value; }, lock: function () { inp.disabled = true; },
      retry: function () { inp.disabled = false; inp.select(); },
      showResult: function () {}, showSolution: function () { inp.disabled = true; },
      focus: function () { if (!('ontouchstart' in window)) inp.focus(); }
    };
  }

  /* ---------- Escribir la palabra (imagen + español, o escuchando) ---------- */
  function write(item, el, ctx) {
    var v = EQ.vocab.get(item.word);
    var listen = item.type === 'listen-write';
    if (listen && !noVoice()) {
      el.appendChild(h('div', { class: 'listen-big' }, EQ.speech.button(v.base, { label: 'Escuchar la palabra' }), EQ.speech.button(v.base, { slow: true }), h('span', { class: 'small muted' }, 'Escúchala todas las veces que quieras.')));
      setTimeout(function () { EQ.speech.say(v.base); }, 350);
    } else {
      if (listen) el.appendChild(h('p', { class: 'fallback-note' }, '🔇 No hay voz en este dispositivo: mira el dibujo y escribe la palabra.'));
      el.appendChild(pic(item.icon || item.word));
      el.appendChild(h('p', { class: 'prompt-es' }, 'En español: ', h('b', { lang: 'es' }, item.es || v.esLabel)));
    }
    if (v.kind === 'verb') el.appendChild(h('p', { class: 'small muted' }, 'Es un verbo: puedes escribirlo con "to" o sin él.'));
    var inp = input(ctx, 'Escribe la palabra en inglés');
    el.appendChild(inp);
    return {
      get: function () { return inp.value; }, lock: function () { inp.disabled = true; },
      retry: function () { inp.disabled = false; inp.value = ''; ctx.changed(); if (!('ontouchstart' in window)) inp.focus(); },
      showResult: function () {}, showSolution: function () { inp.disabled = true; },
      focus: function () { if (!('ontouchstart' in window)) inp.focus(); }
    };
  }

  /* ---------- Fichas que se tocan para colocar (palabras o letras) ---------- */
  function tileBuilder(el, ctx, tokens, opts) {
    var placed = [];
    var zone = h('div', { class: 'build-zone empty', 'data-placeholder': opts.placeholder, 'aria-label': 'Tu respuesta', 'aria-live': 'polite' });
    var tray = h('div', { class: 'tiles', 'aria-label': 'Fichas disponibles' });
    var locked = false;
    var tiles = tokens.map(function (t, i) {
      var b = h('button', { type: 'button', class: 'tile-btn' + (opts.letters ? ' letter' : ''), lang: 'en' }, t);
      b.addEventListener('click', function () {
        if (locked || b.classList.contains('used')) return;
        b.classList.add('used');
        placed.push(i);
        draw(); ctx.changed();
      });
      tray.appendChild(b);
      return b;
    });
    function draw() {
      EQ.clear(zone);
      zone.classList.toggle('empty', placed.length === 0);
      placed.forEach(function (idx, pos) {
        var b = h('button', { type: 'button', class: 'tile-btn placed' + (opts.letters ? ' letter' : ''), 'aria-label': tokens[idx] + ' (toca para quitar)', lang: 'en' }, tokens[idx]);
        b.addEventListener('click', function () {
          if (locked) return;
          placed.splice(pos, 1);
          tiles[idx].classList.remove('used');
          draw(); ctx.changed();
        });
        zone.appendChild(b);
      });
      if (opts.endPunct) zone.appendChild(h('span', { class: 'end-punct' }, opts.endPunct));
    }
    draw();
    el.appendChild(zone);
    el.appendChild(tray);
    el.appendChild(h('div', { class: 'btn-row' },
      h('button', { type: 'button', class: 'btn secondary small', onclick: function () { if (locked) return; placed = []; tiles.forEach(function (t) { t.classList.remove('used'); }); draw(); ctx.changed(); } }, '↺ Quitar todas')));
    return {
      value: function () { return placed.map(function (i) { return tokens[i]; }); },
      lock: function () { locked = true; },
      reset: function () { locked = false; placed = []; tiles.forEach(function (t) { t.classList.remove('used'); }); draw(); },
      setAll: function (list) { placed = list; tiles.forEach(function (t, i) { t.classList.toggle('used', list.indexOf(i) >= 0); }); draw(); }
    };
  }

  function order(item, el, ctx) {
    var ans = item.answer;
    var m = ans.match(/[.?!]$/);
    var punct = m ? m[0] : '';
    var words = ans.replace(/[.?!]$/, '').split(' ');
    var shuffled = EQ.shuffleDifferent(words);
    var tb = tileBuilder(el, ctx, shuffled, { placeholder: 'Toca las palabras de abajo en orden…', endPunct: punct });
    return {
      get: function () { var v = tb.value(); return v.length ? v : null; },
      lock: tb.lock,
      retry: function () { tb.reset(); ctx.changed(); },
      showResult: function () {},
      showSolution: function () {
        var used = [], idx = words.map(function (w) { var i = shuffled.findIndex(function (s, k) { return s === w && used.indexOf(k) < 0; }); used.push(i); return i; });
        tb.setAll(idx); tb.lock();
      },
      focus: function () {}
    };
  }

  function letters(item, el, ctx) {
    var v = EQ.vocab.get(item.word) || { base: item.word };
    var word = v.base;
    el.appendChild(pic(item.icon || item.word));
    if (item.es) el.appendChild(h('p', { class: 'prompt-es' }, 'En español: ', h('b', { lang: 'es' }, item.es)));
    var chars = word.replace(/\s/g, '').split('');
    var shuffled = EQ.shuffleDifferent(chars);
    var tb = tileBuilder(el, ctx, shuffled, { placeholder: 'Toca las letras en orden…', letters: true });
    return {
      get: function () { var v2 = tb.value(); return v2.length ? v2.join('') : null; },
      lock: tb.lock,
      retry: function () { tb.reset(); ctx.changed(); },
      showResult: function () {},
      showSolution: function () {
        var used = [], idx = chars.map(function (c) { var i = shuffled.findIndex(function (s, k) { return s === c && used.indexOf(k) < 0; }); used.push(i); return i; });
        tb.setAll(idx); tb.lock();
      },
      focus: function () {}
    };
  }

  /* ---------- Letras que faltan ---------- */
  function missing(item, el, ctx) {
    var v = EQ.vocab.get(item.word) || { base: item.word };
    var word = v.base;
    var hide = item.hide || [Math.floor(word.length / 2)];
    el.appendChild(pic(item.icon || item.word));
    if (item.es) el.appendChild(h('p', { class: 'prompt-es' }, 'En español: ', h('b', { lang: 'es' }, item.es)));
    var filled = {}, active = hide[0], locked = false;
    var row = h('div', { class: 'missing-word', 'aria-label': 'Palabra con huecos' });
    var cells = [];
    function draw() {
      EQ.clear(row); cells = [];
      word.split('').forEach(function (c, i) {
        if (c === ' ') { row.appendChild(h('span', { class: 'mw-cell space' })); return; }
        if (hide.indexOf(i) >= 0) {
          var b = h('button', { type: 'button', class: 'mw-cell blank' + (i === active ? ' active' : ''), 'aria-label': filled[i] ? 'Hueco con la letra ' + filled[i] + ', toca para borrar' : 'Hueco vacío' }, filled[i] || '?');
          b.addEventListener('click', function () { if (locked) return; if (filled[i]) { delete filled[i]; } active = i; draw(); ctx.changed(); });
          row.appendChild(b);
        } else row.appendChild(h('span', { class: 'mw-cell', lang: 'en' }, c));
      });
    }
    draw();
    el.appendChild(row);
    var needed = hide.map(function (i) { return word[i]; });
    var extras = 'aeioulnrstmdkbhcpy'.split('').filter(function (c) { return needed.indexOf(c) < 0; });
    var keys = EQ.shuffle(needed.concat(EQ.shuffle(extras).slice(0, Math.max(3, 6 - needed.length))));
    var pad = h('div', { class: 'tiles', 'aria-label': 'Letras' });
    keys.forEach(function (k) {
      pad.appendChild(h('button', { type: 'button', class: 'tile-btn letter', lang: 'en', onclick: function () {
        if (locked) return;
        if (active === null || active === undefined) active = hide.filter(function (i) { return !filled[i]; })[0];
        if (active === undefined) return;
        filled[active] = k;
        active = hide.filter(function (i) { return !filled[i]; })[0];
        draw(); ctx.changed();
      } }, k));
    });
    el.appendChild(pad);
    function value() { return word.split('').map(function (c, i) { return hide.indexOf(i) >= 0 ? (filled[i] || '_') : c; }).join(''); }
    return {
      get: function () { return hide.every(function (i) { return filled[i]; }) ? value() : null; },
      lock: function () { locked = true; },
      retry: function () { locked = false; filled = {}; active = hide[0]; draw(); ctx.changed(); },
      showResult: function () {},
      showSolution: function () { hide.forEach(function (i) { filled[i] = word[i]; }); locked = true; draw(); },
      focus: function () {}
    };
  }

  /* ---------- Unir parejas (se corrige sola) ---------- */
  function match(item, el, ctx) {
    var pairs = item.pairs; // [[izquierda, derecha, iconId?], ...]
    var left = EQ.shuffle(pairs.map(function (p, i) { return { i: i, t: p[0], icon: p[2] }; }));
    var right = EQ.shuffle(pairs.map(function (p, i) { return { i: i, t: p[1] }; }));
    var selL = null, selR = null, done = 0, mistakes = 0, locked = false;
    var colL = h('div', { class: 'match-col' }), colR = h('div', { class: 'match-col' });
    function mk(x, side) {
      var b = h('button', { type: 'button', class: 'match-item', 'aria-pressed': 'false', lang: side === 'L' ? 'en' : 'es' }, x.icon ? h('span', { html: EQ.art.icon(x.icon) }) : null, x.t);
      b._i = x.i; b._side = side;
      b.addEventListener('click', function () {
        if (locked || b.classList.contains('done')) return;
        if (side === 'L') { if (selL) selL.setAttribute('aria-pressed', 'false'); selL = b; } else { if (selR) selR.setAttribute('aria-pressed', 'false'); selR = b; }
        b.setAttribute('aria-pressed', 'true');
        if (side === 'L' && item.speakLeft) EQ.speech.say(x.t);
        if (selL && selR) {
          if (selL._i === selR._i) {
            [selL, selR].forEach(function (z) { z.classList.add('done'); z.setAttribute('aria-pressed', 'false'); z.disabled = true; });
            done++;
            if (done === pairs.length) ctx.done({ mistakes: mistakes });
          } else {
            mistakes++;
            [selL, selR].forEach(function (z) { z.classList.add('nope'); z.setAttribute('aria-pressed', 'false'); (function (q) { setTimeout(function () { q.classList.remove('nope'); }, 450); })(z); });
            EQ.ui.toast('Esas dos no son pareja. ¡Prueba otra vez!', 1800);
          }
          selL = selR = null;
        }
      });
      return b;
    }
    left.forEach(function (x) { colL.appendChild(mk(x, 'L')); });
    right.forEach(function (x) { colR.appendChild(mk(x, 'R')); });
    el.appendChild(h('div', { class: 'match' }, colL, colR));
    return {
      selfChecking: true,
      get: function () { return done === pairs.length ? { mistakes: mistakes } : null; },
      lock: function () { locked = true; }, retry: function () {}, showResult: function () {}, showSolution: function () {}, focus: function () {}
    };
  }

  EQ.renderers = {
    'choice': choice, 'listen-choice': choice, 'truefalse': truefalse, 'gap': gap, 'translate': translate,
    'write': write, 'listen-write': write, 'order': order, 'letters': letters, 'missing': missing, 'match': match
  };
  EQ.exerciseInstruction = instruction;
  EQ.promptLine = promptLine;
})(window.EQ);
