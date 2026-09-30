// 09-objects / 02-access.js
"use strict";

const o = { a: 1 };
console.log(o.a, o["a"], o.missing);
o.b = 2;
delete o.a;
console.log(o);
