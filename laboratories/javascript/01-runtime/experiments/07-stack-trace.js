// 01-runtime / 07-stack-trace.js
// Run and READ the stack trace carefully (bottom → top).
// Run: node 01-runtime/experiments/07-stack-trace.js

"use strict";

function deepest() {
  throw new Error("trace me");
}

function middle() {
  deepest();
}

function outer() {
  middle();
}

outer();
