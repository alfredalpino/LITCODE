/**
 * 04-functions — function type aliases
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 04-functions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Mapper = (n: number) => number;
type Predicate = (n: number) => boolean;
const double: Mapper = (n) => n * 2;
const isEven: Predicate = (n) => n % 2 === 0;
function applyAll(values: number[], map: Mapper, keep: Predicate): number[] {
  return values.map(map).filter(keep);
}
console.log(applyAll([1, 2, 3, 4], double, isEven));
const bad: Function = double;
console.log("Function erases arity:", typeof bad);
export {};
