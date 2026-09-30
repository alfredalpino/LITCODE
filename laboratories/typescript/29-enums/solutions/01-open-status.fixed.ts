const Status = { Idle: "idle", Running: "running" } as const;
type Status = (typeof Status)[keyof typeof Status];
function setStatus(s: Status) {
  console.log(s);
}
setStatus(Status.Running);
export {};
