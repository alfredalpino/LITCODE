# Solution

```js
const dog = Object.create(animal);
console.log(dog.speak());
```

Prefer `Object.setPrototypeOf` / `Object.create` over `__proto__`.
