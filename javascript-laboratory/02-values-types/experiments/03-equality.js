// 02-values-types / 03-equality.js
// PREDICT: predictions/P02-equality.md
"use strict";

console.log("NaN === NaN", NaN === NaN);
console.log("Object.is(NaN, NaN)", Object.is(NaN, NaN));
console.log("+0 === -0", +0 === -0);
console.log("Object.is(+0, -0)", Object.is(+0, -0));
console.log('"5" === 5', "5" === 5);
console.log('"5" == 5', "5" == 5); // loose — preview only; prefer ===
