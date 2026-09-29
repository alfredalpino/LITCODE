// 03-variables / 06-shadowing.js
// PREDICT: predictions/P03-shadow.md
"use strict";

const x = "outer";
function demo(x) {
  console.log("param", x);
  {
    const x = "block";
    console.log("block", x);
  }
  console.log("param again", x);
}
demo("arg");
console.log("outer", x);
