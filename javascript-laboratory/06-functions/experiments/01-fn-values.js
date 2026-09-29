// 06-functions / 01-fn-values.js
// PREDICT: predictions/P01-values.md
"use strict";

function greet(name) {
  return "hi " + name;
}

const also = greet;
console.log(also("lab"));
console.log(typeof greet);

function runTwice(fn) {
  fn();
  fn();
}
runTwice(() => console.log("tick"));
