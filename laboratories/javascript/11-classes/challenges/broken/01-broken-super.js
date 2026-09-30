// CONTRACT: new Employee("ada", 1) works and prints ada
// Run: node 11-classes/challenges/broken/01-broken-super.js

"use strict";

class Person {
  constructor(name) {
    this.name = name;
  }
}

class Employee extends Person {
  constructor(name, id) {
    this.id = id; // bug: before super
    super(name);
  }
}

try {
  const e = new Employee("ada", 1);
  console.log(e.name, e.id);
} catch (err) {
  console.log(err.name, err.message.split("\n")[0]);
}
