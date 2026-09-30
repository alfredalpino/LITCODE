// 01-runtime / 06-call-stack-intro.js
// PREDICT: predictions/P04-call-stack.md
// Run: node 01-runtime/experiments/06-call-stack-intro.js

"use strict";

function beta() {
  console.log("in beta");
}

function alpha() {
  console.log("in alpha — before beta");
  beta();
  console.log("in alpha — after beta");
}

console.log("script — before alpha");
alpha();
console.log("script — after alpha");
