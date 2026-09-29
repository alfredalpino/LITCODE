// 04-operators / 02-truthiness.js
"use strict";

const values = [false, 0, -0, 0n, "", null, undefined, NaN, "0", [], {}, " "];
for (const v of values) {
  console.log(JSON.stringify(v) ?? String(v), "→", Boolean(v));
}
