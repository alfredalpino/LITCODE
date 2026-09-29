# Solution

Use `let i` in the loop, or bind per iteration:

```js
handlers.push((function (n) {
  return function () { console.log(n); };
})(i));
```
