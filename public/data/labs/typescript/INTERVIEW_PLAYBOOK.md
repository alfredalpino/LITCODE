# Interview Playbook

Startup software-engineering interviews reward **clear models**, not trivia. Use this playbook to practice explanations and debugging aloud.

Format for each prompt:

```text
Answer in 60–90 seconds
Then give a 10-line code illustration
Then state compile-time vs runtime implications
```

Do not memorize scripts. Practice until you can regenerate the answer from first principles.

---

## Fundamentals

1. What is TypeScript, precisely?
2. TypeScript vs JavaScript — what is different at compile time vs runtime?
3. What is type erasure? Give an example of something erased and something that remains.
4. Does TypeScript change program behavior based on types alone? Why does that matter?
5. What is gradual typing in practice on a TS codebase?

---

## Type system

6. Structural vs nominal typing — example where structural typing surprises people.
7. `unknown` vs `any` — when do you use each?
8. What is `never`? Show an exhaustive `switch`.
9. Union vs intersection — set intuition + example.
10. What does `keyof T` produce? Combine with `T[K]`.
11. `typeof` as a value operator vs `typeof` in type positions.
12. What are excess property checks? When do they not apply?

---

## Generics

13. Why generics instead of `any`?
14. Explain `K extends keyof T` in `getProperty`.
15. What is generic inference? When do you annotate explicit type arguments?
16. What is a generic constraint? Give a failing call.
17. (Advanced) Sketch variance concerns for function parameters.

---

## Advanced types

18. Explain a mapped type by reimplementing `Partial<T>`.
19. Explain a conditional type with a simple example.
20. What does `infer` do? Sketch `ReturnType`.
21. What are distributive conditional types? How do you stop distribution?
22. Template literal types — one production use case.
23. `satisfies` vs annotation vs `as`.

---

## Practical development

24. Walk through a good `tsconfig` baseline for a new Node service.
25. Why isn't strict mode enough for API security?
26. How do you type `JSON.parse` results safely?
27. Model a request lifecycle: idle/loading/success/error with types.
28. When are overloads better than a union parameter? When worse?
29. `private` vs `#private`.
30. Enums vs `as const` objects — trade-offs.

---

## Architecture

31. Domain type vs DTO vs database row — why separate?
32. Where do you put runtime validation in a layered backend?
33. How do typed API contracts reduce frontend/backend drift?
34. What is a Result type? When prefer it over exceptions?
35. How do you keep generics from becoming unreadable?

---

## Debugging drills

For each, explain the error **before** fixing:

36. Broken generic constraint.
37. Incorrect union narrowing.
38. Promise generic mismatch.
39. `this` typing bug in a callback.
40. Declaration file mismatch with runtime module shape.

Use modules `62-debugging` and `70-code-review-lab` when available; until then, invent minimal broken snippets and diagnose them.

---

## Behavioral / judgment prompts

41. Tell me about a time types prevented a bug (or a time types gave false confidence).
42. How do you review a PR that adds many `as` assertions?
43. How do you migrate a JS module to TS without stalling delivery?

---

## Scoring rubric (self)

| Score | Meaning |
|---|---|
| 1 | Buzzwords only |
| 2 | Correct intuition, weak mechanism |
| 3 | Mechanism + small example |
| 4 | Compile-time/runtime split + trade-offs |
| 5 | Production judgment + clear limits of types |

Aim for **4+** on fundamentals before racing into conditional-type puzzles.
