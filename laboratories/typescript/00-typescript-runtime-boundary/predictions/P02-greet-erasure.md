# P02 — Greet erasure

**Do not compile until you answer.**

```ts
function greet(name: string): string {
  return `Hello ${name}`;
}
console.log(greet("Ubaid"));
```

## Predict

1. Runtime output?
2. Which of these appear in emitted JS?  
   - `function greet`  
   - `: string`  
   - `name` parameter  
   - return type annotation  
3. If someone edits the `.js` to call `greet(42)`, what happens at runtime?
4. Would `tsc` allow `greet(42)` in the `.ts` file under strict checking?

## After emit

Paste the emitted function (or summarize) and mark each prediction correct/incorrect.
