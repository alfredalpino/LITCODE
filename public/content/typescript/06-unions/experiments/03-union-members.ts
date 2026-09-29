/**
 * 06-unions — members
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 06-unions/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "rect":
      return s.w * s.h;
  }
}
console.log(area({ kind: "circle", r: 2 }).toFixed(2));
export {};
