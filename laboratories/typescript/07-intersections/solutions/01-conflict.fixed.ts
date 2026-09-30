type Control = Button | Link; // union, not &
type Button = { kind: "button"; label: string };
type Link = { kind: "link"; href: string };
function render(c: Control) {
  if (c.kind === "button") console.log(c.label);
  else console.log(c.href);
}
render({ kind: "button", label: "Go" });
export {};
