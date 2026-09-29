// 06-functions / 02-forms.js
"use strict";

console.log("decl", typeof declared);
declared();
function declared() {
  console.log("declared ok");
}

console.log("expr", typeof expressed);
var expressed = function () {
  console.log("expressed ok");
};
expressed();

const arrow = (x) => x * 2;
console.log("arrow", arrow(21));
