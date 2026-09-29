// 12-arrays / 02-sparse.js
// PREDICT: predictions/P02-sparse.md
"use strict";

const a = [];
a.length = 3;
console.log("keys", Object.keys(a));
console.log(
  "map",
  a.map(() => 1)
);

const b = [undefined, undefined, undefined];
console.log("b keys", Object.keys(b));
console.log(
  "b map",
  b.map(() => 1)
);
