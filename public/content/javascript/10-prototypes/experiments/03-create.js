// 10-prototypes / 03-create.js
"use strict";

const dict = Object.create(null);
dict.a = 1;
console.log(dict.a);
console.log("toString" in dict);
console.log(Object.getPrototypeOf(dict));
