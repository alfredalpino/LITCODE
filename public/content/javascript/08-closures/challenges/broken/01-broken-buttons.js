// CONTRACT: print 0 1 2
// Run: node 08-closures/challenges/broken/01-broken-buttons.js

"use strict";

const handlers = [];
for (var i = 0; i < 3; i++) {
  handlers.push(function () {
    console.log(i);
  });
}
handlers.forEach((h) => h());
