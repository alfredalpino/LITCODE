/**
 * Sample fix for needs-literal
 */

type Status = "idle" | "loading" | "success";

let status: Status = "idle";

function setStatus(s: Status) {
  console.log(s);
}

setStatus(status);
status = "loading";
setStatus(status);

export {};
