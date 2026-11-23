/* picker.js — Selección adaptativa de ejercicios.
   - Más peso a lo que más cuesta y a lo que "toca" repasar (repetición espaciada).
   - Práctica intercalada: evita dos ejercicios seguidos del mismo tema. */
(function (EQ) {
  'use strict';

  function weight(item) {
    var data = EQ.store.data;
    var w = 1;
    (item.tags || []).forEach(function (t) { w += EQ.srs.weakness(t) * 0.4; });
    var err = data.errors[item.id];
    if (err && err.open) w += 3;
    var st = data.items[item.id];
    if (!st) w += 1;                                  // nunca visto
    else if (st.lastTs && Date.now() - st.lastTs < 10 * 60 * 1000) w *= 0.25; // visto hace muy poco
    return Math.max(0.05, w);
  }

  function sample(pool, n, rnd) {
    rnd = rnd || Math.random;
    var bag = pool.slice(), out = [];
    while (out.length < n && bag.length) {
      var total = 0, ws = bag.map(function (it) { var w = weight(it); total += w; return w; });
      var r = rnd() * total, idx = 0;
      while (idx < ws.length - 1 && r > ws[idx]) { r -= ws[idx]; idx++; }
      out.push(bag.splice(idx, 1)[0]);
    }
    return out;
  }

  /** Reordena para no repetir el mismo tema seguido. */
  function interleave(list) {
    var out = [], rest = list.slice();
    while (rest.length) {
      var prev = out.length ? out[out.length - 1].skill : null;
      var i = rest.findIndex ? rest.findIndex(function (x) { return x.skill !== prev; }) : -1;
      if (i < 0) i = 0;
      out.push(rest.splice(i, 1)[0]);
    }
    return out;
  }

  /** Práctica adaptativa mezclando todos los temas. */
  function mix(n) {
    return interleave(sample(EQ.content.notebook(), n));
  }

  /** Tanda de un tema y nivel: primero lo no acertado, luego lo que más cuesta. */
  function setFor(topicId, level, n) {
    var t = EQ.content.topic(topicId);
    var pool = t.bank.filter(function (it) { return !level || it.level === level; });
    var data = EQ.store.data;
    var pending = pool.filter(function (it) { var s = data.items[it.id]; return !s || !s.firstOk; });
    var src = pending.length >= Math.min(n, pool.length) ? pending : pool;
    var chosen = sample(src, Math.min(n, src.length));
    if (chosen.length < Math.min(n, pool.length)) {
      var extra = sample(pool.filter(function (x) { return chosen.indexOf(x) < 0; }), Math.min(n, pool.length) - chosen.length);
      chosen = chosen.concat(extra);
    }
    // Orden por dificultad suave dentro de la tanda
    return chosen.sort(function (a, b) { return a.level - b.level; });
  }

  /** Ejercicios con errores pendientes + variantes nuevas de lo que más cuesta. */
  function errorsReview(n, onlyIds) {
    var data = EQ.store.data;
    var ids = onlyIds || Object.keys(data.errors).filter(function (id) { return data.errors[id].open; });
    var items = ids.map(EQ.content.item).filter(Boolean);
    items = EQ.shuffle(items).slice(0, n);
    if (items.length < n) {
      // Variantes: otros ejercicios que practican las mismas palabras / estructuras
      var tags = {};
      items.forEach(function (it) { (it.tags || []).forEach(function (t) { if (t !== 'order') tags[t] = 1; }); });
      var weakTags = Object.keys(data.srs).filter(function (k) { return EQ.srs.status(k) === 'learning' && EQ.srs.weakness(k) > 2; });
      weakTags.forEach(function (t) { tags[t] = 1; });
      var pool = EQ.content.notebook().filter(function (it) {
        return items.indexOf(it) < 0 && (it.tags || []).some(function (t) { return tags[t]; });
      });
      items = items.concat(sample(pool, Math.min(n - items.length, Math.max(0, Math.ceil(items.length * 0.6) + (onlyIds ? 3 : 0)))));
    }
    return interleave(items);
  }

  function openErrorCount() {
    var e = EQ.store.data.errors;
    return Object.keys(e).filter(function (id) { return e[id].open && EQ.content.item(id); }).length;
  }

  EQ.picker = { sample: sample, mix: mix, setFor: setFor, errorsReview: errorsReview, interleave: interleave, openErrorCount: openErrorCount, weight: weight };
})(window.EQ);
