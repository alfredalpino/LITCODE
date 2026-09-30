# Solution — counter

```js
function makeCounter() {
  let n = 0;
  return {
    inc() {
      n += 1;
      return n;
    },
  };
}
```

Each call creates a new binding `n` closed over by the returned methods (preview of closures — module 08).
