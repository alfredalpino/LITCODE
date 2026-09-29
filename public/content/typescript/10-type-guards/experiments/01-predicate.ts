/**
 * 10-type-guards — predicate
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 10-type-guards/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

type Cat = { meow: true; name: string };
type Dog = { bark: true; name: string };
function isCat(a: Cat | Dog): a is Cat {
  return "meow" in a;
}
function speak(a: Cat | Dog) {
  if (isCat(a)) console.log(a.name, "meow");
  else console.log(a.name, "bark");
}
speak({ meow: true, name: "Mochi" });
export {};
