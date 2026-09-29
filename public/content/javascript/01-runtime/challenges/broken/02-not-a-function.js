// Should print: ready
// Then print: 42
// Currently throws — fix the bug.
//
// Run: node 01-runtime/challenges/broken/02-not-a-function.js

"use strict";

console.log("ready");

const answer = 42;
answer();
console.log(answer);
