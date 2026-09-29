/**
 * 14-generics — box
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 14-generics/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Box<T> = { value: T };
function mapBox<T, U>(b: Box<T>, f: (t: T) => U): Box<U> {
  return { value: f(b.value) };
}
console.log(mapBox({ value: 2 }, (n) => String(n)));
export {};
