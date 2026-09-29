# Will It Compile?

For each snippet: **YES** or **NO**, then **why**. Only then verify with `tsc`.

---

## W001

```ts
const x: "on" | "off" = "on";
let y = "on";
const z: "on" | "off" = y;
```

Answer after attempt: [`solutions/W001.md`](./solutions/W001.md)

---

## W002

```ts
type A = { x: number };
const a: A = { x: 1, y: 2 };
```

→ [`solutions/W002.md`](./solutions/W002.md)

---

## W003

```ts
function f(x: unknown) {
  return x.toFixed(2);
}
```

→ [`solutions/W003.md`](./solutions/W003.md)
