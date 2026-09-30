// 11-classes / 03-static.js
"use strict";

class MathUtil {
  static double(n) {
    return n * 2;
  }
  triple(n) {
    return n * 3;
  }
}

console.log(MathUtil.double(4));
const m = new MathUtil();
console.log(m.triple(4));
try {
  console.log(m.double(4));
} catch (e) {
  console.log("instance.double →", e.name);
}
