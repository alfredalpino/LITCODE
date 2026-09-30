/**
 * 32-declaration-files — module shape
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 32-declaration-files/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

// Conceptual export shape for a JS module:
export type Widget = { id: string };
export function createWidget(id: string): Widget {
  return { id };
}
console.log(createWidget("w1"));
