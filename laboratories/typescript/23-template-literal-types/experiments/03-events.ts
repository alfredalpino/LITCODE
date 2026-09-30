/**
 * 23-template-literal-types — events
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 23-template-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Base = "click" | "focus";
type HandlerName = `on${Capitalize<Base>}`;
const names: HandlerName[] = ["onClick", "onFocus"];
console.log(names.join(","));
export {};
