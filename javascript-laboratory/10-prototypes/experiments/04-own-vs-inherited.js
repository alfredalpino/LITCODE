// 10-prototypes / 04-own-vs-inherited.js
// PREDICT: predictions/P03-own.md
"use strict";

const p = { shared: true };
const o = Object.create(p);
o.own = true;

console.log("own" in o, "shared" in o);
console.log(Object.keys(o));
console.log(Object.hasOwn(o, "shared"));
for (const k in o) console.log("for-in", k);
