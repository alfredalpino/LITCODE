// 01-runtime / 13-blocking-sync.js
// Feel synchronous blocking. Time between logs is busy-work, not a timer.
// Run: node 01-runtime/experiments/13-blocking-sync.js

"use strict";

function busy(ms) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    // spin — occupies the agent synchronously
  }
}

console.log("before busy");
busy(800);
console.log("after busy (~800ms later)");

console.log(
  "Host could not run other tasks on this agent during the spin (simplified model)."
);
