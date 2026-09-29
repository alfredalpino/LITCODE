/**
 * 01 — primitives exist (runtime) vs names (types)
 * RUN: npx tsx 02-basic-types/experiments/01-primitives-exist.ts
 *
 * PREDICT: typeof results for each value below.
 */

const s: string = "hi";
const n: number = 1;
const b: boolean = true;
const big: bigint = 10n;
const sym: symbol = Symbol("k");
const u: undefined = undefined;
const nul: null = null;

console.table([
  { label: "string", value: s, runtimeTypeof: typeof s },
  { label: "number", value: n, runtimeTypeof: typeof n },
  { label: "boolean", value: b, runtimeTypeof: typeof b },
  { label: "bigint", value: String(big), runtimeTypeof: typeof big },
  { label: "symbol", value: String(sym), runtimeTypeof: typeof sym },
  { label: "undefined", value: u, runtimeTypeof: typeof u },
  { label: "null", value: nul, runtimeTypeof: typeof nul }, // famous JS quirk
]);

console.log("Note: typeof null === 'object' is a JavaScript legacy quirk, not a TS invention.");

export {};
