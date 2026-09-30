// 02-values-types / 04-identity.js
"use strict";

const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log("a === b", a === b);
console.log("a === c", a === c);
c.x = 99;
console.log("a.x after mutating c", a.x);
