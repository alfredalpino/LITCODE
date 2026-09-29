/**
 * 07-intersections — compose
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 07-intersections/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Timestamped = { createdAt: number };
type SoftDelete = { deletedAt?: number };
type RecordRow = { id: string; body: string } & Timestamped & SoftDelete;
const row: RecordRow = { id: "r1", body: "hi", createdAt: Date.now() };
console.log(row);
export {};
