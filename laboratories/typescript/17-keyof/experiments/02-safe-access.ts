/**
 * 17-keyof — safe access
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 17-keyof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
function set<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}
const u = { id: "1", score: 10 };
console.log(get(u, "score"));
set(u, "score", 11);
console.log(u);
export {};
