// 05-control-flow / 02-loops.js
"use strict";

let i = 0;
const out = [];
while (i < 3) {
  out.push(i);
  i += 1;
}
console.log("while", out.join(","));

const forOut = [];
for (let j = 0; j < 3; j++) forOut.push(j);
console.log("for", forOut.join(","));

let k = 0;
do {
  console.log("do", k);
  k += 1;
} while (k < 1);
