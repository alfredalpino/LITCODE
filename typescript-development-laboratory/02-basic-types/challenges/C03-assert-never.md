# C03 — assertNever

Implement:

```ts
function assertNever(value: never): never {
  // throw with a useful message
}
```

Use it in a `switch` on:

```ts
type Status = "idle" | "loading" | "done";
```

Then add a fourth status in the type only and observe the compile error.

Hints: [`../solutions/C03-hints.md`](../solutions/C03-hints.md)
