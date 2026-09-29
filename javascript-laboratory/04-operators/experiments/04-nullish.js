// 04-operators / 04-nullish.js
// PREDICT: predictions/P03-nullish.md
"use strict";

const cfg = { volume: 0, title: "" };
console.log("volume || 5", cfg.volume || 5);
console.log("volume ?? 5", cfg.volume ?? 5);
console.log("title || 'n/a'", cfg.title || "n/a");
console.log("title ?? 'n/a'", cfg.title ?? "n/a");
console.log("missing ?? 1", cfg.missing ?? 1);
console.log("0 && 'x'", 0 && "x");
console.log("1 && 'x'", 1 && "x");
