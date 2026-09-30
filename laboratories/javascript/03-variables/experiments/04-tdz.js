// 03-variables / 04-tdz.js
// PREDICT: predictions/P02-tdz.md
"use strict";

console.log("var before decl", typeof hoistedVar);
var hoistedVar = "ok";

try {
  console.log(tdzLet);
} catch (e) {
  console.log("tdzLet →", e.name, e.message.split("\n")[0]);
}
let tdzLet = "alive";
console.log("after init", tdzLet);
