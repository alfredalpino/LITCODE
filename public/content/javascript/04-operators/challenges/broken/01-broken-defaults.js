// CONTRACT:
// applyDefaults({ volume: 0, title: "" }) → { volume: 0, title: "", theme: "dark" }
// applyDefaults({}) → { volume: 5, title: "untitled", theme: "dark" }
// Run: node 04-operators/challenges/broken/01-broken-defaults.js

"use strict";

function applyDefaults(input) {
  return {
    volume: input.volume || 5,
    title: input.title || "untitled",
    theme: input.theme || "dark",
  };
}

console.log(JSON.stringify(applyDefaults({ volume: 0, title: "" })));
console.log(JSON.stringify(applyDefaults({})));
