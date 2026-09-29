// 04-operators / 01-plus-minus.js
// PREDICT: predictions/P01-plus.md
"use strict";

console.log("1 + 2", 1 + 2);
console.log("'1' + 2", "1" + 2);
console.log("1 + '2'", 1 + "2");
console.log("'1' - 2", "1" - 2);
console.log("[] + {}", [] + {});
console.log("{} + []", {} + []); // note: parsing quirk in some REPL contexts; script is fine
console.log("true + 1", true + 1);
console.log("null + 1", null + 1);
console.log("undefined + 1", undefined + 1);
