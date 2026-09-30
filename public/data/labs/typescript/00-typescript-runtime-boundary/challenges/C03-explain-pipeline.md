# C03 — Explain the pipeline

Explain end-to-end what happens for:

```ts
function greet(name: string): string {
  return `Hello ${name}`;
}
console.log(greet("Ubaid"));
```

when you:

1. type-check with `tsc --noEmit`
2. emit with `tsc`
3. run the emitted file with `node`

Write:

- What the parser sees (conceptually)
- What the checker proves
- What the emitter removes
- What the JS engine executes
- What a host (`console`) does

Max one page. No need for V8 internals.

Compare later: [`../solutions/C03-pipeline.md`](../solutions/C03-pipeline.md)
