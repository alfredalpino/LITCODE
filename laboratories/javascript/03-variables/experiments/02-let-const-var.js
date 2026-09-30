// 03-variables / 02-let-const-var.js
// PREDICT: predictions/P01-declarations.md
"use strict";

var a = 1;
let b = 2;
const c = 3;

a = 10;
b = 20;
// c = 30; // would throw — leave commented; predict why

console.log(a, b, c);

{
  var aInner = "var-block";
  let bInner = "let-block";
  console.log("inside", aInner, bInner);
}
console.log("aInner outside?", typeof aInner);
try {
  console.log(bInner);
} catch (e) {
  console.log("bInner outside →", e.name);
}
