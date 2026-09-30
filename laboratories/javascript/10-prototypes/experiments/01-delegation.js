// 10-prototypes / 01-delegation.js
// PREDICT: predictions/P01-delegate.md
"use strict";

const proto = {
  greet() {
    return "hi " + this.name;
  },
};

const user = Object.create(proto);
user.name = "ada";
console.log(user.greet());
console.log(Object.getPrototypeOf(user) === proto);
console.log(user.hasOwnProperty("greet"));
