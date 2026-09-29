/**
 * 05-objects — tuples
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 05-objects/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Pair = [string, number];
type Entry = [key: string, value: unknown];
const pair: Pair = ["age", 30];
const entry: Entry = ["role", "admin"];
function first<T>(t: readonly [T, ...unknown[]]): T {
  return t[0];
}
console.log(pair[0], pair[1], first(entry));
export {};
