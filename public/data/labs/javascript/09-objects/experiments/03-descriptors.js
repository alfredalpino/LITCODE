// 09-objects / 03-descriptors.js
// PREDICT: predictions/P02-desc.md
"use strict";

const o = {};
Object.defineProperty(o, "hidden", {
  value: 42,
  writable: false,
  enumerable: false,
  configurable: true,
});

console.log(o.hidden);
console.log(Object.keys(o));
console.log(Object.getOwnPropertyDescriptor(o, "hidden"));
try {
  o.hidden = 99;
} catch (e) {
  console.log("assign →", e.name);
}
console.log("after assign attempt", o.hidden);
