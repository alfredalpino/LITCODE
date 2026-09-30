# Solution — broken log

**Do not read until you tried.**

The bug was a typo:

```js
console.lg("environment ok");
```

should be:

```js
console.log("environment ok");
```

### Why this matters

The failure mode is a **runtime** exception (`TypeError`: `console.lg is not a function`), not a parse error — the program parsed fine; property lookup failed.

### Why? (deeper)

`console` is an object (host-provided). `.lg` looks up a property that does not exist → `undefined`. Calling `undefined` as a function throws.
