// CONTRACT: 2^2 + 4^2 = 20
// Run: node 12-arrays/challenges/broken/01-broken-sum-sq.js

"use strict";

function sumEvenSquares(arr) {
  return arr
    .filter((n) => n % 2 === 0)
    .map((n) => n * n)
    .reduce((a, b) => a + b); // bug: no init → throws on empty filter
}

console.log(sumEvenSquares([1, 2, 3, 4]));
console.log(sumEvenSquares([1, 3])); // expect 0
