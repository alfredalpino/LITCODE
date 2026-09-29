# Solution

Never mutate DEFAULTS. Shallow-merge carefully; clone nested objects when needed:

```js
return {
  ...DEFAULTS,
  ...over,
  nested: { ...DEFAULTS.nested, ...(over.nested || {}) },
};
```
