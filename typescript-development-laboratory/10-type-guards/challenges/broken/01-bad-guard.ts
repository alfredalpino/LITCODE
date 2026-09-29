/**
 * 10-type-guards — bad guard
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 10-type-guards/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Point = { x: number; y: number };
function isPoint(u: unknown): u is Point {
  return typeof u === "object" && u !== null;
}
const raw: unknown = { x: "1", y: "2" };
if (isPoint(raw)) console.log(raw.x.toFixed(1));
export {};
