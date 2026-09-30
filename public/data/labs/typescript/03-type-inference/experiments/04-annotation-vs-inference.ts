/**
 * 04 — annotation vs inference
 * RUN: npx tsx 03-type-inference/experiments/04-annotation-vs-inference.ts
 *
 * Compare: annotated export vs inferred local.
 */

export type User = {
  id: string;
  name: string;
};

// Public boundary — annotation documents contract & catches excess props on fresh literals
export function makeUser(id: string, name: string): User {
  return { id, name };
}

function internalHelper() {
  // Local inference is fine
  const temp = makeUser("1", "Ubaid");
  return temp.name.toUpperCase();
}

console.log(internalHelper());

// Fresh literal excess property check thanks to annotated return / target:
export function badUser(): User {
  // return { id: "1", name: "x", oops: true }; // Error if uncommented
  return { id: "1", name: "x" };
}

console.log(badUser());
