// 03-variables / 01-binding-vs-mutation.js
"use strict";

let x = { n: 1 };
const y = x;
console.log("same ref?", x === y);
x.n = 99;
console.log("y.n", y.n);
x = { n: 2 };
console.log("y.n after rebind", y.n);
console.log("x === y", x === y);
