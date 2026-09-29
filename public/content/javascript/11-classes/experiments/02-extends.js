// 11-classes / 02-extends.js
// PREDICT: predictions/P02-extends.md
"use strict";

class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return "...";
  }
}

class Dog extends Animal {
  speak() {
    return "woof " + this.name;
  }
}

const d = new Dog("rex");
console.log(d.speak());
console.log(d instanceof Dog, d instanceof Animal);
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);
