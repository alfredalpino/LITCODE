type Job = { status: "done"; result: string } | { status: "failed"; error: string };
function message(j: Job): string {
  if (j.status === "done") return j.result.toUpperCase();
  return j.error;
}
console.log(message({ status: "done", result: "ok" }));
export {};
