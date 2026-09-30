// 10-prototypes / 02-constructor.js
// PREDICT: predictions/P02-ctor.md
"use strict";

function Person(name) {
  this.name = name;
}
Person.prototype.kind = "human";

const p = new Person("ada");
console.log(p.name, p.kind);
console.log(Object.getPrototypeOf(p) === Person.prototype);
console.log(p.constructor === Person);
