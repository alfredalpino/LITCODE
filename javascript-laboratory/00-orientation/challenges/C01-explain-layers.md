# C01 — Explain the three layers

**Difficulty:** ★★☆☆☆  
**Type:** explain

## Problem

In your own words (written in `PROGRESS.md` session notes), explain the difference between:

1. **ECMAScript / JavaScript language**
2. **JavaScript engine**
3. **Host environment**

Give **one concrete example** of something that belongs in each layer.

## Constraints

- No copy-pasting the README
- Must include at least one example that is easy to confuse (e.g., `console`, `setTimeout`, `require`)

## Success criteria

- [ ] Three layers defined without circular definitions
- [ ] One example each
- [ ] One “easy to confuse” item classified correctly with justification

## Progressive hints

<details>
<summary>Hint 1 — conceptual</summary>

Ask: “If I moved this program to a different host, what would still work?”

</details>

<details>
<summary>Hint 2 — directional</summary>

Language: operators, functions, objects, promises…  
Engine: V8 implementing those rules…  
Host: Node providing `process`, browser providing `document`…

</details>

<details>
<summary>Hint 3 — implementation</summary>

Classify: `1 + 1`, `process.versions`, `typeof`, `fs.readFile`, hidden classes.

</details>

## Solution

Only after writing your answer: [`../solutions/C01-explain-layers.md`](../solutions/C01-explain-layers.md)
