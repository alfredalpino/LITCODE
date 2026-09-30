// 11-classes / 04-private.js
// PREDICT: predictions/P03-private.md
"use strict";

class Counter {
  #n = 0;
  inc() {
    this.#n += 1;
    return this.#n;
  }
}

const c = new Counter();
console.log(c.inc(), c.inc());
console.log("n" in c, c.n);
// NOTE: reading c.#n outside the class is a SyntaxError — do not uncomment.
console.log("private field is not visible as c.n →", c.n);
