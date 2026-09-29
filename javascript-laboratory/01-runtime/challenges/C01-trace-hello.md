# C01 — Trace `Hello` end-to-end

**Difficulty:** ★★★☆☆  
**Type:** explain

## Problem

Write a step-by-step trace (8–15 steps) of what happens when Node executes:

```js
console.log("Hello");
```

Your trace must mention at least:

- source text
- parsing
- evaluation / call
- host side effect (stdout)

Label any engine-only steps as **(engine detail)**.

## Constraints

- No claiming JIT is required for this program to work
- Distinguish language vs host

## Hints

<details>
<summary>Hint 1 — conceptual</summary>

Start from the file bytes/characters, end at terminal text.

</details>

<details>
<summary>Hint 2 — directional</summary>

Parse must succeed before evaluation. `console.log` is a call expression.

</details>

<details>
<summary>Hint 3 — implementation</summary>

Lookup `console` on the global environment → get `log` → [[Call]] → host write.

</details>

## Solution

[`../solutions/C01-trace-hello.md`](../solutions/C01-trace-hello.md)
