/**
 * 45-error-handling — unknown catch
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 45-error-handling/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function parse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("parse failed:", msg);
    return null;
  }
}
console.log(parse("{\"a\":1}"), parse("nope"));
export {};
