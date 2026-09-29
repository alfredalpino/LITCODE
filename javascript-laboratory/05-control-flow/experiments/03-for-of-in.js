// 05-control-flow / 03-for-of-in.js
// PREDICT: predictions/P02-loops.md
"use strict";

const arr = ["a", "b"];
arr.extra = "x";

console.log("for...of");
for (const v of arr) console.log(v);

console.log("for...in");
for (const k in arr) console.log(k, arr[k]);
