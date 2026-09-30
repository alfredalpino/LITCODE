// 03-variables / 05-hoisting.js
"use strict";

console.log("fn decl", typeof declared);
declared();

function declared() {
  console.log("declared ran");
}

console.log("expr", typeof expressed);
try {
  expressed();
} catch (e) {
  console.log("expressed() →", e.name);
}
var expressed = function () {
  console.log("expressed ran");
};
expressed();
