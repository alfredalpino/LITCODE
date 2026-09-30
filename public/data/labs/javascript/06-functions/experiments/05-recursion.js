// 06-functions / 05-recursion.js
// PREDICT: predictions/P03-recursion.md
"use strict";

function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}

console.log("fact(5)", fact(5));

function sum(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1));
}
console.log("sum", sum([1, 2, 3, 4]));
