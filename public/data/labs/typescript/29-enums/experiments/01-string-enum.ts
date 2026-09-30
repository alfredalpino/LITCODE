/**
 * 29-enums — string enum
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 29-enums/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

enum Direction {
  North = "NORTH",
  South = "SOUTH",
}
function move(d: Direction) {
  console.log("move", d);
}
move(Direction.North);
console.log("runtime object keys", Object.keys(Direction));
export {};
