// 08-closures / 01-basic-closure.js
// PREDICT: predictions/P01-basic.md
"use strict";

function makeCounter() {
  let n = 0;
  return {
    inc() {
      n += 1;
      return n;
    },
    value() {
      return n;
    },
  };
}

const c = makeCounter();
console.log(c.inc(), c.inc(), c.value());
const d = makeCounter();
console.log(d.value(), c.value());
