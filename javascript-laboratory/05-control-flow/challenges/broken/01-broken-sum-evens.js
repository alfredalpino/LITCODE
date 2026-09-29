// CONTRACT: sum even numbers only.
// Run: node 05-control-flow/challenges/broken/01-broken-sum-evens.js

"use strict";

function sumEvens(nums) {
  let sum = 0;
  for (const n of nums) {
    if (n % 2 === 0) continue; // bug: skips evens
    sum += n;
  }
  return sum;
}

console.log(sumEvens([1, 2, 3, 4])); // expect 6
