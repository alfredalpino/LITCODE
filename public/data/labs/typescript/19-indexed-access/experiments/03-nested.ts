/**
 * 19-indexed-access — nested
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 19-indexed-access/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Api = { data: { user: { email: string } } };
type Email = Api["data"]["user"]["email"];
const e: Email = "a@b.co";
console.log(e);
export {};
