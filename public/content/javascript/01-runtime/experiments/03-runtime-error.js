// 01-runtime / 03-runtime-error.js
// Parses successfully, then throws at runtime.
// Run: node 01-runtime/experiments/03-runtime-error.js

"use strict";

console.log("parsed and started running");

const notAFunction = 42;
notAFunction(); // TypeError
