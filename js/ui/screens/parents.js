/* parents.js — Panel para padres y profesores (separado por una pregunta sencilla). */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var unlocked = false;
  var NS = 'http://www.w3.org/2000/svg';
  function s(tag, attrs, text) {
    var el = document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    if (text !== undefined) el.textContent = text;
    return el;
  }

  function lastDays(n) {
    var out = [], d = new Date();
    for (var i = n - 1; i >= 0; i--) {
      var x = new Date(d.getFullYear(), d.getMonth(), d.getDate() - i);
      out.push(x.getFullYear() + '-' + String(x.getMonth() + 1).padStart(2, '0') + '-' + String(x.getDate()).padStart(2, '0'));
    }
    return out;
  }

  function barChart(days) {
    var daily = EQ.store.data.stats.daily;
    var vals = days.map(function (k) { return Math.round(((daily[k] || {}).sec || 0) / 60); });
    var max = Math.max(10, Math.max.apply(null, vals));
    var W = 560, H = 220, pad = 34, bw = (W - pad * 2) / days.length;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': 'Minutos de estudio por día' });
    svg.appendChild(s('line', { x1: pad, y1: H - pad, x2: W - pad, y2: H - pad, class: 'axis' }));
    vals.forEach(function (v, i) {
      var bh = (v / max) * (H - pad * 2 - 10);
      var x = pad + i * bw + bw * 0.18;
      svg.appendChild(s('rect', { x: x, y: H - pad - bh, width: bw * 0.64, height: Math.max(bh, v ? 2 : 0), rx: 6, class: 'bar' }));
      svg.appendChild(s('text', { x: x + bw * 0.32, y: H - pad - bh - 6, 'text-anchor': 'middle', 'font-size': 13 }, v + ' min'));
      var dt = new Date(days[i] + 'T12:00:00');
      svg.appendChild(s('text', { x: x + bw * 0.32, y: H - 12, 'text-anchor': 'middle', 'font-size': 13 }, dt.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })));
    });
    return svg;
  }

  function lineChart(exams) {
    var W = 560, H = 230, pad = 36;
    var svg = s('svg', { viewBox: '0 0 ' + W + ' ' + H, class: 'chart', role: 'img', 'aria-label': 'Evolución de las notas de los exámenes' });
    [0, 5, 10].forEach(function (g) {
      var y = H - pad - (g / 10) * (H - pad * 2);
      svg.appendChild(s('line', { x1: pad, y1: y, x2: W - pad, y2: y, class: 'axis', 'stroke-dasharray': g ? '4 6' : '' }));
      svg.appendChild(s('text', { x: 6, y: y + 4, 'font-size': 12 }, String(g)));
    });
    var n = exams.length, step = n > 1 ? (W - pad * 2) / (n - 1) : 0;
    var pts = exams.map(function (e, i) { return [pad + (n > 1 ? i * step : (W - pad * 2) / 2), H - pad - (e.grade / 10) * (H - pad * 2)]; });
    if (n > 1) svg.appendChild(s('polyline', { points: pts.map(function (p) { return p.join(','); }).join(' '), class: 'line' }));
    pts.forEach(function (p, i) {
      var e = exams[i];
      if (e.mode === 'real') svg.appendChild(s('rect', { x: p[0] - 7, y: p[1] - 7, width: 14, height: 14, class: 'dot' }));
      else svg.appendChild(s('circle', { cx: p[0], cy: p[1], r: 7, class: 'dot' }));
      svg.appendChild(s('text', { x: p[0], y: p[1] - 12, 'text-anchor': 'middle', 'font-size': 12 }, String(e.grade).replace('.', ',')));
      svg.appendChild(s('text', { x: p[0], y: H - 12, 'text-anchor': 'middle', 'font-size': 11 }, 'E' + e.exam));
    });
    return svg;
  }

  function gate(main) {
    var a = 3 + Math.floor(Math.random() * 6), b = 4 + Math.floor(Math.random() * 6);
    var inp = h('input', { class: 'answer-input', type: 'text', inputmode: 'numeric', 'aria-label': 'Resultado', autocomplete: 'off', style: { maxWidth: '200px' } });
    function tryOpen() {
      if (parseInt(inp.value, 10) === a * b) { unlocked = true; EQ.router.refresh(); }
      else EQ.ui.toast('Ese no es el resultado. Esta zona es para adultos 🙂');
    }
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') tryOpen(); });
    main.appendChild(EQ.ui.pageHead('👪 Zona de padres', '#/home'));
    main.appendChild(h('div', { class: 'card stack' },
      h('p', null, 'Esta zona es para madres, padres y profesores. Para entrar, resuelve:'),
      h('p', { style: { fontSize: '1.5rem', fontWeight: 700 } }, a + ' × ' + b + ' = ?'),
      inp,
      h('div', { class: 'btn-row' }, h('button', { type: 'button', class: 'btn', onclick: tryOpen }, 'Entrar'))));
  }

  function recommendation() {
    var d = EQ.store.data;
    var tags = Object.keys(EQ.content.GRAMMAR_TAGS).filter(function (t) { return t !== 'order'; });
    var weakG = tags.map(function (t) { var x = d.srs[t]; return { t: t, acc: x && x.seen >= 3 ? x.ok / x.seen : null, seen: x ? x.seen : 0 }; })
      .filter(function (x) { return x.acc !== null; }).sort(function (a, b) { return a.acc - b.acc; })[0];
    var notStarted = tags.filter(function (t) { return !d.srs[t] || !d.srs[t].seen; });
    var weakW = EQ.vocab.list.filter(function (v) { return EQ.srs.status(v.id) === 'learning'; })
      .sort(function (a, b) { return EQ.srs.weakness(b.id) - EQ.srs.weakness(a.id); }).slice(0, 4);
    var out = [];
    if (!d.stats.answered) return ['Todavía no hay actividad. Recomendación: empezar por las fichas de vocabulario y la ficha de "Could".'];
    if (weakG && weakG.acc < 0.75) out.push('Repasar la ficha de "' + EQ.content.GRAMMAR_TAGS[weakG.t].label + '" (acierta el ' + Math.round(weakG.acc * 100) + ' % a la primera) y hacer una tanda del cuaderno sobre ese tema.');
    if (notStarted.length) out.push('Aún no ha practicado: ' + notStarted.map(function (t) { return EQ.content.GRAMMAR_TAGS[t].label; }).join(', ') + '.');
    if (weakW.length) out.push('Palabras para seguir practicando por escrito: ' + weakW.map(function (v) { return v.base; }).join(', ') + '. Un buen ejercicio: "Pasar fichas" y "Listen and write".');
    var open = EQ.picker.openErrorCount();
    if (open) out.push('Tiene ' + open + ' ejercicios en "Repasar mis errores": conviene hacerlo antes de un simulacro.');
    if (!d.exams.length) out.push('Cuando lleve 2-3 sesiones, probar el Examen 1 en modo Entrenamiento.');
    else if (!d.exams.some(function (e) { return e.mode === 'real'; })) out.push('Ya ha hecho entrenamientos: puede probar un examen en modo real.');
    if (!out.length) out.push('¡Todo va muy bien! Mantener sesiones cortas (10-15 min) y alternar simulacros con repasos.');
    return out;
  }

  function stat(icon, label, value) {
    return h('div', { class: 'card' }, h('div', { style: { fontSize: '1.6rem' } }, icon), h('div', { style: { fontSize: '1.4rem', fontWeight: 700 } }, value), h('div', { class: 'small muted' }, label));
  }

  EQ.router.add('parents', 'Zona de padres', function (main) {
    if (!unlocked) return gate(main);
    var d = EQ.store.data;
    var totalSec = Object.keys(d.stats.daily).reduce(function (a, k) { return a + (d.stats.daily[k].sec || 0); }, 0);
    var week = lastDays(7);
    var weekSec = week.reduce(function (a, k) { return a + ((d.stats.daily[k] || {}).sec || 0); }, 0);
    var acc = d.stats.answered ? Math.round((d.stats.correctFirst / d.stats.answered) * 100) : 0;
    var mastered = EQ.rewards.mastered();

    main.appendChild(EQ.ui.pageHead('👪 Zona de padres', '#/home', h('button', { type: 'button', class: 'btn secondary small', onclick: function () { unlocked = false; location.hash = '#/home'; } }, '🔒 Cerrar')));
    main.appendChild(h('div', { class: 'grid tight' },
      stat('⏱️', 'Tiempo de estudio total (aprox.)', EQ.fmtMinutes(totalSec)),
      stat('📅', 'Últimos 7 días', EQ.fmtMinutes(weekSec)),
      stat('✏️', 'Ejercicios respondidos', String(d.stats.answered)),
      stat('🎯', 'Acierto a la primera', acc + ' %'),
      stat('💪', 'Corregidos tras un fallo', String(d.stats.fixedAfterError)),
      stat('🏞️', 'Palabras dominadas', mastered + ' / 20'),
      stat('✅', 'Tandas y exámenes terminados', String(d.stats.runsDone)),
      stat('📝', 'Simulacros hechos', String(d.exams.length))));

    main.appendChild(h('div', { class: 'card stack', style: { marginTop: '14px' } }, h('h2', null, '💡 Qué practicar ahora'), h('ul', null, recommendation().map(function (t) { return h('li', null, t); }))));
    main.appendChild(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, 'Minutos de estudio (últimos 7 días)'), barChart(week)));

    // Palabras
    var groups = { mastered: [], learning: [], 'new': [] };
    EQ.vocab.list.forEach(function (v) { groups[EQ.srs.status(v.id)].push(v); });
    groups.learning.sort(function (a, b) { return EQ.srs.weakness(b.id) - EQ.srs.weakness(a.id); });
    function wordList(list, empty) {
      if (!list.length) return h('p', { class: 'muted' }, empty);
      return h('p', { lang: 'en' }, list.map(function (v) {
        var x = EQ.srs.get(v.id);
        return v.base + (x && x.seen ? ' (' + Math.round((x.ok / x.seen) * 100) + ' %)' : '');
      }).join(' · '));
    }
    main.appendChild(h('div', { class: 'card stack', style: { marginTop: '14px' } },
      h('h2', null, 'Vocabulario'),
      h('h3', null, '✔ Dominadas (' + groups.mastered.length + ')'), wordList(groups.mastered, 'Todavía ninguna: para dominarla tiene que recordarla y escribirla bien en dos sesiones distintas.'),
      h('h3', null, '🌱 Para seguir practicando (' + groups.learning.length + ')'), wordList(groups.learning, 'Ninguna pendiente.'),
      h('h3', null, '✨ Aún no practicadas (' + groups['new'].length + ')'), wordList(groups['new'], 'Ha practicado todas.')));

    // Gramática
    var tbody = h('tbody');
    Object.keys(EQ.content.GRAMMAR_TAGS).forEach(function (t) {
      var x = d.srs[t];
      var label = EQ.content.GRAMMAR_TAGS[t].label;
      var st = EQ.srs.status(t);
      tbody.appendChild(h('tr', null, h('td', null, label), h('td', null, x && x.seen ? x.seen : 0),
        h('td', null, x && x.seen ? EQ.ui.progressBar(Math.round((x.ok / x.seen) * 100), 100, label, Math.round((x.ok / x.seen) * 100) + ' %') : '—'),
        h('td', null, st === 'mastered' ? '✔ Dominado' : st === 'learning' ? '🌱 Practicando' : '—')));
    });
    main.appendChild(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, 'Resultados de gramática (primer intento)'),
      h('table', { class: 'simple' }, h('thead', null, h('tr', null, h('th', null, 'Tema'), h('th', null, 'Respuestas'), h('th', null, 'Acierto'), h('th', null, 'Estado'))), tbody)));

    // Errores ortográficos
    var agg = {};
    d.spelling.forEach(function (e) { var k = e.right; (agg[k] = agg[k] || { n: 0, wrote: {} }).n++; agg[k].wrote[e.wrote.toLowerCase()] = 1; });
    var keys = Object.keys(agg).sort(function (a, b) { return agg[b].n - agg[a].n; }).slice(0, 10);
    main.appendChild(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, 'Errores ortográficos frecuentes'),
      keys.length ? h('table', { class: 'simple' }, h('thead', null, h('tr', null, h('th', null, 'Palabra'), h('th', null, 'Veces'), h('th', null, 'Lo escribió así'))),
        h('tbody', null, keys.map(function (k) { return h('tr', null, h('td', { lang: 'en' }, h('b', null, k)), h('td', null, agg[k].n), h('td', { lang: 'en' }, Object.keys(agg[k].wrote).join(', '))); })))
        : h('p', { class: 'muted' }, 'Todavía no hay errores de ortografía registrados.'),
      h('p', { class: 'small muted' }, 'Solo se cuentan como ortográficos los fallos de 1-2 letras en una palabra que sí conoce; si escribe otra palabra se cuenta como fallo de significado.')));

    // Exámenes
    main.appendChild(h('div', { class: 'card', style: { marginTop: '14px' } }, h('h2', null, 'Evolución de los exámenes'),
      d.exams.length ? lineChart(d.exams.slice(-12)) : h('p', { class: 'muted' }, 'Todavía no ha hecho ningún simulacro.'),
      d.exams.length ? h('p', { class: 'small muted' }, '● entrenamiento · ■ examen real · E1-E5 = número de examen') : null,
      d.exams.length ? h('ul', { class: 'list-plain' }, d.exams.slice(-8).reverse().map(function (e, i) {
        var idx = d.exams.length - 1 - i;
        return h('li', null, h('a', { href: '#/exam-result/' + idx }, new Date(e.ts).toLocaleDateString('es-ES') + ' · Examen ' + e.exam + ' (' + (e.mode === 'real' ? 'real' : 'entrenamiento') + '): ' + String(e.grade).replace('.', ',')));
      })) : null));

    // Datos
    var file = h('input', { type: 'file', accept: 'application/json,.json', class: 'sr-only', id: 'import-file' });
    file.addEventListener('change', function () {
      var f = file.files && file.files[0]; if (!f) return;
      var rd = new FileReader();
      rd.onload = function () {
        try {
          var obj = JSON.parse(rd.result);
          if (!obj || typeof obj !== 'object' || !obj.version) throw new Error('formato');
          EQ.ui.confirm('¿Importar este progreso?', 'Se sustituirá el progreso actual por el del archivo.', 'Sí, importar', 'Cancelar').then(function (y) { if (y) { EQ.store.replace(obj); EQ.ui.toast('Progreso importado ✔'); EQ.router.refresh(); } });
        } catch (e) { EQ.ui.toast('Ese archivo no es un progreso válido de English Quest.'); }
      };
      rd.readAsText(f);
    });
    main.appendChild(h('div', { class: 'card stack', style: { marginTop: '14px' } }, h('h2', null, 'Datos y reinicios'),
      h('p', { class: 'small muted' }, 'Todo se guarda solo en este dispositivo (sin cuentas ni datos personales). Puedes copiar el progreso a otro dispositivo exportándolo e importándolo.'),
      h('div', { class: 'btn-row' },
        h('button', { type: 'button', class: 'btn secondary', onclick: function () {
          var blob = new Blob([EQ.store.exportJSON()], { type: 'application/json' });
          var a = h('a', { href: URL.createObjectURL(blob), download: 'english-quest-progreso-' + EQ.today() + '.json' });
          document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
        } }, '⬇️ Exportar progreso'),
        h('label', { class: 'btn secondary', for: 'import-file' }, '⬆️ Importar progreso'), file,
        h('button', { type: 'button', class: 'btn secondary', onclick: function () {
          var n = Object.keys(d.errors).length;
          EQ.ui.confirm('¿Vaciar la lista de errores?', 'Se borrarán los ' + n + ' ejercicios pendientes de "Repasar mis errores". El resto del progreso se mantiene.', 'Sí, vaciar', 'Cancelar').then(function (y) { if (y) { d.errors = {}; EQ.store.saveNow(); EQ.router.refresh(); } });
        } }, '🧹 Vaciar errores pendientes'),
        h('button', { type: 'button', class: 'btn exam', onclick: function () {
          EQ.ui.confirm('¿Reiniciar toda la aventura?', 'Se borrará TODO el progreso: estrellas, insignias, palabras dominadas, exámenes y estadísticas. Los ajustes de letra y colores se mantienen.', 'Continuar', 'Cancelar').then(function (y1) {
            if (!y1) return;
            EQ.ui.confirm('¿Seguro del todo?', 'Esta acción no se puede deshacer. Si quieres, exporta antes el progreso.', 'Sí, borrar todo', 'No, mejor no').then(function (y2) {
              if (!y2) return;
              EQ.store.resetAll(true); unlocked = false; EQ.ui.toast('Progreso reiniciado. ¡A empezar de nuevo! 🌱'); location.hash = '#/home';
            });
          });
        } }, '♻️ Reiniciar todo'))));
  });
})(window.EQ);
