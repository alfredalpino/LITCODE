/**
 * 05-objects — mutable config
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 05-objects/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Config = { endpoints: string[]; debug: boolean };
const config: Config = { endpoints: ["/api"], debug: true };
function useConfig(c: Config) {
  c.endpoints.push("/secret");
  c.debug = false;
}
useConfig(config);
console.log(config);
export {};
