type AppGlobal = typeof globalThis & { APP_NAME: string };
(globalThis as AppGlobal).APP_NAME = "LITCODE";
console.log((globalThis as AppGlobal).APP_NAME.toUpperCase());
export {};
