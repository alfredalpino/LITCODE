/**
 * 12-type-aliases — json-ish
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 12-type-aliases/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
const data: Json = { ok: true, items: [1, "x", null] };
console.log(JSON.stringify(data));
export {};
