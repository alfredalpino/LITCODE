type Point = { x: number; y: number };
function isPoint(u: unknown): u is Point {
  return (
    typeof u === "object" &&
    u !== null &&
    typeof (u as { x?: unknown }).x === "number" &&
    typeof (u as { y?: unknown }).y === "number"
  );
}
const raw: unknown = { x: 1, y: 2 };
if (isPoint(raw)) console.log(raw.x.toFixed(1));
export {};
