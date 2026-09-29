// 06-functions / 04-hof.js
"use strict";

function map(arr, fn) {
  const out = [];
  for (const x of arr) out.push(fn(x));
  return out;
}

console.log(map([1, 2, 3], (n) => n * n));

function makeMultiplier(k) {
  return (n) => n * k;
}
const triple = makeMultiplier(3);
console.log(triple(4));
