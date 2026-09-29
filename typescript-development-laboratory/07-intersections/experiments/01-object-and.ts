/**
 * 07-intersections — object &
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 07-intersections/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Identified = { id: string };
type Named = { name: string };
type Entity = Identified & Named;
const e: Entity = { id: "1", name: "Node" };
console.log(e.id, e.name);
export {};
