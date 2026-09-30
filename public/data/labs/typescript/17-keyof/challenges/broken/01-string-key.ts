/**
 * 17-keyof — string key
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 17-keyof/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function read(obj: Record<string, number>, key: string) {
  return obj[key];
}
console.log(read({ a: 1 }, "b"));
export {};
