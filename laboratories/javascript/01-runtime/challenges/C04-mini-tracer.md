# C04 — Mini enter/leave tracer

**Difficulty:** ★★★☆☆  
**Type:** implement (educational)

## Problem

Create `01-runtime/experiments/15-my-tracer.js` that defines:

```js
function trace(name, fn) {
  // log entering name
  // call fn
  // log leaving name
  // return fn's return value
}
```

Use it to wrap nested functions so logs show nesting visually with indentation based on depth.

## Constraints

- No external libraries
- Must handle return values
- Educational only — not a production profiler

## Success criteria

- [ ] Nested calls show increasing indentation on enter and decreasing on leave
- [ ] Returned values still work

## Hints

<details>
<summary>Hint 1 — conceptual</summary>

Track depth with a module-level counter.

</details>

<details>
<summary>Hint 2 — directional</summary>

Increment before call, decrement in `finally`.

</details>

<details>
<summary>Hint 3 — implementation</summary>

```js
let depth = 0;
function trace(name, fn) {
  return function traced(...args) {
    console.log(`${"  ".repeat(depth)}→ ${name}`);
    depth++;
    try {
      return fn.apply(this, args);
    } finally {
      depth--;
      console.log(`${"  ".repeat(depth)}← ${name}`);
    }
  };
}
```

</details>

## Solution sketch

[`../solutions/C04-mini-tracer.md`](../solutions/C04-mini-tracer.md)
