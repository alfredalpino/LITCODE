/**
 * 16-generic-patterns — result
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 16-generic-patterns/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function mapOk<T, U, E>(r: Result<T, E>, f: (t: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
console.log(mapOk({ ok: true, value: 2 }, (n) => n * 2));
export {};
