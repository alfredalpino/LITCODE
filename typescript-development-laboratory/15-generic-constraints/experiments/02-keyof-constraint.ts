/**
 * 15-generic-constraints — keyof
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 15-generic-constraints/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
console.log(getProp({ a: 1, b: "x" }, "b"));
export {};
