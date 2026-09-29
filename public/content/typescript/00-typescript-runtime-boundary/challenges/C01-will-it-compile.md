# C01 — Will it compile?

For each snippet, answer **YES** or **NO**, then **why** (compile-time reasoning).  
Only afterward put the snippet in a temp file and run `npx tsc --noEmit`.

---

## Snippet A

```ts
const n: number = "1";
```

YES / NO — Why?

---

## Snippet B

```ts
interface Animal { name: string }
const a: Animal = { name: "x", age: 1 };
```

YES / NO — Why? (Hint: excess property checks)

---

## Snippet C

```ts
interface Animal { name: string }
const wider = { name: "x", age: 1 };
const a: Animal = wider;
```

YES / NO — Why?

---

## Snippet D

```ts
function f(x: string) {
  return x.toUpperCase();
}
// @ts-ignore — pretend we call from JS
f(42);
```

Does **TypeScript** accept the call without `@ts-ignore`? YES / NO — Why?  
What happens **at runtime** if JS calls `f(42)`? 

---

Hints → [`../solutions/C01-hints.md`](../solutions/C01-hints.md)  
Answers → [`../solutions/C01-answers.md`](../solutions/C01-answers.md)
