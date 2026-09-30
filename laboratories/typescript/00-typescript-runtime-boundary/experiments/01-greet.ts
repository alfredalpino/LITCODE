/**
 * Experiment 01 — greet
 *
 * LEARN: Type annotations document intent for the checker.
 * PREDICT: What will print? What will emit look like without `: string`?
 * TYPE-CHECK: included in root `npm run typecheck`
 * COMPILE: `npx tsc -p 00-typescript-runtime-boundary/tsconfig.emit.json`
 * RUN: `npx tsx 00-typescript-runtime-boundary/experiments/01-greet.ts`
 * BREAK: Call greet with a number while typechecking — then try bypassing via JS.
 */

function greet(name: string): string {
  return `Hello ${name}`;
}

console.log(greet("Ubaid"));

export { greet };
