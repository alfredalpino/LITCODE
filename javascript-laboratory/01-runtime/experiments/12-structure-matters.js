// 01-runtime / 12-structure-matters.js
// Same building blocks, different structure → different meaning.
// PREDICT each block's output before running.
// Run: node 01-runtime/experiments/12-structure-matters.js

"use strict";

console.log("block A");
console.log(1 + 2 * 3); // predict

console.log("block B");
console.log((1 + 2) * 3); // predict

console.log("block C");
function f() {
  return
  { ok: true };
}
console.log(f()); // predict — ASI (Automatic Semicolon Insertion) surprise

console.log(
  "\nASI note: 'return' followed by newline returns undefined; the object is a separate statement."
);
console.log("This is language grammar/ASI — not an engine bug.");
