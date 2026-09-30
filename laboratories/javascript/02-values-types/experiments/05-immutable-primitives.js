// 02-values-types / 05-immutable-primitives.js
"use strict";

const s = "loop";
const upper = s.toUpperCase();
console.log("original", s);
console.log("upper", upper);
console.log("s === upper", s === upper);

const n = 7;
console.log((8).toString(2)); // wrapper momentarily for method call
console.log(typeof n);
