/**
 * 23-template-literal-types — open string
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 23-template-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function go(path: string) {
  console.log(path);
}
go("/not-api");
export {};
