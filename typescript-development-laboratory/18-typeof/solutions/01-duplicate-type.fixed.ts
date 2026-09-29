const defaults = { theme: "dark", locale: "en" } as const;
type Defaults = typeof defaults;
const d: Defaults = defaults;
console.log(d);
export {};
