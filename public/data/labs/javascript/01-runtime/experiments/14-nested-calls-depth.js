// 01-runtime / 14-nested-calls-depth.js
// Used by challenge C02 — predict logs + conceptual stack depth.
// Run: node 01-runtime/experiments/14-nested-calls-depth.js

"use strict";

function c() {
  console.log("c");
}

function b() {
  console.log("b-enter");
  c();
  console.log("b-exit");
}

function a() {
  console.log("a-enter");
  b();
  console.log("a-exit");
}

console.log("start");
a();
console.log("end");
