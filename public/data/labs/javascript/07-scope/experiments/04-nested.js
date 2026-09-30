// 07-scope / 04-nested.js
// PREDICT: predictions/P03-nested.md
"use strict";

function makeGreeter(greeting) {
  return function (name) {
    console.log(greeting + ", " + name);
  };
}

const hi = makeGreeter("hi");
const yo = makeGreeter("yo");
hi("ada");
yo("linus");
