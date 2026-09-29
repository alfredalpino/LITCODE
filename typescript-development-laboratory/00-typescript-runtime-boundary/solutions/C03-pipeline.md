# C03 — Pipeline (sample answer)

1. **Type-check (`--noEmit`):** Parser produces AST; checker verifies `greet` calls use `string` and return type is satisfied; no `.js` written.
2. **Emit:** Same checking (unless overridden); emitter writes JS with annotations removed; `function greet(name) { return \`Hello ${name}\`; }` (template handling depends on `target`).
3. **Run:** Engine executes the function; host `console.log` prints the string.

Checker proves local type consistency. Runtime executes values. Types erased from emit do not reappear in the engine.
