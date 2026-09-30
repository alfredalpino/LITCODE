# Cheat Sheet

Fast reference. Grows as you complete modules. **Do not** use this to skip prediction exercises.

---

## Environment commands

```bash
node --version
node path/to/file.js
node --check path/to/file.js   # syntax check without running
node --print "1 + 1"           # evaluate expression (Node)
```

Inspect the call stack in a debugger: place `debugger;` and run with an inspector, or use your editor’s debugger.

---

## Language vs host vs engine (permanent)

```text
Your .js source
      │
      ▼
 ECMAScript semantics  ←── language rules (spec)
      │
      ▼
    Engine             ←── V8 / JSC / SpiderMonkey (implementation)
      │
      ▼
 Host environment      ←── Browser / Node / Deno + host APIs
```

| Need | Example |
|---|---|
| Language | `===`, closures, `class`, promises |
| Host | `fs`, `document`, `fetch`, often `console`, `setTimeout` |
| Engine detail | hidden classes, JIT tiers (not language guarantees) |

---

## Execution pipeline (conceptual)

```text
Source text → Lex/Parse → AST → Bytecode/IR → Interpret / JIT → Run
```

- **Parse error:** fails before evaluation
- **Runtime error:** happens during evaluation

---

## Sync execution & call stack (intro)

```text
main / script
  └─ function A
       └─ function B   ← top of stack (currently running)
```

- Enter function → push frame
- Return / throw → pop frame
- Sync code runs until the stack unwinds for that turn

---

## Quick facts (runtime module)

| Fact | Reminder |
|---|---|
| `console` | Host API |
| Syntax error | Parse-time failure |
| Nested calls | Deeper stack |
| `setTimeout` | Host scheduling (later modules) |
| Modules vs scripts | Different loading/goals (module `19`) |

---

## Prediction protocol (always)

```text
1. DO NOT RUN YET
2. Write predicted output
3. Write why (mechanism)
4. Run
5. Diff prediction vs result
6. Explain discrepancy
7. Ask “why?” one more level deep
```

---

## Difficulty stars

★ Beginner · ★★ Developing · ★★★ Intermediate · ★★★★ Advanced · ★★★★★ Expert

---

## Growing sections

As modules land, this file will add:

- Equality & coercion tables
- `this` precedence
- Scope / TDZ rules
- Promise / event-loop ordering
- Array method complexity notes
- Prototype lookup algorithm (simplified)

---

## Related files

- [`GLOSSARY.md`](./GLOSSARY.md) — definitions
- [`ADVANCED_JAVASCRIPT_FACTS.md`](./ADVANCED_JAVASCRIPT_FACTS.md) — deep facts
- [`PROGRESS.md`](./PROGRESS.md) — your tracker
