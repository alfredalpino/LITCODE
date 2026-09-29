// 07-scope / 02-chain.js
"use strict";

const a = 1;
function outer() {
  const b = 2;
  function inner() {
    const c = 3;
    console.log(a, b, c);
  }
  inner();
}
outer();
