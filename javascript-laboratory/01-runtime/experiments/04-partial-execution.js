// 01-runtime / 04-partial-execution.js
// PREDICT: which logs appear before the throw?
// Run: node 01-runtime/experiments/04-partial-execution.js

"use strict";

console.log("one");
console.log("two");
null(); // throws
console.log("three");
