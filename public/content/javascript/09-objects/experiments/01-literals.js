// 09-objects / 01-literals.js
// PREDICT: predictions/P01-props.md
"use strict";

const key = "role";
const user = {
  name: "ada",
  [key]: "admin",
  greet() {
    return "hi " + this.name;
  },
};

console.log(user.name, user.role);
console.log(user.greet());
console.log(Object.keys(user));
