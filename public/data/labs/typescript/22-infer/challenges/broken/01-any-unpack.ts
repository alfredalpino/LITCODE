/**
 * 22-infer — any unpack
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 22-infer/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

async function load(): Promise<{ id: string }> {
  return { id: "1" };
}
type Payload = any;
const demo: Payload = { id: "1" };
console.log(demo);
void load;
export {};
