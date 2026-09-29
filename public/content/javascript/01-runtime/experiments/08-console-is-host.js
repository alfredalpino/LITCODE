// 01-runtime / 08-console-is-host.js
// Run: node 01-runtime/experiments/08-console-is-host.js

"use strict";

console.log("typeof console        →", typeof console);
console.log("typeof console.log    →", typeof console.log);
console.log("console === globalThis.console →", console === globalThis.console);

// Language built-ins exist without "importing" host APIs:
console.log("typeof Object         →", typeof Object);
console.log("typeof Array          →", typeof Array);

// Reflection: console is an ordinary object from the program's point of view.
console.log("Object.keys(console).slice(0, 5) →", Object.keys(console).slice(0, 5));
