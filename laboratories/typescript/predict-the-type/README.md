# Predict the Type

Write the type **and why** before verifying with the IDE / `tsc`.

---

## P001 — Basic conditional

```ts
const value = Math.random() > 0.5 ? "hello" : 42;
```

**Your answer:**

- Type:
- Why:

Reveal: [`solutions/P001.md`](./solutions/P001.md)

---

## P002 — const object

```ts
const user = { id: 1, name: "Ubaid" };
```

**Your answer:**

- Type of `user`:
- Type of `user.id`:
- If `as const`?

Reveal: [`solutions/P002.md`](./solutions/P002.md)

---

## P003 — empty array

```ts
const xs = [];
xs.push(1);
```

**Your answer:** (careful under strict / noImplicitAny)

Reveal: [`solutions/P003.md`](./solutions/P003.md)

Add new cards as you study. Aim for volume with honest prediction.
