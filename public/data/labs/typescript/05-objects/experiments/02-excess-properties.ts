/**
 * 05-objects — excess properties
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 05-objects/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Point = { x: number; y: number };
const ok: Point = { x: 1, y: 2 };
console.log("ok", ok);
const weird = { x: 1, y: 2, z: 3 };
const sneaky: Point = weird;
console.log("sneaky still has z at runtime", (weird as { z: number }).z);
export {};
