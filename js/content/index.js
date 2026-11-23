/* content/index.js — Índice de todos los contenidos y metadatos de temas. */
(function (EQ) {
  'use strict';
  var TOPICS = [
    { id: 'could', title: "Could y couldn't", icon: '🦸', color: 'grammar', bank: EQ.bank.could },
    { id: 'connectors', title: 'And, but, so, because', icon: '🔗', color: 'grammar', bank: EQ.bank.connectors },
    { id: 'vocab', title: 'Vocabulario', icon: '🏞️', color: 'vocab', bank: EQ.bank.vocab },
    { id: 'sentence', title: 'Construir frases', icon: '🧱', color: 'practice', bank: EQ.bank.sentences },
    { id: 'mixed', title: 'Mezcla de todo', icon: '🎲', color: 'practice', bank: EQ.bank.mixed }
  ];
  var LEVELS = [
    { n: 1, name: 'Aprendo', icon: '🌱' },
    { n: 2, name: 'Practico', icon: '🌿' },
    { n: 3, name: 'Domino', icon: '🌳' }
  ];
  /** Etiquetas gramaticales → nombre legible y ficha a la que remiten */
  var GRAMMAR_TAGS = {
    could: { label: 'Could (afirmativa)', card: 'could' },
    couldnt: { label: "Couldn't (negativa)", card: 'couldnt' },
    question: { label: 'Preguntas con could', card: 'question' },
    short: { label: 'Respuestas cortas', card: 'short' },
    and: { label: 'And', card: 'and' },
    but: { label: 'But', card: 'but' },
    so: { label: 'So', card: 'so' },
    because: { label: 'Because', card: 'because' },
    order: { label: 'Orden de las palabras', card: null }
  };

  var byId = {};
  function index(list) { list.forEach(function (it) { byId[it.id] = it; }); }
  TOPICS.forEach(function (t) { index(t.bank); });
  EQ.grammar.list.forEach(function (c) { index(c.practice); });
  EQ.exams.list.forEach(function (e) { index(e.list); });

  EQ.content = {
    TOPICS: TOPICS,
    LEVELS: LEVELS,
    GRAMMAR_TAGS: GRAMMAR_TAGS,
    topic: function (id) { return TOPICS.filter(function (t) { return t.id === id; })[0]; },
    item: function (id) { return byId[id]; },
    /** Registra ejercicios creados al vuelo (fichas, parejas) para poder repasarlos. */
    register: function (it) { if (it && it.id && !byId[it.id]) byId[it.id] = it; },
    notebook: function () { var all = []; TOPICS.forEach(function (t) { all = all.concat(t.bank); }); return all; },
    all: function () { return Object.keys(byId).map(function (k) { return byId[k]; }); },
    isVocabTag: function (t) { return !!EQ.vocab.get(t); }
  };
})(window.EQ);
