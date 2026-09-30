/**
 * 32-declaration-files — declare sketch
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 32-declaration-files/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

/**
 * In a real project this signature would live in legacy-greet.d.ts:
 *   declare function legacyGreet(name: string): string;
 * `declare` alone emits nothing — a JS implementation must exist at runtime.
 */
function legacyGreet(name: string): string {
  return `hi ${name}`;
}
console.log(legacyGreet("lab"));
console.log("Lesson: .d.ts describes; .js implements.");
export {};
