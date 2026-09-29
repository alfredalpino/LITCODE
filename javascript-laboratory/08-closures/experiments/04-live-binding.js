// 08-closures / 04-live-binding.js
// PREDICT: predictions/P03-live.md
"use strict";

let msg = "one";
function read() {
  console.log(msg);
}
read();
msg = "two";
read();
