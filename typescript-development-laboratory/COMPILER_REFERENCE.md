# Compiler Reference

How to think about the TypeScript compiler for this laboratory.

**Important:** Pipeline stage names and internal architecture are **implementation details**. They can change between TypeScript versions (including ongoing work such as native ports). Treat the diagram as a useful mental model, not eternal law.

Prefer observable behavior:

- diagnostics (errors/warnings)
- emit output
- declaration output
- source maps

---

## Mental model (simplified)

```text
TypeScript / JavaScript source
        │
        ▼
     Parser  →  AST
        │
        ▼
     Binder  →  symbols / scopes   (implementation detail)
        │
        ▼
  Type checker  →  diagnostics
        │
        ▼
   Transforms  →  downleveling, etc.  (depends on target/module)
        │
        ▼
     Emitter  →  .js / .d.ts / .map
```

For learning:

```text
Source
  → Type checking (may fail without emit if noEmit / errors)
  → JavaScript emission (type erasure of type-only syntax)
  → Runtime (engine + host)
```

---

## Two jobs people conflate

| Job | Tooling | Question |
|---|---|---|
| **Check** | `tsc --noEmit`, IDE checker | Is this program well-typed under these options? |
| **Emit** | `tsc` with emit enabled, Babel, esbuild, swc, … | What JS (and declarations) do we produce? |

You can type-check with `tsc` and emit with a bundler. You can emit without caring about types (dangerous). This lab defaults to **strict check** + deliberate emit experiments.

---

## Common commands in this repo

```bash
# Strict typecheck (no JS output)
npx tsc --noEmit -p tsconfig.json

# Emit JS + .d.ts + source maps → dist/
npx tsc -p tsconfig.emit.json

# Run TS directly in Node-ish workflow (transpile-on-the-fly)
npx tsx path/to/file.ts
```

`tsx` is convenient for **running**. It is not a substitute for understanding `tsc` diagnostics and emit.

---

## What gets erased vs what may remain

### Usually erased (type-space)

- type annotations
- interfaces
- type aliases
- non-const enum *types* as types
- generic parameter lists
- `import type` / type-only exports (elision rules depend on flags)
- overload signatures (implementation remains)

### May remain / have runtime presence (depending on feature + config)

- classes (as JS classes / constructor functions per target)
- enums (often emit objects; `const enum` inlining is special)
- namespaces (can emit IIFEs / objects in classic emit modes)
- decorators / metadata (**experimental / stage-dependent**; config matters)
- emit helpers (`__extends`, etc.) depending on target and `importHelpers`

Always **inspect emit** when unsure.

---

## Key `compilerOptions` you will master (later modules)

Baseline in this lab: `"strict": true`.

| Option | Learning question |
|---|---|
| `target` | Which JS syntax must be downleveled? |
| `module` / `moduleResolution` | How are imports rewritten / resolved? |
| `lib` | Which built-in typings exist? |
| `strict*` family | Which soundness knobs are on? |
| `noUncheckedIndexedAccess` | Are index reads possibly undefined? |
| `exactOptionalPropertyTypes` | Distinguishes missing vs `undefined`? |
| `noEmit` / `emitDeclarationOnly` | Check vs emit roles |
| `declaration` / `sourceMap` | Library & debug artifacts |
| `paths` / `baseUrl` | Compile-time path mapping ≠ runtime resolution unless mirrored |
| `skipLibCheck` | Trade-off: speed vs checking `.d.ts` |

Module `40-tsconfig` will break programs with each important flag.

---

## Diagnostics workflow (how seniors debug types)

1. Read the **primary** error — what types were expected vs actual?
2. Ask where each type originated (annotation, inference, generic default, lib DOM, etc.).
3. Minimize: smallest snippet that still errors.
4. Fix the **model** (types or code), not the symptom (`as` / `any`).
5. Re-check related call sites.

---

## Compiler API (optional later)

TypeScript exposes a programmatic API for creating programs, getting diagnostics, and transforming ASTs. Useful for tooling. Not required for early modules. When used, label version and treat internals as unstable.

---

## Accuracy rule

Never invent compiler behavior. If unsure:

1. Write a minimal file
2. Run `tsc`
3. Inspect emit
4. Record the fact in `TYPESCRIPT_FACTS.md` / `TYPE_SYSTEM_FACTS.md`
