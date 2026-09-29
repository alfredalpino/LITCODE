/**
 * 12-type-aliases — aliases
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 12-type-aliases/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type ID = string;
type Pair = [ID, number];
type Handler = (id: ID) => void;
const p: Pair = ["u1", 1];
const h: Handler = (id) => console.log(id);
h(p[0]);
export {};
