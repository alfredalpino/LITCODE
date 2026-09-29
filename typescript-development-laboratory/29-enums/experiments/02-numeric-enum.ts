/**
 * 29-enums — numeric enum
 * PREDICT before running.
 * Studio: Run in TS workbench (Sucrase strips types).
 * Local: npx tsx 29-enums/experiments/...
 * TYPE-CHECK: npm run typecheck (lab root)
 */

enum Status {
  Idle,
  Running,
  Done,
}
console.log(Status.Running, Status[1]);
export {};
