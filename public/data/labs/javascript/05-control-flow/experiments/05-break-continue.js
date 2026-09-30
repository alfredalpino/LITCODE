// 05-control-flow / 05-break-continue.js
"use strict";

for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  if (i === 4) break;
  console.log(i);
}
