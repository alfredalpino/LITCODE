// 02-values-types / 01-typeof-primitives.js
// PREDICT: predictions/P01-typeof.md
// Run: node 02-values-types/experiments/01-typeof-primitives.js

"use strict";

const samples = [
  undefined,
  null,
  true,
  0,
  NaN,
  10n,
  "lab",
  Symbol("s"),
  {},
  [],
  function f() {},
];

for (const v of samples) {
  console.log(String(v), "→", typeof v);
}
