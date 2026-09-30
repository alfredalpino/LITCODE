# Solution — C01 Explain the layers

**Sample answer (yours may differ in wording):**

1. **Language (ECMAScript):** rules for syntax and semantics — what programs mean. Example: `const x = 1 + 1`, function calls, `===`.
2. **Engine:** software that implements those rules (parses, optimizes, executes). Example: V8 inside Node.js.
3. **Host:** the embedding that supplies the engine and platform APIs. Example: Node.js (`process`, `fs`) or a browser (`document`, `window`).

**Easy to confuse:** `console.log` — commonly available, but it is a **host-provided API**, not an ECMAScript keyword. `setTimeout` is likewise a host API. `require` is CommonJS/Node module loading — host/module system, not ES module syntax itself.

**Self-check:** If your answer said “JavaScript is the browser,” revise it.
