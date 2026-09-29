// 11-classes / 01-class-basics.js
// PREDICT: predictions/P01-class.md
"use strict";

class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "hi " + this.name;
  }
}

const p = new Person("ada");
console.log(p.greet());
console.log(typeof Person);
console.log(Object.getPrototypeOf(p) === Person.prototype);
console.log(p.hasOwnProperty("greet"));
