/* rewards.js — Estrellas e insignias que premian el esfuerzo, la constancia y la mejora.
   Sin vidas, sin rankings, sin penalizaciones. */
(function (EQ) {
  'use strict';
  var BADGES = [
    { id: 'first', icon: '🌱', name: 'Primeros pasos', desc: 'Terminar tu primera tanda.', test: function (d) { return d.stats.runsDone >= 1; } },
    { id: 'brave', icon: '🦁', name: 'Valiente', desc: 'Corregir 10 respuestas después de equivocarte.', test: function (d) { return d.stats.fixedAfterError >= 10; } },
    { id: 'days3', icon: '📅', name: 'Constancia', desc: 'Practicar 3 días distintos.', test: function (d) { return studyDays(d) >= 3; } },
    { id: 'days5', icon: '🗓️', name: 'Superconstante', desc: 'Practicar 5 días distintos.', test: function (d) { return studyDays(d) >= 5; } },
    { id: 'explorer', icon: '🧭', name: 'Exploradora de palabras', desc: 'Abrir las 20 fichas de vocabulario.', test: function (d) { return Object.keys(d.stats.vocabVisited || {}).length >= 20; } },
    { id: 'speller', icon: '✏️', name: 'Buena escritora', desc: 'Escribir bien 20 palabras a la primera.', test: function (d) { return spellOk(d) >= 20; } },
    { id: 'could', icon: '🦸', name: 'Detective de could', desc: "Acertar 25 ejercicios de could y couldn't.", test: function (d) { return tagOk(d, ['could', 'couldnt', 'question', 'short']) >= 25; } },
    { id: 'sobecause', icon: '🔗', name: 'Maestra del so y because', desc: 'Acertar 20 ejercicios de so y because.', test: function (d) { return tagOk(d, ['so', 'because']) >= 20; } },
    { id: 'words10', icon: '💎', name: 'Coleccionista', desc: 'Dominar 10 palabras.', test: function () { return mastered() >= 10; } },
    { id: 'words20', icon: '👑', name: 'Todas las palabras', desc: 'Dominar las 20 palabras.', test: function () { return mastered() >= 20; } },
    { id: 'exam1', icon: '📝', name: 'Primer examen', desc: 'Terminar un simulacro de examen.', test: function (d) { return d.exams.length >= 1; } },
    { id: 'improve', icon: '📈', name: '¡Mejorando!', desc: 'Sacar más nota que la vez anterior en un examen.', test: function (d) { return improvedExam(d); } },
    { id: 'allexams', icon: '🏆', name: 'Lista para el examen', desc: 'Hacer los 5 simulacros en modo real.', test: function (d) { var s = {}; d.exams.forEach(function (e) { if (e.mode === 'real') s[e.exam] = 1; }); return Object.keys(s).length >= 5; } }
  ];

  function studyDays(d) { return Object.keys(d.stats.daily).filter(function (k) { return d.stats.daily[k].answered > 0; }).length; }
  function spellOk(d) { var n = 0; Object.keys(d.srs).forEach(function (k) { if (EQ.vocab.get(k)) n += d.srs[k].spell[0]; }); return n; }
  function tagOk(d, tags) { var n = 0; tags.forEach(function (t) { if (d.srs[t]) n += d.srs[t].ok; }); return n; }
  function mastered() { return EQ.vocab.ids.filter(function (id) { return EQ.srs.status(id) === 'mastered'; }).length; }
  function improvedExam(d) {
    var last = {};
    return d.exams.some(function (e) {
      var prev = last[e.exam]; last[e.exam] = e.grade;
      return prev !== undefined && e.grade > prev;
    });
  }

  /** Evalúa insignias nuevas. Devuelve las conseguidas ahora. */
  function checkBadges() {
    var d = EQ.store.data, got = [];
    BADGES.forEach(function (b) {
      if (!d.rewards.badges[b.id] && b.test(d)) { d.rewards.badges[b.id] = Date.now(); got.push(b); }
    });
    if (got.length) EQ.store.save();
    return got;
  }

  /**
   * Al terminar una tanda: estrellas por terminar, por perseverar y por mejorar.
   * summary: { key, results:[{firstCorrect, correct, attempts}] }
   */
  function onRunEnd(summary) {
    var d = EQ.store.data;
    var res = summary.results || [];
    var n = res.length || 1;
    var firstOk = res.filter(function (r) { return r.firstCorrect; }).length;
    var fixed = res.filter(function (r) { return !r.firstCorrect && r.correct; }).length;
    var ratio = firstOk / n;
    var reasons = [];
    var stars = 1; reasons.push('⭐ por terminar la tanda');
    if (fixed > 0) { stars++; reasons.push('⭐ por no rendirte y corregir ' + fixed + (fixed === 1 ? ' respuesta' : ' respuestas')); }
    var set = d.sets[summary.key] || { best: 0, last: null, count: 0 };
    if (set.last !== null && ratio > set.last + 0.001) { stars++; reasons.push('⭐ por mejorar respecto a la última vez'); }
    else if (set.last === null && ratio >= 0.8) { stars++; reasons.push('⭐ por un gran trabajo'); }
    set.last = ratio; set.best = Math.max(set.best, ratio); set.count++;
    d.sets[summary.key] = set;
    d.rewards.stars += stars;
    d.stats.runsDone++;
    d.rewards.log.push({ ts: Date.now(), stars: stars, key: summary.key });
    if (d.rewards.log.length > 300) d.rewards.log.shift();
    EQ.store.save();
    var badges = checkBadges();
    return { stars: stars, reasons: reasons, badges: badges, firstOk: firstOk, fixed: fixed, total: res.length };
  }

  EQ.rewards = { BADGES: BADGES, onRunEnd: onRunEnd, checkBadges: checkBadges, mastered: mastered, studyDays: studyDays };
})(window.EQ);
