# P01 — const vs let

Predict the TypeScript types:

```ts
const x = "hello";
let y = "hello";
const arr = [1, 2, 3];
const mixed = [1, "two", 3];
```

| Binding | Predicted type |
|---|---|
| `x` | |
| `y` | |
| `arr` | |
| `mixed` | |

Why does `const` matter for `x` but not “freeze” object elements inside arrays unless `as const`?
