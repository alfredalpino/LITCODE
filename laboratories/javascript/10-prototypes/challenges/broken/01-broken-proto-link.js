// CONTRACT: dog.speak() → "woof"
// Run: node 10-prototypes/challenges/broken/01-broken-proto-link.js

"use strict";

const animal = {
  speak() {
    return "woof";
  },
};

const dog = {};
dog.__proto__ = null; // bug: wiped link — also avoid __proto__ in modern code
// intended: link dog to animal

try {
  console.log(dog.speak());
} catch (e) {
  console.log(e.name, e.message.split("\n")[0]);
}
