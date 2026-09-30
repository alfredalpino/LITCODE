/**
 * 48-api-design — trust json
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 48-api-design/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type User = { id: string; name: string };
function load(json: string): User {
  return JSON.parse(json) as User;
}
console.log(load("{\"id\":1}"));
export {};
