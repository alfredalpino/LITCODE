/**
 * 29-enums — as const alt
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 29-enums/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

const Direction = {
  North: "NORTH",
  South: "SOUTH",
} as const;
type Direction = (typeof Direction)[keyof typeof Direction];
function move(d: Direction) {
  console.log(d);
}
move(Direction.North);
export {};
