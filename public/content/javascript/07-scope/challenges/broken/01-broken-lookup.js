// CONTRACT: printCount() prints 1 then 2 after bumps.
// Run: node 07-scope/challenges/broken/01-broken-lookup.js

"use strict";

let count = 0;

function bump() {
  count += 1;
}

function printCount() {
  let count = 999; // bug: shadows
  console.log(count);
}

bump();
printCount();
bump();
printCount();
