// 08-closures / 02-loop-closures.js
// PREDICT: predictions/P02-loop.md
"use strict";

const withVar = [];
for (var i = 0; i < 3; i++) {
  withVar.push(function () {
    return i;
  });
}
console.log(
  "var",
  withVar.map((f) => f()).join(",")
);

const withLet = [];
for (let j = 0; j < 3; j++) {
  withLet.push(function () {
    return j;
  });
}
console.log(
  "let",
  withLet.map((f) => f()).join(",")
);
