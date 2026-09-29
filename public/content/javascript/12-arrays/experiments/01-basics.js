// 12-arrays / 01-basics.js
// PREDICT: predictions/P01-basics.md
"use strict";

const a = [10, 20, 30];
console.log(a.length, typeof a, Array.isArray(a));
a[5] = 50;
console.log("length after a[5]=", a.length);
console.log("a[3]", a[3]);
console.log("3" in a, "5" in a);
