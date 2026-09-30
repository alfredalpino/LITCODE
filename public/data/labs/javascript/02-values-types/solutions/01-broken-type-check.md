# Solution — broken type check

Prefer:

```js
function isNullish(v) {
  return v === null || v === undefined;
}
// or: return v == null; // intentional loose nullish check
```

Falsy checks conflate `0`, `""`, `false` with missing values.
