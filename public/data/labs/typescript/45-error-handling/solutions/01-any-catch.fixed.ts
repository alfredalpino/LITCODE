try {
  JSON.parse("{");
} catch (e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  console.log(msg.toUpperCase());
}
export {};
