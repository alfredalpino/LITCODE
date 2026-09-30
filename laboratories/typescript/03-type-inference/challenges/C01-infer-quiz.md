# C01 — Infer quiz

For each, write the inferred type (or error). Then verify in a scratch file / IDE.

## 1

```ts
const a = null;
```

## 2

```ts
let b = null;
```

(Under strict — think carefully; may need annotation to reassign usefully.)

## 3

```ts
const c = [0, 1, null];
```

## 4

```ts
const d = { ok: true as const, value: 1 };
```

## 5

```ts
async function load() {
  return { id: "1" };
}
type R = ReturnType<typeof load>;
```

What is `R`? What about `Awaited<R>`?

Answers: [`../solutions/C01-infer-quiz.md`](../solutions/C01-infer-quiz.md)
