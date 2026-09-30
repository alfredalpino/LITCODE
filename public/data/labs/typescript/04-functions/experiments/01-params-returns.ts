/**
 * 04-functions — params & returns
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 04-functions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

function add(a: number, b: number): number {
  return a + b;
}
function logLabel(label: string): void {
  console.log("label:", label);
}
const greet = (name: string): string => `hello, ${name}`;
console.log(add(2, 3));
logLabel(greet("lab"));
// add("2", 3); // tsc error
export {};
