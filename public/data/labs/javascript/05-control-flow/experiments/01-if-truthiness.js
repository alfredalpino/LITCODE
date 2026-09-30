// 05-control-flow / 01-if-truthiness.js
// PREDICT: predictions/P01-if.md
"use strict";

function branch(v) {
  if (v) return "truthy";
  return "falsy";
}

for (const v of [1, 0, "0", [], {}, null, undefined, "hi"]) {
  console.log(JSON.stringify(v) ?? String(v), branch(v));
}
