/**
 * 32-declaration-files — shim
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 32-declaration-files/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

/** Imagine this came from untyped JS — we only *describe* it */
type UntypedLib = {
  version: string;
  add(a: number, b: number): number;
};
const lib: UntypedLib = {
  version: "1.0.0",
  add: (a, b) => a + b,
};
console.log(lib.version, lib.add(2, 3));
export {};
