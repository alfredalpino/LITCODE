// 12-arrays / 04-mfr.js
// PREDICT: predictions/P03-mfr.md
"use strict";

const nums = [1, 2, 3, 4];
console.log(
  "map",
  nums.map((n) => n * 2)
);
console.log(
  "filter",
  nums.filter((n) => n % 2 === 0)
);
console.log(
  "reduce sum",
  nums.reduce((acc, n) => acc + n, 0)
);
console.log(
  "reduce build",
  nums.reduce((acc, n) => {
    acc[n] = n * n;
    return acc;
  }, {})
);
