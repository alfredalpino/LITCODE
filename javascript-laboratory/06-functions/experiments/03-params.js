// 06-functions / 03-params.js
// PREDICT: predictions/P02-params.md
"use strict";

function f(a = 1, b = a + 1, ...rest) {
  console.log({ a, b, rest });
}

f();
f(10);
f(10, 20, 30, 40);
f(undefined, 5);
