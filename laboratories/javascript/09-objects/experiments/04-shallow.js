// 09-objects / 04-shallow.js
// PREDICT: predictions/P03-shallow.md
"use strict";

const original = { n: 1, nest: { x: 1 } };
const copy = { ...original };
copy.n = 2;
copy.nest.x = 99;
console.log("original.n", original.n);
console.log("original.nest.x", original.nest.x);
console.log("same nest?", original.nest === copy.nest);
