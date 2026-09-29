type Input = { value: string } | null;
function upper(i: Input): string {
  if (!i) return "";
  return i.value.toUpperCase();
}
console.log(upper({ value: "ok" }));
export {};
