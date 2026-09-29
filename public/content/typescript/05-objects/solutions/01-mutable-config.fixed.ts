type Config = { readonly endpoints: readonly string[]; readonly debug: boolean };
const config: Config = { endpoints: ["/api"], debug: true };
function useConfig(c: Config) { console.log(c.endpoints.length, c.debug); }
useConfig(config);
export {};
