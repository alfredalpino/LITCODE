/**
 * 13-structural-typing — structural
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 13-structural-typing/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Point = { x: number; y: number };
const p = { x: 1, y: 2, label: "origin" };
function print(pt: Point) {
  console.log(pt.x, pt.y);
}
print(p);
export {};
