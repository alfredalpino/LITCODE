# Solution

```js
function compose(f, g) {
  return (x) => f(g(x));
}
```
