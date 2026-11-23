/* checker.js — Corrección automática.
   Devuelve: { correct, kind, msg, note, diff, points, typed, target }
   kind: 'ok' | 'spelling' (ortográfico) | 'grammar' (gramatical) | 'comprehension' (comprensión)
         | 'order' (orden de palabras) | 'empty'
   Reglas clave:
   - Comprensión: se toleran mayúsculas, espacios y faltas leves (con nota).
   - Ortografía: letras exactas (las mayúsculas dan igual).
   - couldn't ≡ couldn’t ≡ could not (salvo huecos marcados noLong).
   - Un error leve de escritura NO se trata como desconocimiento del significado. */
(function (EQ) {
  'use strict';
  var N = EQ.norm, D = EQ.diff;
  var GRAMMAR_WORDS = ['could', "couldn't", 'can', "can't", 'and', 'but', 'so', 'because'];

  function arr(x) { return Array.isArray(x) ? x : [x]; }
  function vocabByBase(word) {
    var w = N.stripTo(N.base(word));
    return EQ.vocab.list.filter(function (v) { return v.base === w; })[0] || null;
  }
  function isVocabAnswer(item) {
    return arr(item.answer).some(function (a) {
      return EQ.vocab.list.some(function (v) { return v.en === a || v.base === N.base(a) || v.esLabel === a; });
    });
  }
  function spellingDiff(typed, target) {
    var u = N.letters(typed), c = N.letters(target);
    var ops = D.align(u, c);
    return { ops: ops, info: D.describe(ops), user: u, target: c };
  }

  /* ---------- Tipos ---------- */
  function checkChoice(item, resp) {
    if (resp === null || resp === undefined) return { correct: false, kind: 'empty', points: 0 };
    var ok = resp === item.answer;
    if (ok) return { correct: true, kind: 'ok', points: 1 };
    return { correct: false, kind: isVocabAnswer(item) ? 'comprehension' : 'grammar', points: 0 };
  }

  function checkTF(item, resp) {
    if (resp === null || resp === undefined) return { correct: false, kind: 'empty', points: 0 };
    if (resp === item.answer) return { correct: true, kind: 'ok', points: 1 };
    return { correct: false, kind: item.skill === 'vocab' ? 'comprehension' : 'grammar', points: 0 };
  }

  function prepGap(item, s) {
    var t = N.base(s);
    if (!item.noLong) t = N.contract(t);
    else t = t.replace(/\bcouldnt\b/g, "couldn't");
    if (item.spellCheck) t = N.stripTo(t);
    return t;
  }

  function checkGap(item, resp) {
    var typed = String(resp || '');
    if (!typed.trim()) return { correct: false, kind: 'empty', points: 0 };
    var t = prepGap(item, typed);
    var targets = arr(item.answer).concat(item.accept || []).map(function (a) { return prepGap(item, a); });
    var main = targets[0];
    if (targets.indexOf(t) >= 0) return { correct: true, kind: 'ok', points: 1 };

    // Hueco de vocabulario: se exige la ortografía
    if (item.spellCheck) {
      var other = vocabByBase(t);
      var sd = spellingDiff(t, main);
      if (other && other.base !== main) {
        return { correct: false, kind: 'comprehension', points: 0, other: other, diff: sd, typed: typed, target: main };
      }
      if (D.distance(N.letters(t), N.letters(main)) <= D.threshold(main.length)) {
        return { correct: false, kind: 'spelling', points: 0.5, diff: sd, typed: typed, target: main, msg: sd.info.msg };
      }
      return { correct: false, kind: 'comprehension', points: 0, typed: typed, target: main };
    }

    // Hueco gramatical: ¿ha escrito otra opción (could/so/because…)?
    var options = (item.bank || []).map(function (o) { return prepGap(item, o); });
    var pool = options.length ? options : GRAMMAR_WORDS;
    if (pool.indexOf(t) >= 0 || GRAMMAR_WORDS.indexOf(t) >= 0) {
      return { correct: false, kind: 'grammar', points: 0, typed: typed, target: main };
    }
    // ¿Es una falta de escritura de la respuesta correcta? (la opción más cercana es la buena)
    var best = null, bestD = 99;
    pool.concat([main]).forEach(function (o) {
      var dd = D.distance(N.letters(t), N.letters(o));
      if (dd < bestD) { bestD = dd; best = o; }
    });
    if (best === main && bestD <= D.threshold(main.length)) {
      var sd2 = spellingDiff(t, main);
      return { correct: true, kind: 'ok', points: 1, note: 'spelling', diff: sd2, typed: typed, target: main };
    }
    if (best && best !== main && bestD <= 1) {
      return { correct: false, kind: 'grammar', points: 0, typed: typed, target: main };
    }
    return { correct: false, kind: 'grammar', points: 0, typed: typed, target: main };
  }

  function checkTranslate(item, resp) {
    var typed = String(resp || '');
    if (!typed.trim()) return { correct: false, kind: 'empty', points: 0 };
    var t = N.esFold(typed);
    var accepted = arr(item.answer).map(N.esFold);
    if (accepted.indexOf(t) >= 0) return { correct: true, kind: 'ok', points: 1 };
    // Faltas leves en español: se acepta (no es el objetivo del examen de inglés)
    var close = accepted.filter(function (a) { return D.distance(t, a) <= (a.length <= 4 ? 1 : 2); })[0];
    if (close) {
      return { correct: true, kind: 'ok', points: 1, note: 'spanish', target: arr(item.answer)[accepted.indexOf(close)], typed: typed };
    }
    var other = EQ.vocab.list.filter(function (v) { return v.es.map(N.esFold).indexOf(t) >= 0; })[0];
    return { correct: false, kind: 'comprehension', points: 0, other: other || null, typed: typed, target: arr(item.answer)[0] };
  }

  function spellTarget(item) {
    if (item.word && EQ.vocab.get(item.word)) return EQ.vocab.get(item.word).base;
    return N.base(item.word || item.answer);
  }

  function checkSpelling(item, resp) {
    var typed = String(resp || '');
    if (!N.letters(typed)) return { correct: false, kind: 'empty', points: 0 };
    var target = spellTarget(item);
    var t = N.stripTo(N.base(typed)).replace(/\s+/g, ' ');
    if (N.letters(t) === N.letters(target)) return { correct: true, kind: 'ok', points: 1 };
    var sd = spellingDiff(t, target);
    var other = vocabByBase(t);
    if (other && other.base !== target) {
      return { correct: false, kind: 'comprehension', points: 0, other: other, diff: sd, typed: typed, target: target };
    }
    var dist = D.distance(N.letters(t), N.letters(target));
    if (dist <= D.threshold(target.length)) {
      return { correct: false, kind: 'spelling', points: 0.5, diff: sd, typed: typed, target: target, msg: sd.info.msg };
    }
    // Muy lejos: no la recuerda todavía (se trata como recuerdo, no como fallo de letras)
    return { correct: false, kind: item.type === 'letters' || item.type === 'missing' ? 'spelling' : 'comprehension', points: 0, diff: sd, typed: typed, target: target };
  }

  function tilesToSentence(resp) { return Array.isArray(resp) ? resp.join(' ') : String(resp || ''); }
  function checkOrder(item, resp) {
    var s = tilesToSentence(resp);
    if (!s.trim()) return { correct: false, kind: 'empty', points: 0 };
    var t = N.sentence(s);
    var targets = [item.answer].concat(item.accept || []).map(N.sentence);
    if (targets.indexOf(t) >= 0) return { correct: true, kind: 'ok', points: 1 };
    // ¿En qué palabra empieza el desorden?
    var tw = t.split(' '), cw = targets[0].split(' '), firstBad = 0;
    while (firstBad < tw.length && tw[firstBad] === cw[firstBad]) firstBad++;
    var incomplete = tw.length < cw.length;
    return { correct: false, kind: 'order', points: 0, firstBad: firstBad, incomplete: incomplete, typed: s, target: item.answer };
  }

  function check(item, resp) {
    var r;
    switch (item.type) {
      case 'choice': case 'listen-choice': r = checkChoice(item, resp); break;
      case 'truefalse': r = checkTF(item, resp); break;
      case 'gap': r = checkGap(item, resp); break;
      case 'translate': r = checkTranslate(item, resp); break;
      case 'write': case 'listen-write': case 'missing': case 'letters': r = checkSpelling(item, resp); break;
      case 'order': r = checkOrder(item, resp); break;
      case 'match': r = { correct: !!(resp && resp.mistakes === 0), kind: resp && resp.mistakes === 0 ? 'ok' : 'comprehension', points: resp && resp.mistakes === 0 ? 1 : 0.5 }; break;
      default: r = { correct: false, kind: 'empty', points: 0 };
    }
    return r;
  }

  EQ.checker = { check: check, spellTarget: spellTarget, spellingDiff: spellingDiff };
})(window.EQ);
