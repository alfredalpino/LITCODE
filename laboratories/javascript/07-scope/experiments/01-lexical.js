// 07-scope / 01-lexical.js
// PREDICT: predictions/P01-lexical.md
"use strict";

const x = "outer";

function show() {
  console.log(x);
}

function runner(fn) {
  const x = "runner-local";
  fn();
}

runner(show);
