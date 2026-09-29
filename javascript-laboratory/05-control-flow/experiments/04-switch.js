// 05-control-flow / 04-switch.js
// PREDICT: predictions/P03-switch.md
"use strict";

function label(n) {
  switch (n) {
    case 1:
      return "one";
    case 2:
      console.log("two-ish");
    // fall through intentional below for demo
    case 3:
      return "two-or-three";
    default:
      return "other";
  }
}

console.log(label(1));
console.log(label(2));
console.log(label(3));
console.log(label("1")); // strict — default
