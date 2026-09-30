/**
 * 05 — as const preview (inference hook)
 * RUN: npx tsx 03-type-inference/experiments/05-as-const-preview.ts
 */

const statusWide = "success"; // let would be string; const is "success"
let statusLet = "success"; // string

const statuses = ["idle", "loading", "success"] as const;
// typeof statuses[number] is "idle" | "loading" | "success"

type Status = (typeof statuses)[number];

function setStatus(s: Status) {
  console.log("status=", s);
}

setStatus("idle");
// setStatus(statusLet); // Error: string not assignable
setStatus(statusWide); // OK — literal "success"

console.log({ statusWide, statusLet, statuses });

export {};
