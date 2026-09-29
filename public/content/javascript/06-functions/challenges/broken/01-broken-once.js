// CONTRACT: once logs "run" once across three calls.
// Run: node 06-functions/challenges/broken/01-broken-once.js

"use strict";

function once(fn) {
  return function wrapped() {
    fn(); // bug: always runs
  };
}

const logOnce = once(() => console.log("run"));
logOnce();
logOnce();
logOnce();
