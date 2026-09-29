# P04 — JSON assertion

```ts
const user = JSON.parse(payload) as User;
```

where `payload` is `'{"id":1,"name":null}'` and `User` expects `{ id: string; name: string }`.

## Predict

1. Does this type-check with the assertion?
2. What is `typeof user.id` at runtime?
3. What is `user.name` at runtime?
4. Did TypeScript protect you? If not, what would?

## After running

Explain the trust boundary in your own words.
