# Solution

```js
function once(fn) {
  let called = false;
  return function wrapped(...args) {
    if (called) return;
    called = true;
    return fn(...args);
  };
}
```
