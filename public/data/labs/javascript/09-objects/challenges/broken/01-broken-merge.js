// CONTRACT: mutating result.nested must not change DEFAULTS.nested
// Run: node 09-objects/challenges/broken/01-broken-merge.js

"use strict";

const DEFAULTS = { nested: { theme: "dark" } };

function merge(over) {
  return Object.assign(DEFAULTS, over); // bug: mutates defaults + shallow
}

const result = merge({ nested: { theme: "light" } });
result.nested.theme = "broken";
console.log(DEFAULTS.nested.theme); // should stay "dark" — currently wrong path
