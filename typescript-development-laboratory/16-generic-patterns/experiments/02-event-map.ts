/**
 * 16-generic-patterns — event map
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 16-generic-patterns/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Events = {
  login: { userId: string };
  logout: undefined;
};
function emit<K extends keyof Events>(type: K, payload: Events[K]) {
  console.log(type, payload);
}
emit("login", { userId: "u1" });
emit("logout", undefined);
export {};
