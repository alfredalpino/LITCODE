/**
 * 23-template-literal-types — intrinsic
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 23-template-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Prop = "name";
type Getter = `get${Capitalize<Prop>}`;
const g: Getter = "getName";
console.log(g);
export {};
