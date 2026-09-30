#!/usr/bin/env node
/**
 * Phase 5 — fill JS lab modules 02–12 to ready laboratory standard.
 * Idempotent overwrite of scaffold READMEs + pedagogy folders.
 * Run from repo root or javascript-laboratory/: node scripts/fill-phase5-modules.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(__dirname, "..");

function write(rel, text) {
  const abs = path.join(LAB, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, text.trimStart().replace(/^\n/, "") + (text.endsWith("\n") ? "" : "\n"));
}

function moduleKit(id, slug, {
  title,
  difficulty,
  prereq,
  outcomes,
  lessons,
  experiments,
  predictions,
  broken,
  challenges,
  solutions,
  review,
  knowledge,
  workOrder,
  nextModule,
}) {
  const dir = `${id}-${slug}`;
  const readme = `# ${id} — ${title}

**Difficulty baseline:** ${difficulty}  
**Prerequisites:** [\`${prereq}\`](../${prereq}/)  
**Core loop:** Predict → Run → Break → Explain

---

## Learning outcomes

After this lab you can:

${outcomes.map((o, i) => `${i + 1}. ${o}`).join("\n")}

---

${lessons}

---

## Deliberate bugs

| File | Task |
|---|---|
${broken.map((b) => `| \`challenges/broken/${b.file}\` | ${b.task} |`).join("\n")}

---

## Challenges

| ID | File | Difficulty |
|---|---|---|
${challenges.map((c) => `| ${c.id} | [\`challenges/${c.file}\`](./challenges/${c.file}) | ${c.diff} |`).join("\n")}

---

## Developer Knowledge boxes

${knowledge}

---

## How to work this module (order)

${workOrder}

**Do not rush.** Depth beats speed.

---

## When you are done

1. Update [\`PROGRESS.md\`](../PROGRESS.md) — mark \`${dir}\`
2. Complete \`review.md\` Day 1 prompts cold
3. Proceed to [\`${nextModule}/README.md\`](../${nextModule}/README.md)
`;

  write(`${dir}/README.md`, readme);

  for (const [name, body] of Object.entries(experiments)) {
    write(`${dir}/experiments/${name}`, body);
  }
  for (const [name, body] of Object.entries(predictions)) {
    write(`${dir}/predictions/${name}`, body);
  }
  for (const b of broken) {
    write(`${dir}/challenges/broken/${b.file}`, b.code);
  }
  for (const c of challenges) {
    write(`${dir}/challenges/${c.file}`, c.body);
  }
  for (const [name, body] of Object.entries(solutions)) {
    write(`${dir}/solutions/${name}`, body);
  }
  write(`${dir}/review.md`, review);
}

// ─── shared helpers for prediction cards ───────────────────────────────────
function pred(id, title, diff, file, code, prompts) {
  return `# ${id} — ${title}

**Difficulty:** ${diff}  
**File:** \`${file}\`

## DO NOT RUN YET

\`\`\`js
${code.trim()}
\`\`\`

### 1. Predicted output

\`\`\`text

\`\`\`

### 2. Reasoning

${prompts}

\`\`\`text

\`\`\`

### 3. Run

\`\`\`bash
node ${file.replace("experiments/", "") /* fixed below */}
\`\`\`

### 4–7. Actual / discrepancy / deeper why / what-if

\`\`\`text

\`\`\`
`.replace(
    /node .+\n/,
    (m) => m // placeholder — fixed per call
  );
}

function makePred(modPath, id, title, diff, expFile, code, reasoningPrompt, whatIf) {
  return `# ${id} — ${title}

**Difficulty:** ${diff}  
**File:** \`experiments/${expFile}\`

## DO NOT RUN YET

\`\`\`js
${code.trim()}
\`\`\`

### 1. Predicted output

\`\`\`text

\`\`\`

### 2. Reasoning

${reasoningPrompt}

\`\`\`text

\`\`\`

### 3. Run

\`\`\`bash
node ${modPath}/experiments/${expFile}
\`\`\`

### 4–7. Actual / discrepancy / deeper why / what-if

${whatIf}

\`\`\`text

\`\`\`
`;
}

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 02 — Values & Types
// ═══════════════════════════════════════════════════════════════════════════
moduleKit("02", "values-types", {
  title: "Values & Types",
  difficulty: "★★☆☆☆ (peaks at ★★★)",
  prereq: "01-runtime",
  outcomes: [
    "List JavaScript’s primitive types and distinguish them from objects",
    "Predict `typeof` results — including the notorious `typeof null`",
    "Explain value equality (`===`) vs SameValueZero / `Object.is`",
    "Reason about identity for objects vs copy-by-value for primitives",
    "Spot where coercion begins (preview for operators lab)",
  ],
  lessons: `# Lesson 1 — Values, not “types of variables”

## Concise explanation

JavaScript values have types. Bindings hold values. Talking about “the type of a variable” is sloppy — the binding can be reassigned a different value later (\`let\`).

## Mechanism

Every value is either a **primitive** or an **object** (including arrays, functions, dates, …).

| Primitive | Example |
|---|---|
| Undefined | \`undefined\` |
| Null | \`null\` |
| Boolean | \`true\` / \`false\` |
| Number | \`42\`, \`NaN\`, \`Infinity\` |
| BigInt | \`10n\` |
| String | \`"hi"\` |
| Symbol | \`Symbol("x")\` |

Everything else is an object.

## Experiment

\`experiments/01-typeof-primitives.js\` + [\`predictions/P01-typeof.md\`](./predictions/P01-typeof.md)

---

# Lesson 2 — \`typeof null\` is a historical bug

## Concise explanation

\`typeof null === "object"\`. That is wrong conceptually and preserved for compatibility.

## Experiment

\`experiments/02-typeof-null.js\`

### Common Misconception

“\`null\` is an object.” — No. \`null\` is a primitive. \`typeof\` lies.

### Historical Context

Early engines tagged values; the null tag collided with the object tag. Fixing it would break the web.

---

# Lesson 3 — Equality: \`===\`, \`Object.is\`, and identity

## Concise explanation

- \`===\` — Strict Equality Comparison (no coercion; \`NaN !== NaN\`; \`+0 === -0\`)
- \`Object.is\` — SameValue (distinguishes \`+0\`/\`-0\`; \`Object.is(NaN, NaN)\` is true)
- Objects compare by **reference** (identity), not deep structure

## Experiments

| File | Focus |
|---|---|
| \`experiments/03-equality.js\` | \`===\` vs \`Object.is\` |
| \`experiments/04-identity.js\` | Two \`{}\` are not the same object |

→ [\`predictions/P02-equality.md\`](./predictions/P02-equality.md)

### Specification Insight

ECMAScript defines several equality algorithms (IsStrictlyEqual, SameValue, SameValueZero used by \`Map\`/\`Set\`). Memorizing slogans is weaker than knowing which algorithm an API uses.

---

# Lesson 4 — Primitives are not mutable; wrappers exist

## Concise explanation

You cannot mutate a string’s characters in place. Methods return new strings. Temporary Number/String/Boolean **wrapper objects** exist for method dispatch — then usually disappear.

## Experiment

\`experiments/05-immutable-primitives.js\`

### Weird JavaScript

\`\`\`js
const s = "hi";
s.foo = 1; // silent fail in non-strict assignment to primitive property; strict throws in some paths
\`\`\`

Prefer thinking: primitives have no own mutable fields.

---

# Lesson 5 — Coercion teaser

## Concise explanation

Operators and APIs often convert values (ToNumber, ToString, ToBoolean). Full coercion lab is \`04-operators\`. Here you only observe that \`"5" - 2\` becomes numeric.

## Experiment

\`experiments/06-coercion-teaser.js\` + [\`predictions/P03-coercion-teaser.md\`](./predictions/P03-coercion-teaser.md)
`,
  experiments: {
    "01-typeof-primitives.js": `// 02-values-types / 01-typeof-primitives.js
// PREDICT: predictions/P01-typeof.md
// Run: node 02-values-types/experiments/01-typeof-primitives.js

"use strict";

const samples = [
  undefined,
  null,
  true,
  0,
  NaN,
  10n,
  "lab",
  Symbol("s"),
  {},
  [],
  function f() {},
];

for (const v of samples) {
  console.log(String(v), "→", typeof v);
}
`,
    "02-typeof-null.js": `// 02-values-types / 02-typeof-null.js
"use strict";

console.log("typeof null:", typeof null);
console.log("null === null:", null === null);
console.log("null === undefined:", null === undefined);
console.log("Object.prototype.toString.call(null):", Object.prototype.toString.call(null));
`,
    "03-equality.js": `// 02-values-types / 03-equality.js
// PREDICT: predictions/P02-equality.md
"use strict";

console.log("NaN === NaN", NaN === NaN);
console.log("Object.is(NaN, NaN)", Object.is(NaN, NaN));
console.log("+0 === -0", +0 === -0);
console.log("Object.is(+0, -0)", Object.is(+0, -0));
console.log('"5" === 5', "5" === 5);
console.log('"5" == 5', "5" == 5); // loose — preview only; prefer ===
`,
    "04-identity.js": `// 02-values-types / 04-identity.js
"use strict";

const a = { x: 1 };
const b = { x: 1 };
const c = a;

console.log("a === b", a === b);
console.log("a === c", a === c);
c.x = 99;
console.log("a.x after mutating c", a.x);
`,
    "05-immutable-primitives.js": `// 02-values-types / 05-immutable-primitives.js
"use strict";

const s = "loop";
const upper = s.toUpperCase();
console.log("original", s);
console.log("upper", upper);
console.log("s === upper", s === upper);

const n = 7;
console.log((8).toString(2)); // wrapper momentarily for method call
console.log(typeof n);
`,
    "06-coercion-teaser.js": `// 02-values-types / 06-coercion-teaser.js
// PREDICT: predictions/P03-coercion-teaser.md
"use strict";

console.log('"5" - 2 →', "5" - 2);
console.log('"5" + 2 →', "5" + 2);
console.log("Boolean('')", Boolean(""));
console.log("Boolean('0')", Boolean("0"));
console.log("Number('  12  ')", Number("  12  "));
console.log("Number('12px')", Number("12px"));
`,
  },
  predictions: {
    "P01-typeof.md": makePred(
      "02-values-types",
      "P01",
      "typeof primitives",
      "★★☆☆☆",
      "01-typeof-primitives.js",
      `typeof undefined
typeof null
typeof []
typeof function f() {}`,
      "List each `typeof` result you expect. Which ones surprise you?",
      "What if someone claims “arrays are a separate type in JavaScript”?"
    ),
    "P02-equality.md": makePred(
      "02-values-types",
      "P02",
      "=== vs Object.is",
      "★★★☆☆",
      "03-equality.js",
      `NaN === NaN
Object.is(NaN, NaN)
+0 === -0
Object.is(+0, -0)`,
      "Name which equality algorithm each expression uses.",
      "When would you prefer `Object.is` over `===`?"
    ),
    "P03-coercion-teaser.md": makePred(
      "02-values-types",
      "P03",
      "coercion teaser",
      "★★☆☆☆",
      "06-coercion-teaser.js",
      `"5" - 2
"5" + 2
Boolean("0")`,
      "Why do `+` and `-` disagree about strings?",
      "Predict `Number('')` and `Number(' ')` without running first — then verify."
    ),
  },
  broken: [
    {
      file: "01-broken-type-check.js",
      task: "Fix so `isNullish` returns true only for `null` and `undefined`",
      code: `// CONTRACT: isNullish(null) and isNullish(undefined) → true
// isNullish(0), isNullish(""), isNullish(false) → false
// Currently broken.
// Run: node 02-values-types/challenges/broken/01-broken-type-check.js

"use strict";

function isNullish(v) {
  // Bug: treats all falsy values as nullish
  if (!v) return true;
  return false;
}

const cases = [null, undefined, 0, "", false, "ok"];
for (const c of cases) {
  console.log(String(c), "→", isNullish(c));
}
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-classify-values.md",
      diff: "★★★",
      body: `# C01 — Classify values

**Difficulty:** ★★★☆☆

For each value, write: primitive or object? \`typeof\` result? equal to itself under \`===\`?

1. \`NaN\`
2. \`document\` (if in browser) or \`process\` (in Node) — host or language?
3. \`[]\`
4. \`Object.create(null)\`
5. \`Symbol.for("x")\` vs \`Symbol("x")\` — same?

Do not open solutions until you finish.
`,
    },
  ],
  solutions: {
    "01-broken-type-check.md": `# Solution — broken type check

Prefer:

\`\`\`js
function isNullish(v) {
  return v === null || v === undefined;
}
// or: return v == null; // intentional loose nullish check
\`\`\`

Falsy checks conflate \`0\`, \`""\`, \`false\` with missing values.
`,
    "C01-classify-values.md": `# Solution notes — C01

1. \`NaN\` — number primitive; \`typeof "number"\`; \`NaN !== NaN\`
2. Host-provided object (usually)
3. Object (array); \`typeof "object"\`
4. Object with null prototype
5. \`Symbol.for\` reuses; \`Symbol("x")\` always unique
`,
  },
  review: `# Spaced review — 02 Values & Types

Active recall. Do not reread the whole README first.

## Day 1

1. List all primitive types from memory.
2. Predict \`typeof null\` and explain why.
3. When is \`Object.is\` different from \`===\`?

## Day 3

1. Two object literals with the same keys — \`===\`?
2. Why is “type of a variable” imprecise language?

## Day 7 / 14 / 30

1. Teach SameValue vs strict equality in ≤8 sentences.
2. Invent three coercion surprises; verify experimentally.
`,
  knowledge: `### Deep Fact

\`typeof\` is a unary operator with special-case behavior — not a perfect type oracle.

### Why This Works

Separating “what value is this?” from “how does this API compare values?” prevents Map/Set/React-key class bugs later.

### Common Misconception

“\`==\` is always wrong / \`===\` always right.” Prefer \`===\` by default; know the algorithms when you reach for \`==\` or \`Object.is\`.

### Interview Insight

Expect: explain \`typeof null\`, \`NaN\` equality, and reference vs value.

### Production Insight

APIs that use SameValueZero (\`Set\`, \`Map\` keys) treat \`NaN\` as equal to itself — unlike \`===\`.
`,
  workOrder: `1. typeof experiments + P01  
2. null + equality + identity + P02  
3. immutability + coercion teaser + P03  
4. Broken challenge  
5. C01  
6. \`review.md\` Day 1`,
  nextModule: "03-variables",
});

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 03 — Variables
// ═══════════════════════════════════════════════════════════════════════════
moduleKit("03", "variables", {
  title: "Variables & Bindings",
  difficulty: "★★☆☆☆ (peaks at ★★★★)",
  prereq: "02-values-types",
  outcomes: [
    "Explain bindings vs values",
    "Predict `var` vs `let` vs `const` behavior",
    "Locate Temporal Dead Zone (TDZ) failures",
    "Describe hoisting accurately (without myth)",
    "Predict shadowing across nested scopes",
  ],
  lessons: `# Lesson 1 — Bindings hold values

## Concise explanation

A binding is a name associated with a value in an environment. Reassignment changes which value the name refers to (when allowed). Mutation can change an object’s contents without rebinding.

## Experiment

\`experiments/01-binding-vs-mutation.js\`

\`\`\`js
let x = { n: 1 };
const y = x;
x = { n: 2 }; // rebind x
// y still points at the first object
\`\`\`

---

# Lesson 2 — \`let\`, \`const\`, \`var\`

## Concise explanation

| Keyword | Scope (typical) | Rebind? | Hoist behavior |
|---|---|---|---|
| \`let\` | block | yes | TDZ until init |
| \`const\` | block | no | TDZ until init |
| \`var\` | function / script | yes | initialized \`undefined\` |

\`const\` prevents **rebinding**, not object mutation.

## Experiments

\`experiments/02-let-const-var.js\` + [\`predictions/P01-declarations.md\`](./predictions/P01-declarations.md)  
\`experiments/03-const-mutation.js\`

---

# Lesson 3 — Temporal Dead Zone

## Concise explanation

From the start of the block until initialization, a \`let\`/\`const\` binding exists but cannot be accessed — ReferenceError.

## Experiment

\`experiments/04-tdz.js\` + [\`predictions/P02-tdz.md\`](./predictions/P02-tdz.md)

### Common Misconception

“Hoisting means the variable is \`undefined\` until assigned.” — True-ish for \`var\`; **false** for \`let\`/\`const\` (TDZ).

---

# Lesson 4 — Hoisting without mythology

## Concise explanation

Declarations are processed before evaluation of the body. \`var\` bindings are created and set to \`undefined\`. \`let\`/\`const\` are created but uninitialized (TDZ). Function declarations are instantiated differently from \`let\` fn expressions.

## Experiment

\`experiments/05-hoisting.js\`

---

# Lesson 5 — Shadowing

## Concise explanation

An inner binding with the same name shadows an outer one. Lookup walks the scope chain outward.

## Experiment

\`experiments/06-shadowing.js\` + [\`predictions/P03-shadow.md\`](./predictions/P03-shadow.md)
`,
  experiments: {
    "01-binding-vs-mutation.js": `// 03-variables / 01-binding-vs-mutation.js
"use strict";

let x = { n: 1 };
const y = x;
console.log("same ref?", x === y);
x.n = 99;
console.log("y.n", y.n);
x = { n: 2 };
console.log("y.n after rebind", y.n);
console.log("x === y", x === y);
`,
    "02-let-const-var.js": `// 03-variables / 02-let-const-var.js
// PREDICT: predictions/P01-declarations.md
"use strict";

var a = 1;
let b = 2;
const c = 3;

a = 10;
b = 20;
// c = 30; // would throw — leave commented; predict why

console.log(a, b, c);

{
  var aInner = "var-block";
  let bInner = "let-block";
  console.log("inside", aInner, bInner);
}
console.log("aInner outside?", typeof aInner);
try {
  console.log(bInner);
} catch (e) {
  console.log("bInner outside →", e.name);
}
`,
    "03-const-mutation.js": `// 03-variables / 03-const-mutation.js
"use strict";

const user = { name: "ada" };
user.name = "grace";
console.log(user);

const nums = [1, 2];
nums.push(3);
console.log(nums);
`,
    "04-tdz.js": `// 03-variables / 04-tdz.js
// PREDICT: predictions/P02-tdz.md
"use strict";

console.log("var before decl", typeof hoistedVar);
var hoistedVar = "ok";

try {
  console.log(tdzLet);
} catch (e) {
  console.log("tdzLet →", e.name, e.message.split("\\n")[0]);
}
let tdzLet = "alive";
console.log("after init", tdzLet);
`,
    "05-hoisting.js": `// 03-variables / 05-hoisting.js
"use strict";

console.log("fn decl", typeof declared);
declared();

function declared() {
  console.log("declared ran");
}

console.log("expr", typeof expressed);
try {
  expressed();
} catch (e) {
  console.log("expressed() →", e.name);
}
var expressed = function () {
  console.log("expressed ran");
};
expressed();
`,
    "06-shadowing.js": `// 03-variables / 06-shadowing.js
// PREDICT: predictions/P03-shadow.md
"use strict";

const x = "outer";
function demo(x) {
  console.log("param", x);
  {
    const x = "block";
    console.log("block", x);
  }
  console.log("param again", x);
}
demo("arg");
console.log("outer", x);
`,
  },
  predictions: {
    "P01-declarations.md": makePred(
      "03-variables",
      "P01",
      "let const var",
      "★★☆☆☆",
      "02-let-const-var.js",
      `// after block: typeof aInner? typeof bInner?`,
      "Why does `var` leak from the block while `let` does not?",
      "What does `const` forbid — mutation or rebinding?"
    ),
    "P02-tdz.md": makePred(
      "03-variables",
      "P02",
      "TDZ",
      "★★★☆☆",
      "04-tdz.js",
      `console.log(tdzLet);
let tdzLet = "alive";`,
      "Is the binding “not hoisted,” or hoisted-but-uninitialized?",
      "Predict accessing `const` before init in the same block."
    ),
    "P03-shadow.md": makePred(
      "03-variables",
      "P03",
      "shadowing",
      "★★☆☆☆",
      "06-shadowing.js",
      `const x = "outer";
function demo(x) { /* nested const x */ }`,
      "How many distinct `x` bindings exist while `demo` runs?",
      "Does assigning the parameter change the outer `x`?"
    ),
  },
  broken: [
    {
      file: "01-broken-counter.js",
      task: "Fix so each call to `makeCounter().inc()` increments an independent counter",
      code: `// CONTRACT: two counters must not share state.
// Run: node 03-variables/challenges/broken/01-broken-counter.js

"use strict";

let shared = 0; // bug: shared across counters

function makeCounter() {
  return {
    inc() {
      shared += 1;
      return shared;
    },
  };
}

const a = makeCounter();
const b = makeCounter();
console.log(a.inc(), a.inc()); // expect 1 2
console.log(b.inc()); // expect 1 — currently wrong
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-tdz-story.md",
      diff: "★★★",
      body: `# C01 — TDZ story

**Difficulty:** ★★★☆☆

Write (in your notes) a 6–10 line program that throws a TDZ ReferenceError **without** using \`typeof\` on the binding before init.

Then write a sibling program that uses \`var\` and prints \`undefined\` instead.

Explain the difference using: binding creation, initialization, environment record.
`,
    },
  ],
  solutions: {
    "01-broken-counter.md": `# Solution — counter

\`\`\`js
function makeCounter() {
  let n = 0;
  return {
    inc() {
      n += 1;
      return n;
    },
  };
}
\`\`\`

Each call creates a new binding \`n\` closed over by the returned methods (preview of closures — module 08).
`,
    "C01-tdz-story.md": `# Solution sketch — C01

TDZ example: access \`x\` on the line before \`let x = 1\` in the same block.

\`var\` example: \`console.log(x); var x = 1;\` → \`undefined\`.

Mechanism: both create bindings early; only \`var\` initializes to \`undefined\` immediately.
`,
  },
  review: `# Spaced review — 03 Variables

## Day 1

1. Binding vs mutation — one example each.
2. TDZ in one sentence.
3. Does \`const\` freeze objects?

## Day 3

1. Predict a shadowing snippet you invent.
2. Function declaration vs \`var\` + function expression — hoist difference?

## Day 7 / 14 / 30

1. Teach \`var\`/\`let\`/\`const\` without saying “hoisting moves code upward.”
2. Fix a shared-state counter bug from memory.
`,
  knowledge: `### Deep Fact

\`const\` is about the binding, not deep immutability. Use \`Object.freeze\` (shallow) when you need frozen objects.

### Why This Works

Correct binding models make closures, modules, and React state updates comprehensible.

### Common Misconception

“\`let\` is not hoisted.” — The binding is created at the start of the block; access before init is TDZ.

### Interview Insight

Classic: explain TDZ; explain why \`const\` object properties can change.

### Production Insight

Prefer \`const\` by default; \`let\` when rebinding is required; avoid \`var\` in modern codebases unless maintaining legacy.
`,
  workOrder: `1. Binding vs mutation  
2. Declarations + P01 + const mutation  
3. TDZ + hoisting + P02  
4. Shadowing + P03  
5. Broken counter  
6. C01 + review`,
  nextModule: "04-operators",
});

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 04 — Operators
// ═══════════════════════════════════════════════════════════════════════════
moduleKit("04", "operators", {
  title: "Operators & Coercion",
  difficulty: "★★★☆☆ (peaks at ★★★★)",
  prereq: "03-variables",
  outcomes: [
    "Predict arithmetic and comparison results with mixed types",
    "Apply ToBoolean / ToNumber / ToString mentally for common operators",
    "Explain `+` string concat vs numeric addition",
    "Use `??`, `||`, `&&` deliberately (nullish vs falsy)",
    "Avoid accidental coercion bugs in conditionals and APIs",
  ],
  lessons: `# Lesson 1 — Operators trigger abstract operations

## Concise explanation

Most surprising JS results come from **implicit conversion** before the operator runs (ToPrimitive, ToNumber, ToString, ToBoolean).

## Experiment

\`experiments/01-plus-minus.js\` + [\`predictions/P01-plus.md\`](./predictions/P01-plus.md)

---

# Lesson 2 — ToBoolean (truthiness)

## Concise explanation

Falsy values: \`false\`, \`0\`, \`-0\`, \`0n\`, \`""\`, \`null\`, \`undefined\`, \`NaN\`. Everything else is truthy — including \`"0"\` and \`[]\`.

## Experiment

\`experiments/02-truthiness.js\`

---

# Lesson 3 — Comparisons and coercion

## Concise explanation

\`<\` / \`>\` may coerce via ToNumber (or ToPrimitive). \`===\` does not coerce. \`==\` does — prefer \`===\` unless you intentionally want nullish \`== null\`.

## Experiment

\`experiments/03-compare.js\` + [\`predictions/P02-compare.md\`](./predictions/P02-compare.md)

---

# Lesson 4 — \`||\` vs \`??\` vs \`&&\`

## Concise explanation

- \`a || b\` — uses truthiness (skips \`0\`, \`""\`)
- \`a ?? b\` — only substitutes for \`null\`/\`undefined\`
- \`a && b\` — short-circuit; returns first falsy or last value

## Experiment

\`experiments/04-nullish.js\` + [\`predictions/P03-nullish.md\`](./predictions/P03-nullish.md)

---

# Lesson 5 — Unary \`+\`, \`!\`, and \`!!\`

## Concise explanation

\`+x\` ≈ ToNumber. \`!x\` / \`!!x\` are boolean coercions.

## Experiment

\`experiments/05-unary.js\`
`,
  experiments: {
    "01-plus-minus.js": `// 04-operators / 01-plus-minus.js
// PREDICT: predictions/P01-plus.md
"use strict";

console.log("1 + 2", 1 + 2);
console.log("'1' + 2", "1" + 2);
console.log("1 + '2'", 1 + "2");
console.log("'1' - 2", "1" - 2);
console.log("[] + {}", [] + {});
console.log("{} + []", {} + []); // note: parsing quirk in some REPL contexts; script is fine
console.log("true + 1", true + 1);
console.log("null + 1", null + 1);
console.log("undefined + 1", undefined + 1);
`,
    "02-truthiness.js": `// 04-operators / 02-truthiness.js
"use strict";

const values = [false, 0, -0, 0n, "", null, undefined, NaN, "0", [], {}, " "];
for (const v of values) {
  console.log(JSON.stringify(v) ?? String(v), "→", Boolean(v));
}
`,
    "03-compare.js": `// 04-operators / 03-compare.js
// PREDICT: predictions/P02-compare.md
"use strict";

console.log("'10' > '9'", "10" > "9"); // lexicographic
console.log("'10' > 9", "10" > 9);
console.log("null == 0", null == 0);
console.log("null >= 0", null >= 0);
console.log("null === 0", null === 0);
console.log("undefined == null", undefined == null);
console.log("NaN == NaN", NaN == NaN);
`,
    "04-nullish.js": `// 04-operators / 04-nullish.js
// PREDICT: predictions/P03-nullish.md
"use strict";

const cfg = { volume: 0, title: "" };
console.log("volume || 5", cfg.volume || 5);
console.log("volume ?? 5", cfg.volume ?? 5);
console.log("title || 'n/a'", cfg.title || "n/a");
console.log("title ?? 'n/a'", cfg.title ?? "n/a");
console.log("missing ?? 1", cfg.missing ?? 1);
console.log("0 && 'x'", 0 && "x");
console.log("1 && 'x'", 1 && "x");
`,
    "05-unary.js": `// 04-operators / 05-unary.js
"use strict";

console.log("+'42'", +"42");
console.log("+'42px'", +"42px");
console.log("+true", +true);
console.log("+[]", +[]);
console.log("+{}", +{});
console.log("!!'0'", !!"0");
console.log("!!0", !!0);
`,
  },
  predictions: {
    "P01-plus.md": makePred(
      "04-operators",
      "P01",
      "plus vs minus",
      "★★★☆☆",
      "01-plus-minus.js",
      `"1" + 2
"1" - 2
true + 1
null + 1`,
      "Which abstract operation does `+` prefer when a string is involved?",
      "Predict `[] + []` and `[] - []`."
    ),
    "P02-compare.md": makePred(
      "04-operators",
      "P02",
      "comparisons",
      "★★★★☆",
      "03-compare.js",
      `null == 0
null >= 0
"10" > "9"`,
      "Why can `>=` be true when `==` is false for null/0?",
      "Would you ever use `==` intentionally? When?"
    ),
    "P03-nullish.md": makePred(
      "04-operators",
      "P03",
      "|| vs ??",
      "★★☆☆☆",
      "04-nullish.js",
      `volume: 0 → volume || 5 vs volume ?? 5`,
      "Which operator preserves legitimate zero?",
      "Default a missing config key without wiping empty string titles."
    ),
  },
  broken: [
    {
      file: "01-broken-defaults.js",
      task: "Fix defaults so volume 0 and title '' are kept; only null/undefined get defaults",
      code: `// CONTRACT:
// applyDefaults({ volume: 0, title: "" }) → { volume: 0, title: "", theme: "dark" }
// applyDefaults({}) → { volume: 5, title: "untitled", theme: "dark" }
// Run: node 04-operators/challenges/broken/01-broken-defaults.js

"use strict";

function applyDefaults(input) {
  return {
    volume: input.volume || 5,
    title: input.title || "untitled",
    theme: input.theme || "dark",
  };
}

console.log(JSON.stringify(applyDefaults({ volume: 0, title: "" })));
console.log(JSON.stringify(applyDefaults({})));
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-coercion-map.md",
      diff: "★★★★",
      body: `# C01 — Coercion map

**Difficulty:** ★★★★☆

Build a two-column table in your notes:

| Expression | Result | Why (abstract op) |

Cover at least: \`+\`, \`-\`, \`==\`, \`===\`, \`||\`, \`??\`, \`Boolean\`, \`Number\`, relational \`<\`.

Use values: \`""\`, \`"0"\`, \`0\`, \`null\`, \`undefined\`, \`[]\`, \`NaN\`.
`,
    },
  ],
  solutions: {
    "01-broken-defaults.md": `# Solution — defaults

\`\`\`js
volume: input.volume ?? 5,
title: input.title ?? "untitled",
theme: input.theme ?? "dark",
\`\`\`
`,
    "C01-coercion-map.md": `# Solution notes — C01

Key: \`+\` with string → ToString concat; arithmetic/relational often ToNumber; \`??\` only nullish; \`||\` truthiness.
`,
  },
  review: `# Spaced review — 04 Operators

## Day 1

1. List all falsy values.
2. \`||\` vs \`??\` — one sentence each.
3. Predict \`"10" > "9"\` and \`"10" > 9\`.

## Day 3

1. Why is \`null >= 0\` surprising to many developers?
2. Fix a defaults bug that used \`||\` on volume.

## Day 7 / 14 / 30

1. Teach ToNumber/ToString/ToBoolean with three examples each.
2. Invent a \`+\` vs \`-\` prediction set and verify.
`,
  knowledge: `### Deep Fact

\`==\` is not “approximate equality” — it follows a defined coercion algorithm. Still usually the wrong tool.

### Why This Works

Naming the abstract operation turns “weird JS” into predictable mechanics.

### Common Misconception

“Empty array is falsy.” — \`Boolean([])\` is \`true\`.

### Interview Insight

Classic traps: \`[] + {}\`, \`null == 0\` vs \`null >= 0\`, \`||\` eating zeros.

### Production Insight

Prefer explicit \`Number\`, \`String\`, \`Boolean\`, or nullish coalescing at API boundaries.
`,
  workOrder: `1. plus/minus + P01  
2. truthiness + compare + P02  
3. nullish + unary + P03  
4. Broken defaults  
5. C01 + review`,
  nextModule: "05-control-flow",
});

// ═══════════════════════════════════════════════════════════════════════════
// MODULE 05 — Control Flow
// ═══════════════════════════════════════════════════════════════════════════
moduleKit("05", "control-flow", {
  title: "Control Flow",
  difficulty: "★★☆☆☆ (peaks at ★★★)",
  prereq: "04-operators",
  outcomes: [
    "Predict if/else and switch (including fall-through)",
    "Choose for / while / for...of intentionally",
    "Use break/continue correctly",
    "Explain truthiness-driven branches",
    "Avoid off-by-one and accidental fall-through bugs",
  ],
  lessons: `# Lesson 1 — Branches follow completion of a test

## Concise explanation

\`if (test)\` converts \`test\` with ToBoolean. Empty objects and arrays are truthy.

## Experiment

\`experiments/01-if-truthiness.js\` + [\`predictions/P01-if.md\`](./predictions/P01-if.md)

---

# Lesson 2 — Loops

## Concise explanation

- \`for\` — index control  
- \`while\` / \`do...while\` — condition-driven  
- \`for...of\` — iterate iterable values  
- \`for...in\` — enumerate keys (often the wrong tool for arrays)

## Experiments

\`experiments/02-loops.js\`  
\`experiments/03-for-of-in.js\` + [\`predictions/P02-loops.md\`](./predictions/P02-loops.md)

---

# Lesson 3 — switch fall-through

## Concise explanation

\`switch\` uses strict equality. Cases fall through until \`break\`/\`return\`.

## Experiment

\`experiments/04-switch.js\` + [\`predictions/P03-switch.md\`](./predictions/P03-switch.md)

---

# Lesson 4 — break, continue, labels (rare)

## Concise explanation

\`break\` exits the loop/switch. \`continue\` skips to next iteration. Labels exist; use sparingly.

## Experiment

\`experiments/05-break-continue.js\`
`,
  experiments: {
    "01-if-truthiness.js": `// 05-control-flow / 01-if-truthiness.js
// PREDICT: predictions/P01-if.md
"use strict";

function branch(v) {
  if (v) return "truthy";
  return "falsy";
}

for (const v of [1, 0, "0", [], {}, null, undefined, "hi"]) {
  console.log(JSON.stringify(v) ?? String(v), branch(v));
}
`,
    "02-loops.js": `// 05-control-flow / 02-loops.js
"use strict";

let i = 0;
const out = [];
while (i < 3) {
  out.push(i);
  i += 1;
}
console.log("while", out.join(","));

const forOut = [];
for (let j = 0; j < 3; j++) forOut.push(j);
console.log("for", forOut.join(","));

let k = 0;
do {
  console.log("do", k);
  k += 1;
} while (k < 1);
`,
    "03-for-of-in.js": `// 05-control-flow / 03-for-of-in.js
// PREDICT: predictions/P02-loops.md
"use strict";

const arr = ["a", "b"];
arr.extra = "x";

console.log("for...of");
for (const v of arr) console.log(v);

console.log("for...in");
for (const k in arr) console.log(k, arr[k]);
`,
    "04-switch.js": `// 05-control-flow / 04-switch.js
// PREDICT: predictions/P03-switch.md
"use strict";

function label(n) {
  switch (n) {
    case 1:
      return "one";
    case 2:
      console.log("two-ish");
    // fall through intentional below for demo
    case 3:
      return "two-or-three";
    default:
      return "other";
  }
}

console.log(label(1));
console.log(label(2));
console.log(label(3));
console.log(label("1")); // strict — default
`,
    "05-break-continue.js": `// 05-control-flow / 05-break-continue.js
"use strict";

for (let i = 0; i < 5; i++) {
  if (i === 2) continue;
  if (i === 4) break;
  console.log(i);
}
`,
  },
  predictions: {
    "P01-if.md": makePred(
      "05-control-flow",
      "P01",
      "if truthiness",
      "★★☆☆☆",
      "01-if-truthiness.js",
      `if ([]) …  if ("0") …  if (0) …`,
      "Which of [], \"0\", 0 take the truthy branch?",
      "How would you branch on “non-empty array” correctly?"
    ),
    "P02-loops.md": makePred(
      "05-control-flow",
      "P02",
      "for-of vs for-in",
      "★★★☆☆",
      "03-for-of-in.js",
      `for...of vs for...in on ["a","b"] with .extra = "x"`,
      "What does each loop visit?",
      "Why is for...in risky on arrays?"
    ),
    "P03-switch.md": makePred(
      "05-control-flow",
      "P03",
      "switch",
      "★★☆☆☆",
      "04-switch.js",
      `label(2) and label("1")`,
      "Does case 2 fall through? Does \"1\" match case 1?",
      "When is switch worse than a map/object lookup?"
    ),
  },
  broken: [
    {
      file: "01-broken-sum-evens.js",
      task: "Fix so sumEvens([1,2,3,4]) returns 6",
      code: `// CONTRACT: sum even numbers only.
// Run: node 05-control-flow/challenges/broken/01-broken-sum-evens.js

"use strict";

function sumEvens(nums) {
  let sum = 0;
  for (const n of nums) {
    if (n % 2 === 0) continue; // bug: skips evens
    sum += n;
  }
  return sum;
}

console.log(sumEvens([1, 2, 3, 4])); // expect 6
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-fizzbuzz-control.md",
      diff: "★★",
      body: `# C01 — Control-flow FizzBuzz

**Difficulty:** ★★☆☆☆

Implement \`fizzBuzz(n)\` printing \`1..n\` with Fizz/Buzz/FizzBuzz rules using \`for\` + \`if\` (no array methods).

Predict the first 15 lines before running.
`,
    },
  ],
  solutions: {
    "01-broken-sum-evens.md": `# Solution

Remove the inverted \`continue\`, or \`continue\` on odds:

\`\`\`js
if (n % 2 !== 0) continue;
sum += n;
\`\`\`
`,
    "C01-fizzbuzz-control.md": `# Solution sketch

Standard modulo 15 / 3 / 5 branching inside a \`for\` loop.
`,
  },
  review: `# Spaced review — 05 Control Flow

## Day 1

1. Truthiness list again — apply to \`if\`.
2. \`for...of\` vs \`for...in\` one example.
3. Switch fall-through — draw it.

## Day 3

1. Fix inverted continue bug from memory.
2. When is \`do...while\` the right tool?

## Day 7 / 14 / 30

1. Write FizzBuzz cold with predictions.
2. Explain why \`switch ("1")\` may not match \`case 1\`.
`,
  knowledge: `### Deep Fact

\`switch\` cases use \`===\` — string \`"1"\` does not match number \`1\`.

### Why This Works

Control flow bugs are usually boolean-coercion or off-by-one — both experimental.

### Common Misconception

“\`for...in\` is for arrays.” — Prefer \`for...of\` or indexed \`for\`.

### Interview Insight

Fall-through and off-by-one remain common whiteboard failures.

### Production Insight

Prefer early returns over deep nesting; keep switch exhaustive or default-log.
`,
  workOrder: `1. if + P01  
2. loops + for-of/in + P02  
3. switch + break + P03  
4. Broken sum  
5. C01 + review`,
  nextModule: "06-functions",
});

console.log("Phase 5 generator: modules 02–05 defined; continuing 06–12…");
