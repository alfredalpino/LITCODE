// CONTRACT (in comments): print exactly:
//   alpha
//   beta
//   gamma
// in that order.
// Currently broken — fix without removing the functions.
//
// Run: node 01-runtime/challenges/broken/01-silent-order.js

"use strict";

function printAlpha() {
  console.log("alpha");
}

function printBeta() {
  console.log("gamma"); // bug
}

function printGamma() {
  console.log("beta"); // bug
}

printAlpha();
printBeta();
printGamma();
