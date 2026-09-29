// 07-scope / 03-block-fn.js
// PREDICT: predictions/P02-block.md
"use strict";

function demo(flag) {
  if (flag) {
    var fromVar = "var";
    let fromLet = "let";
    console.log(fromVar, fromLet);
  }
  console.log("fromVar?", typeof fromVar);
  try {
    console.log(fromLet);
  } catch (e) {
    console.log("fromLet →", e.name);
  }
}
demo(true);
