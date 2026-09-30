// CONTRACT: isNullish(null) and isNullish(undefined) → true
// isNullish(0), isNullish(""), isNullish(false) → false
// Currently broken.
// Run: node 02-values-types/challenges/broken/01-broken-type-check.js

"use strict";

function isNullish(v) {
  // Bug: treats all falsy values as nullish
  if (!v) return true;
  return false;
}

const cases = [null, undefined, 0, "", false, "ok"];
for (const c of cases) {
  console.log(String(c), "→", isNullish(c));
}
