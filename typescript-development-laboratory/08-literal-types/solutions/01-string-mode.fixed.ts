const config = { mode: "dark" } as const;
function apply(mode: "light" | "dark") { console.log(mode); }
apply(config.mode);
export {};
