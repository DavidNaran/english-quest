/* diff.js — Distancia de edición (Levenshtein) y alineación letra a letra
   para mostrar qué letras faltan, sobran o están cambiadas. */
(function (EQ) {
  'use strict';

  function matrix(a, b) {
    var m = a.length, n = b.length, d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) {
      for (j = 1; j <= n; j++) {
        var cost = a[i - 1] === b[j - 1] ? 0 : 1;
        d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      }
    }
    return d;
  }

  function distance(a, b) { return matrix(a, b)[a.length][b.length]; }

  /** Alinea la respuesta (user) con la correcta (target).
   *  ops: {op:'eq'|'sub'|'miss'|'extra', u: letra escrita, c: letra correcta} */
  function align(user, target) {
    var d = matrix(user, target), i = user.length, j = target.length, ops = [];
    while (i > 0 || j > 0) {
      if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (user[i - 1] === target[j - 1] ? 0 : 1)) {
        ops.unshift({ op: user[i - 1] === target[j - 1] ? 'eq' : 'sub', u: user[i - 1], c: target[j - 1] });
        i--; j--;
      } else if (j > 0 && d[i][j] === d[i][j - 1] + 1) {
        ops.unshift({ op: 'miss', c: target[j - 1] });
        j--;
      } else {
        ops.unshift({ op: 'extra', u: user[i - 1] });
        i--;
      }
    }
    return ops;
  }

  /** Resume el tipo de fallo ortográfico en lenguaje amable. */
  function describe(ops) {
    var miss = 0, extra = 0, sub = 0, swap = false;
    ops.forEach(function (o, k) {
      if (o.op === 'miss') miss++;
      else if (o.op === 'extra') extra++;
      else if (o.op === 'sub') {
        sub++;
        var n = ops[k + 1];
        if (n && n.op === 'sub' && n.u === o.c && n.c === o.u) swap = true;
      }
    });
    var total = miss + extra + sub;
    var msg;
    if (swap && sub === 2 && miss + extra === 0) msg = '¡Casi lo tienes! Hay dos letras cambiadas de sitio.';
    else if (total === 1 && miss === 1) msg = '¡Casi lo tienes! Falta una letra.';
    else if (total === 1 && extra === 1) msg = '¡Casi lo tienes! Sobra una letra.';
    else if (total === 1 && sub === 1) msg = '¡Casi lo tienes! Hay una letra cambiada.';
    else if (total === 2 && miss === 2) msg = '¡Muy cerca! Faltan dos letras.';
    else if (total <= 2) msg = '¡Muy cerca! Revisa dos letras.';
    else msg = 'Vamos a fijarnos bien en cómo se escribe.';
    return { miss: miss, extra: extra, sub: sub, swap: swap, total: total, msg: msg };
  }

  /** Máximo de errores para considerar que es un fallo de ortografía (no de significado). */
  function threshold(len) {
    if (len <= 3) return 1;
    if (len <= 6) return 2;
    return Math.max(2, Math.round(len * 0.3));
  }

  EQ.diff = { distance: distance, align: align, describe: describe, threshold: threshold };
})(window.EQ);
