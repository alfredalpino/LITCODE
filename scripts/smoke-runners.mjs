/**
 * Node smoke checks for JS/TS transform path (Python needs browser Pyodide).
 */
import { transform } from "sucrase";

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

const jsCode = `
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const need = target - nums[i];
    if (map.has(need)) return [map.get(need), i];
    map.set(nums[i], i);
  }
  return [];
}
console.log(twoSum([2,7,11,15], 9).join(","));
`;

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
const logs = [];
await new AsyncFunction("console", `"use strict";\n${jsCode}`)({
  log: (...a) => logs.push(a.join(" ")),
});
assert(logs[0] === "0,1", `JS twoSum failed: ${logs[0]}`);

const tsCode = `
function greet(name: string): string {
  return "hi " + name;
}
console.log(greet("lab"));
`;
const { code: jsFromTs } = transform(tsCode, {
  transforms: ["typescript", "imports"],
  disableESTransforms: true,
});
const logs2 = [];
await new AsyncFunction("console", `"use strict";\n${jsFromTs}`)({
  log: (...a) => logs2.push(a.join(" ")),
});
assert(logs2[0] === "hi lab", `TS transpile failed: ${logs2[0]}`);

console.log("smoke-runners: JS OK · TS/Sucrase OK · (Python via Pyodide in browser)");
