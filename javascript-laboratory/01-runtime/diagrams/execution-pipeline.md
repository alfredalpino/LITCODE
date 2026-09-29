# Execution pipeline (conceptual)

```text
┌──────────────────┐
│  Source text     │  characters in a .js file
└────────┬─────────┘
         │  lex + parse
         ▼
┌──────────────────┐
│  AST             │  structure (engine-internal)
└────────┬─────────┘
         │  generate bytecode / IR   ← ENGINE DETAIL
         ▼
┌──────────────────┐
│  Interpreter     │  run quickly, collect type feedback ← ENGINE DETAIL
└────────┬─────────┘
         │  hot code may be JIT-compiled ← ENGINE DETAIL
         ▼
┌──────────────────┐
│  Evaluation      │  ECMAScript semantics (language truth)
│  effects         │  + host API side effects
└────────┬─────────┘
         ▼
┌──────────────────┐
│  Host            │  stdout, files, network, DOM, timers…
└──────────────────┘
```

## Call stack (sync snapshot)

```text
┌─────────────────────┐
│ beta                │  ← top (running)
├─────────────────────┤
│ alpha               │
├─────────────────────┤
│ (script top-level)  │
└─────────────────────┘
```

## Language vs host vs engine

```text
┌─────────────────────────────────────────┐
│                 HOST                    │
│  (Node.js / Browser / Deno / …)         │
│  ┌───────────────────────────────────┐  │
│  │            ENGINE                 │  │
│  │  implements ECMAScript            │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │   your program’s meaning    │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
│  + host APIs (fs, document, console…)   │
└─────────────────────────────────────────┘
```
