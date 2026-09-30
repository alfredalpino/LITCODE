/**
 * Experiment 04 — what survives at runtime?
 *
 * PREDICT the table in predictions/P03-what-survives.md first.
 * Then run + emit.
 *
 * RUN: npx tsx 00-typescript-runtime-boundary/experiments/04-runtime-survival.ts
 * EMIT: npx tsc -p 00-typescript-runtime-boundary/tsconfig.emit.json
 */

type UserId = string; // type-space only

interface User {
  id: UserId;
  name: string;
}

function identity<T>(value: T): T {
  return value;
}

enum Role {
  Admin = "admin",
  User = "user",
}

class Person {
  constructor(public name: string) {}
}

const user = { id: "1", name: "Ubaid" } as User;

console.log("identity(1) =", identity(1));
console.log("Role.Admin =", Role.Admin);
console.log("Person instance =", new Person("Ubaid"));
console.log("typeof Person =", typeof Person);
console.log("typeof Role =", typeof Role);
console.log("user (asserted) =", user);

// Interfaces / type aliases are not values:
// console.log(User); // would be a value-position error

export {};
