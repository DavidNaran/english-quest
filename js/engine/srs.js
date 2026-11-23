/* srs.js — Repetición espaciada (cajas de Leitner) y registro de progreso.
   Cada palabra o punto gramatical tiene tres huellas:
   - recog: reconocimiento (elegir entre opciones)
   - recall: recuerdo sin opciones (traducir, escribir)
   - spell: ortografía exacta
   Una palabra solo está DOMINADA si: caja ≥ 3, la ha escrito bien en ≥ 2 sesiones distintas
   y la ha recordado al menos una vez sin opciones. Un acierto de opción múltiple no basta. */
(function (EQ) {
  'use strict';
  var INTERVAL = [0, 1, 2, 3, 5, 8]; // sesiones hasta volver a preguntar, según la caja
  var RECOG = ['choice', 'truefalse', 'match', 'listen-choice'];
  var SPELL = ['write', 'listen-write', 'missing', 'letters'];

  function skillKind(item) {
    if (SPELL.indexOf(item.type) >= 0 || (item.type === 'gap' && item.spellCheck)) return 'spell';
    if (RECOG.indexOf(item.type) >= 0) return 'recog';
    return 'recall';
  }
  function key(k) {
    var s = EQ.store.data.srs;
    if (!s[k]) s[k] = { box: 0, seen: 0, ok: 0, fail: 0, recog: [0, 0], recall: [0, 0], spell: [0, 0], spellSessions: [], recallFree: 0, due: 0, last: 0 };
    return s[k];
  }

  /** Registra una respuesta. attempt = 1 en el primer intento. */
  function record(item, result, ctx) {
    ctx = ctx || {};
    var data = EQ.store.data;
    var attempt = ctx.attempt || 1;
    var sessionN = EQ.timer.session();
    var first = attempt === 1;
    var ok = !!result.correct;
    var kind = skillKind(item);
    var now = Date.now();

    // Ítem
    var it = data.items[item.id] || (data.items[item.id] = { seen: 0, ok: 0, fail: 0, firstOk: 0, lastTs: 0 });
    it.lastTs = now;
    if (first) { it.seen++; if (ok) { it.ok++; it.firstOk++; } else it.fail++; }
    else if (ok) it.ok++;

    // Errores pendientes de repasar
    if (first && !ok) data.errors[item.id] = { n: ((data.errors[item.id] || {}).n || 0) + 1, open: true, lastTs: now, kind: result.kind, run: ctx.runId || '' };
    else if (first && ok && data.errors[item.id] && data.errors[item.id].run !== ctx.runId) data.errors[item.id].open = false;

    // Ortografía
    if (result.kind === 'spelling' && result.typed) {
      data.spelling.push({ wrote: String(result.typed).trim(), right: result.target, ts: now });
      if (data.spelling.length > 200) data.spelling.splice(0, data.spelling.length - 200);
    }

    // Estadísticas
    var day = EQ.timer.day();
    if (first) {
      data.stats.answered++; day.answered++;
      if (ok) { data.stats.correctFirst++; day.ok++; }
    } else if (ok) {
      data.stats.fixedAfterError++;
    }

    // Memoria por clave (solo el primer intento mueve las cajas)
    (item.tags || []).forEach(function (t) {
      var k = key(t);
      k.last = now;
      if (!first) return;
      k.seen++;
      k[kind][ok ? 0 : 1]++;
      if (ok) {
        k.ok++;
        k.box = Math.min(5, k.box + 1);
        if (kind === 'spell' && k.spellSessions.indexOf(sessionN) < 0) {
          k.spellSessions.push(sessionN);
          if (k.spellSessions.length > 10) k.spellSessions.shift();
        }
        if (kind !== 'recog') k.recallFree++;
      } else {
        k.fail++;
        k.box = Math.max(0, k.box - 1);
      }
      k.due = sessionN + INTERVAL[k.box];
    });
    EQ.store.save();
  }

  function get(k) { return EQ.store.data.srs[k] || null; }

  function isVocab(k) { return !!EQ.vocab.get(k); }

  /** 'mastered' | 'learning' | 'new' */
  function status(k) {
    var s = get(k);
    if (!s || !s.seen) return 'new';
    if (isVocab(k)) {
      if (s.box >= 3 && s.spellSessions.length >= 2 && s.recallFree >= 1) return 'mastered';
      return 'learning';
    }
    // Gramática: caja ≥3 y al menos 6 respuestas con ≥ 75 % de acierto
    if (s.box >= 3 && s.seen >= 6 && s.ok / s.seen >= 0.75) return 'mastered';
    return 'learning';
  }

  /** 0 (dominado) … alto (le cuesta). Para elegir ejercicios. */
  function weakness(k) {
    var s = get(k);
    if (!s) return 2;
    var w = (5 - s.box) * 0.6 + Math.min(3, s.fail) * 0.5;
    if (s.due <= EQ.timer.session()) w += 1.5;
    if (status(k) === 'mastered') w *= 0.3;
    return w;
  }

  function accuracy(k) {
    var s = get(k);
    if (!s || !s.seen) return null;
    return s.ok / s.seen;
  }

  EQ.srs = { record: record, status: status, weakness: weakness, accuracy: accuracy, get: get, skillKind: skillKind };
})(window.EQ);
