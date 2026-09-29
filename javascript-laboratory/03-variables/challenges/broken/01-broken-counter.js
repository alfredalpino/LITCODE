// CONTRACT: two counters must not share state.
// Run: node 03-variables/challenges/broken/01-broken-counter.js

"use strict";

let shared = 0; // bug: shared across counters

function makeCounter() {
  return {
    inc() {
      shared += 1;
      return shared;
    },
  };
}

const a = makeCounter();
const b = makeCounter();
console.log(a.inc(), a.inc()); // expect 1 2
console.log(b.inc()); // expect 1 — currently wrong
