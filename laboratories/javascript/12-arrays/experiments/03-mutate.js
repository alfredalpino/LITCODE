// 12-arrays / 03-mutate.js
"use strict";

const a = [3, 1, 2];
const sortedCopy = a.toSorted?.() ?? [...a].sort((x, y) => x - y);
console.log("copy", sortedCopy, "orig", a);
a.sort((x, y) => x - y);
console.log("mutated", a);

const b = [1, 2, 3];
const c = b.concat([4]);
console.log(b, c, b === c);
