/**
 * 08-literal-types — literals
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 08-literal-types/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Direction = "n" | "s" | "e" | "w";
function move(d: Direction): string {
  return `go ${d}`;
}
let widened = "n"; // string
const locked = "n"; // "n"
console.log(move(locked));
// move(widened); // may error depending on annotation — prefer Direction
console.log("widened is", typeof widened);
export {};
