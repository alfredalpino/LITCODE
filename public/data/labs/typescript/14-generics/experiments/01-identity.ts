/**
 * 14-generics — identity
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 14-generics/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function identity<T>(value: T): T {
  return value;
}
console.log(identity("ts"), identity(42));
export {};
