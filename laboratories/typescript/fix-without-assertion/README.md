# Fix Without Assertion

Rules for these drills (initially):

```text
Forbidden: as, !, any
Allowed: narrowing, better types, generics, guards, API redesign
```

---

## F001 — Widened status

See [`../03-type-inference/challenges/broken/02-needs-literal.ts`](../03-type-inference/challenges/broken/02-needs-literal.ts)

---

## F002 — Unknown JSON field

```ts
function readName(data: unknown): string {
  // return data.name; // forbidden patterns to "make it compile"
  // your fix here
  throw new Error("implement");
}
```

Put your solution in `attempts/F002.ts` (create as needed).  
Sample: [`solutions/F002.md`](./solutions/F002.md)
