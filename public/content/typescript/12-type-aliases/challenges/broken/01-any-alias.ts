/**
 * 12-type-aliases — any alias
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 12-type-aliases/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Payload = any;
function send(p: Payload) {
  console.log(p.user.id);
}
send({ user: null });
export {};
