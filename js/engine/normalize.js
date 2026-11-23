/* normalize.js — Normalización de respuestas escritas. */
(function (EQ) {
  'use strict';
  function base(s) {
    return String(s === undefined || s === null ? '' : s)
      .replace(/[’‘´`ʼ′]/g, "'") // apóstrofos tipográficos → '
      .replace(/[“”«»"]/g, '')               // comillas
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .replace(/\s+([,.!?])/g, '$1')
      .trim()
      .replace(/[.!?¡¿]+$/g, '')
      .replace(/^[¡¿]+/g, '')
      .trim();
  }
  /** "could not" → "couldn't" (cuando la actividad lo permite) */
  function contract(s) { return s.replace(/\bcould not\b/g, "couldn't").replace(/\bcouldnt\b/g, "couldn't"); }
  /** Quita el "to" inicial de los verbos: "to meet" → "meet" */
  function stripTo(s) { return s.replace(/^to\s+/, ''); }
  /** Para respuestas en español: sin tildes ni artículo inicial. */
  function esFold(s) {
    var t = base(s);
    if (t.normalize) t = t.normalize('NFD').replace(/[̀-ͯ]/g, '');
    return t.replace(/^(el|la|los|las|un|una|unos|unas)\s+/, '').trim();
  }
  /** Solo letras (para comparar ortografía): quita espacios y signos, conserva el apóstrofo. */
  function letters(s) { return base(s).replace(/[^a-z']/g, ''); }
  /** Para frases: minúsculas, sin comas ni puntuación final. */
  function sentence(s) { return base(s).replace(/,/g, '').replace(/\s+/g, ' ').trim(); }

  EQ.norm = { base: base, contract: contract, stripTo: stripTo, esFold: esFold, letters: letters, sentence: sentence };
})(window.EQ);
