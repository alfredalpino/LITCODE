/**
 * 23-template-literal-types — template
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 23-template-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type World = "world";
type Hello = `hello-${World}`;
const h: Hello = "hello-world";
console.log(h);
export {};
