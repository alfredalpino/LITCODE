/**
 * Experiment 05 — assertion is not validation
 *
 * RUN: npx tsx 00-typescript-runtime-boundary/experiments/05-json-lie.ts
 */

type User = {
  id: string;
  name: string;
};

const payload = '{"id":1,"name":null}'; // deliberately wrong vs User

// Compiles if you assert — still wrong at runtime.
const user = JSON.parse(payload) as User;

console.log("user:", user);
console.log("typeof user.id:", typeof user.id); // number at runtime
console.log("user.name:", user.name); // null at runtime
console.log("user.name.toUpperCase would throw if called");

export {};
