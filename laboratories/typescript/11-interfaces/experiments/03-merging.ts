/**
 * 11-interfaces — merging
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 11-interfaces/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

interface Box {
  width: number;
}
interface Box {
  height: number;
}
const b: Box = { width: 1, height: 2 };
console.log(b);
export {};
