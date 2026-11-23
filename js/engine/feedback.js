/* feedback.js — Mensajes de corrección: siempre amables, breves y con el motivo.
   Nunca se usa solo el color: cada estado lleva icono y texto. */
(function (EQ) {
  'use strict';
  var h = EQ.h;
  var KIND_LABEL = { spelling: '✏️ Ortografía', grammar: '🧩 Gramática', comprehension: '💭 Significado', order: '🧱 Orden' };
  var OK = ['¡Muy bien!', '¡Genial!', '¡Lo has conseguido!', '¡Bravo!', '¡Así se hace!', '¡Fenomenal!'];
  var RETRY = ['Todavía no, ¡pero vas bien!', 'Casi… vamos a mirarlo otra vez.', 'Esta no es. ¡Inténtalo otra vez!', 'Ups, todavía no. ¡Tú puedes!'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var VERB_PAST = { swim: 'swam', climb: 'climbed', answer: 'answered', build: 'built', meet: 'met', fly: 'flew', write: 'wrote', run: 'ran', catch: 'caught' };

  function grammarReason(item, resp) {
    if (item.why && item.why[resp]) return item.why[resp];
    var a = item.answer;
    if (item.type === 'truefalse') {
      return resp === true ? 'Fíjate bien: esta frase tiene un error.' : 'Esta frase está bien escrita. ¡Léela otra vez despacio!';
    }
    var tags = item.tags || [];
    if (a === 'could' || a === "couldn't") {
      if (tags.indexOf('short') >= 0) return "Recuerda: Yes va con could y No va con couldn't.";
      if (tags.indexOf('question') >= 0) return 'Las preguntas empiezan por Could.';
      return a === 'could'
        ? 'En esta frase sí podía hacerlo. Busca la pista en la frase.'
        : 'En esta frase no podía hacerlo. Busca la pista en la frase.';
    }
    if (typeof resp === 'string' && /^to\s/.test(resp)) return 'Después de could o couldn\'t no se pone "to".';
    if (typeof resp === 'string' && Object.keys(VERB_PAST).some(function (k) { return VERB_PAST[k] === resp; })) return 'Después de could o couldn\'t, el verbo va en forma base (sin pasado).';
    var r = EQ.norm.base(resp || '');
    if (a === 'so' && r === 'because') return 'Lo que viene después es un resultado (una consecuencia). ¿Qué conector va con el resultado?';
    if (a === 'because' && r === 'so') return 'Lo que viene después es la causa (el porqué). ¿Qué conector va con la causa?';
    if (a === 'but' && r === 'and') return 'Las dos ideas se oponen. ¿Qué conector sirve para contrastar?';
    if (a === 'and' && r === 'but') return 'Las dos ideas se suman, no se oponen.';
    if ((a === 'so' || a === 'because') && (r === 'but' || r === 'and')) return 'Aquí hay una causa y un resultado. Piensa en so o because.';
    if ((a === 'and' || a === 'but') && (r === 'so' || r === 'because')) return 'Aquí no hay causa ni resultado. ¿Las ideas se suman o se oponen?';
    return 'Revisa la frase con calma. Puedes pedir una pista 💡';
  }

  function reason(item, resp, res) {
    switch (res.kind) {
      case 'empty': return 'Primero elige o escribe una respuesta.';
      case 'spelling': return res.msg || (res.diff && res.diff.info.msg) || 'Revisa cómo se escribe.';
      case 'order':
        if (res.incomplete) return 'Te faltan palabras por colocar.';
        var w = (item.answer.split(' ')[res.firstBad] || '');
        return 'Las palabras están bien, pero el orden no. Revisa a partir de la palabra n.º ' + (res.firstBad + 1) + '.' + (w ? '' : '');
      case 'comprehension':
        if (res.other) return 'Has escrito "' + res.other.base + '", que significa "' + res.other.esLabel + '". Buscamos otra palabra.';
        if (item.type === 'translate') return 'Esa no es la traducción. Mira el dibujo y piensa qué es.';
        if (item.type === 'write' || item.type === 'listen-write') return 'Esta palabra aún no ha salido. Escúchala y mírala otra vez.';
        if (item.icon) return 'Esa palabra significa otra cosa. Mira bien el dibujo.';
        return 'Esa palabra significa otra cosa. Lee la frase otra vez.';
      default: return grammarReason(item, resp);
    }
  }

  /** Muestra las letras de la respuesta y de la palabra correcta, marcadas. */
  function diffView(diff) {
    if (!diff) return null;
    var userRow = h('div', { class: 'diff-word', 'aria-label': 'Tu respuesta: ' + diff.user.toUpperCase() });
    var rightRow = h('div', { class: 'diff-word', 'aria-label': 'Palabra correcta: ' + diff.target.toUpperCase() });
    diff.ops.forEach(function (o) {
      if (o.op === 'eq') { userRow.appendChild(h('span', { class: 'dl ok' }, o.u)); rightRow.appendChild(h('span', { class: 'dl ok' }, o.c)); }
      else if (o.op === 'sub') { userRow.appendChild(h('span', { class: 'dl sub', title: 'letra cambiada' }, o.u)); rightRow.appendChild(h('span', { class: 'dl miss', title: 'letra correcta' }, o.c)); }
      else if (o.op === 'miss') { userRow.appendChild(h('span', { class: 'dl gap', title: 'falta una letra' }, '_')); rightRow.appendChild(h('span', { class: 'dl miss', title: 'esta letra faltaba' }, o.c)); }
      else if (o.op === 'extra') { userRow.appendChild(h('span', { class: 'dl extra', title: 'esta letra sobra' }, o.u)); }
    });
    return h('div', null,
      h('div', { class: 'diff' },
        h('span', { class: 'lbl' }, 'Tu respuesta:'), userRow,
        h('span', { class: 'lbl' }, 'Palabra correcta:'), rightRow),
      h('div', { class: 'diff-legend' }, 'Subrayado ondulado = letra cambiada · Tachado = letra que sobra · _ = falta una letra · Recuadro = letra correcta')
    );
  }

  function answerText(item) {
    if (item.type === 'truefalse') return item.answer ? 'Correcta ✔' : 'Tiene un error ✘';
    if (item.type === 'translate') return Array.isArray(item.answer) ? item.answer[0] : item.answer;
    if (['write', 'listen-write', 'missing', 'letters'].indexOf(item.type) >= 0) return EQ.checker.spellTarget(item);
    if (item.type === 'gap') return Array.isArray(item.answer) ? item.answer[0] : item.answer;
    return item.answer;
  }

  /**
   * state: 'ok' | 'retry' | 'solution'
   * Devuelve el nodo de feedback.
   */
  function render(item, resp, res, state, attempt) {
    var box = h('div', { class: 'feedback ' + state, role: 'status', 'aria-live': 'polite' });
    if (state === 'ok') {
      box.appendChild(h('div', { class: 'fb-title' }, '✅ ', attempt > 1 ? '¡Muy bien! Lo has conseguido al intentarlo otra vez 💪' : pick(OK)));
      if (res.note === 'spelling' && res.diff) {
        box.appendChild(h('p', null, 'Has acertado. Solo una cosita de escritura:'));
        box.appendChild(diffView(res.diff));
      }
      if (res.note === 'spanish') box.appendChild(h('p', null, 'Se escribe así: ', h('b', null, res.target)));
      if (item.explain) box.appendChild(h('p', { class: 'fb-explain' }, item.explain));
    } else if (state === 'retry') {
      box.appendChild(h('div', { class: 'fb-title' }, '🔁 ', res.kind === 'spelling' ? 'Conoces la palabra. Vamos a revisar las letras.' : pick(RETRY)));
      if (KIND_LABEL[res.kind]) box.appendChild(h('span', { class: 'fb-kind' }, KIND_LABEL[res.kind]));
      box.appendChild(h('p', { class: 'fb-explain' }, reason(item, resp, res)));
      if (res.diff && (res.kind === 'spelling' || res.kind === 'comprehension')) box.appendChild(diffView(res.diff));
    } else {
      box.appendChild(h('div', { class: 'fb-title' }, '💡 Vamos a verlo juntas'));
      if (KIND_LABEL[res.kind]) box.appendChild(h('span', { class: 'fb-kind' }, KIND_LABEL[res.kind]));
      box.appendChild(h('p', null, 'La respuesta correcta es: ', h('b', null, answerText(item))));
      if (res.diff) box.appendChild(diffView(res.diff));
      if (item.explain) box.appendChild(h('p', { class: 'fb-explain' }, item.explain));
      box.appendChild(h('p', { class: 'small muted' }, 'Este ejercicio volverá a salir más adelante para que lo practiques.'));
    }
    return box;
  }

  EQ.feedback = { render: render, reason: reason, diffView: diffView, answerText: answerText, KIND_LABEL: KIND_LABEL };
})(window.EQ);
