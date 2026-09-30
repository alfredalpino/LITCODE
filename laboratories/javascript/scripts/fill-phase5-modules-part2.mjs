// Part 2 — appended conceptually; actually imported? No — paste via shell.
// This file is sourced by fill-phase5-modules.mjs via dynamic... 
// Simpler: standalone continuation that redefines helpers — NO.
// We'll append to main file with shell cat.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LAB = path.resolve(__dirname, "..");

function write(rel, text) {
  const abs = path.join(LAB, rel);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const body = text.trimStart().replace(/^\n/, "");
  fs.writeFileSync(abs, body.endsWith("\n") ? body : body + "\n");
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
  for (const [name, body] of Object.entries(experiments)) write(`${dir}/experiments/${name}`, body);
  for (const [name, body] of Object.entries(predictions)) write(`${dir}/predictions/${name}`, body);
  for (const b of broken) write(`${dir}/challenges/broken/${b.file}`, b.code);
  for (const c of challenges) write(`${dir}/challenges/${c.file}`, c.body);
  for (const [name, body] of Object.entries(solutions)) write(`${dir}/solutions/${name}`, body);
  write(`${dir}/review.md`, review);
}

// 06 Functions
moduleKit("06", "functions", {
  title: "Functions",
  difficulty: "★★★☆☆",
  prereq: "05-control-flow",
  outcomes: [
    "Distinguish declarations, expressions, and arrow functions",
    "Predict parameter defaults and rest/spread",
    "Use functions as values (higher-order)",
    "Trace simple recursion on the call stack",
    "Know when arrows differ (preview of `this` — module 15)",
  ],
  lessons: `# Lesson 1 — Functions are values

## Concise explanation

Functions are objects you can call. They can be stored, passed, and returned.

## Experiment

\`experiments/01-fn-values.js\` + [\`predictions/P01-values.md\`](./predictions/P01-values.md)

---

# Lesson 2 — Declaration vs expression vs arrow

## Concise explanation

- Function **declaration** — hoisted as callable  
- Function **expression** — created at evaluation time  
- **Arrow** — concise; lexical \`this\` (later); no \`arguments\` object

## Experiment

\`experiments/02-forms.js\`

---

# Lesson 3 — Parameters

## Concise explanation

Defaults apply when the argument is \`undefined\`. Rest gathers remaining args. Spread expands.

## Experiment

\`experiments/03-params.js\` + [\`predictions/P02-params.md\`](./predictions/P02-params.md)

---

# Lesson 4 — Higher-order functions

## Concise explanation

A function that takes/returns functions. Foundation for array methods and middleware.

## Experiment

\`experiments/04-hof.js\`

---

# Lesson 5 — Recursion teaser

## Concise explanation

A function calls itself with a smaller problem until a base case. Stack grows each call.

## Experiment

\`experiments/05-recursion.js\` + [\`predictions/P03-recursion.md\`](./predictions/P03-recursion.md)
`,
  experiments: {
    "01-fn-values.js": `// 06-functions / 01-fn-values.js
// PREDICT: predictions/P01-values.md
"use strict";

function greet(name) {
  return "hi " + name;
}

const also = greet;
console.log(also("lab"));
console.log(typeof greet);

function runTwice(fn) {
  fn();
  fn();
}
runTwice(() => console.log("tick"));
`,
    "02-forms.js": `// 06-functions / 02-forms.js
"use strict";

console.log("decl", typeof declared);
declared();
function declared() {
  console.log("declared ok");
}

console.log("expr", typeof expressed);
var expressed = function () {
  console.log("expressed ok");
};
expressed();

const arrow = (x) => x * 2;
console.log("arrow", arrow(21));
`,
    "03-params.js": `// 06-functions / 03-params.js
// PREDICT: predictions/P02-params.md
"use strict";

function f(a = 1, b = a + 1, ...rest) {
  console.log({ a, b, rest });
}

f();
f(10);
f(10, 20, 30, 40);
f(undefined, 5);
`,
    "04-hof.js": `// 06-functions / 04-hof.js
"use strict";

function map(arr, fn) {
  const out = [];
  for (const x of arr) out.push(fn(x));
  return out;
}

console.log(map([1, 2, 3], (n) => n * n));

function makeMultiplier(k) {
  return (n) => n * k;
}
const triple = makeMultiplier(3);
console.log(triple(4));
`,
    "05-recursion.js": `// 06-functions / 05-recursion.js
// PREDICT: predictions/P03-recursion.md
"use strict";

function fact(n) {
  if (n <= 1) return 1;
  return n * fact(n - 1);
}

console.log("fact(5)", fact(5));

function sum(arr) {
  if (arr.length === 0) return 0;
  return arr[0] + sum(arr.slice(1));
}
console.log("sum", sum([1, 2, 3, 4]));
`,
  },
  predictions: {
    "P01-values.md": makePred("06-functions", "P01", "fn as values", "★★☆☆☆", "01-fn-values.js", `const also = greet; also("lab");`, "What does assigning a function do — copy code or alias the same function object?", "Can two names point at one function?"),
    "P02-params.md": makePred("06-functions", "P02", "defaults rest", "★★★☆☆", "03-params.js", `f(); f(undefined, 5);`, "When do defaults fire? What lands in rest?", "Does passing null trigger default?"),
    "P03-recursion.md": makePred("06-functions", "P03", "recursion", "★★★☆☆", "05-recursion.js", `fact(5)`, "How many stack frames peak for fact(5)?", "What happens without a base case?"),
  },
  broken: [
    {
      file: "01-broken-once.js",
      task: "Fix once(fn) so fn runs only on the first call",
      code: `// CONTRACT: once logs "run" once across three calls.
// Run: node 06-functions/challenges/broken/01-broken-once.js

"use strict";

function once(fn) {
  return function wrapped() {
    fn(); // bug: always runs
  };
}

const logOnce = once(() => console.log("run"));
logOnce();
logOnce();
logOnce();
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-compose.md",
      diff: "★★★",
      body: `# C01 — compose

**Difficulty:** ★★★☆☆

Implement \`compose(f, g)\` such that \`compose(f, g)(x) === f(g(x))\`.

Predict \`compose((n) => n + 1, (n) => n * 2)(3)\` before running.
`,
    },
  ],
  solutions: {
    "01-broken-once.md": `# Solution

\`\`\`js
function once(fn) {
  let called = false;
  return function wrapped(...args) {
    if (called) return;
    called = true;
    return fn(...args);
  };
}
\`\`\`
`,
    "C01-compose.md": `# Solution

\`\`\`js
function compose(f, g) {
  return (x) => f(g(x));
}
\`\`\`
`,
  },
  review: `# Spaced review — 06 Functions

## Day 1
1. Declaration vs expression hoist.
2. Default params — when?
3. Draw fact(4) stack.

## Day 3
1. Implement once() cold.
2. Arrow vs function — two differences (including this preview).

## Day 7 / 14 / 30
1. Write map as HOF from scratch.
2. Compose two functions.
`,
  knowledge: `### Deep Fact
Functions are callable objects — they have properties (\`length\`, \`name\`).

### Why This Works
Treating functions as values unlocks composition and clean APIs.

### Common Misconception
“Arrow functions are just shorter functions.” — Also change \`this\`/\`arguments\`/\`new\` rules.

### Interview Insight
Implement once, memoize, or compose; explain recursion base cases.

### Production Insight
Prefer pure helpers at boundaries; name your functions for stack traces.
`,
  workOrder: `1. fn values + P01  
2. forms + params + P02  
3. HOF + recursion + P03  
4. Broken once  
5. C01 + review`,
  nextModule: "07-scope",
});

// 07 Scope
moduleKit("07", "scope", {
  title: "Scope & Lexical Environments",
  difficulty: "★★★☆☆ (peaks at ★★★★)",
  prereq: "06-functions",
  outcomes: [
    "Explain lexical scope vs dynamic scope (JS is lexical)",
    "Walk a scope chain for free variables",
    "Contrast block scope and function scope",
    "Predict nested lookup and shadowing outcomes",
    "Connect environments to what closures capture (bridge to 08)",
  ],
  lessons: `# Lesson 1 — Lexical scope

## Concise explanation

Where you **write** a function determines which bindings it can see — not where you **call** it.

## Experiment

\`experiments/01-lexical.js\` + [\`predictions/P01-lexical.md\`](./predictions/P01-lexical.md)

---

# Lesson 2 — Scope chain

## Concise explanation

Free variable lookup walks outer environment records until found or ReferenceError.

## Experiment

\`experiments/02-chain.js\`

---

# Lesson 3 — Block vs function scope

## Concise explanation

\`let\`/\`const\` are block-scoped. \`var\` is function-scoped (or script-scoped at top level).

## Experiment

\`experiments/03-block-fn.js\` + [\`predictions/P02-block.md\`](./predictions/P02-block.md)

---

# Lesson 4 — Nested functions see outer bindings

## Concise explanation

Inner functions close over the lexical environment where they were defined (formalized next module).

## Experiment

\`experiments/04-nested.js\` + [\`predictions/P03-nested.md\`](./predictions/P03-nested.md)
`,
  experiments: {
    "01-lexical.js": `// 07-scope / 01-lexical.js
// PREDICT: predictions/P01-lexical.md
"use strict";

const x = "outer";

function show() {
  console.log(x);
}

function runner(fn) {
  const x = "runner-local";
  fn();
}

runner(show);
`,
    "02-chain.js": `// 07-scope / 02-chain.js
"use strict";

const a = 1;
function outer() {
  const b = 2;
  function inner() {
    const c = 3;
    console.log(a, b, c);
  }
  inner();
}
outer();
`,
    "03-block-fn.js": `// 07-scope / 03-block-fn.js
// PREDICT: predictions/P02-block.md
"use strict";

function demo(flag) {
  if (flag) {
    var fromVar = "var";
    let fromLet = "let";
    console.log(fromVar, fromLet);
  }
  console.log("fromVar?", typeof fromVar);
  try {
    console.log(fromLet);
  } catch (e) {
    console.log("fromLet →", e.name);
  }
}
demo(true);
`,
    "04-nested.js": `// 07-scope / 04-nested.js
// PREDICT: predictions/P03-nested.md
"use strict";

function makeGreeter(greeting) {
  return function (name) {
    console.log(greeting + ", " + name);
  };
}

const hi = makeGreeter("hi");
const yo = makeGreeter("yo");
hi("ada");
yo("linus");
`,
  },
  predictions: {
    "P01-lexical.md": makePred("07-scope", "P01", "lexical not dynamic", "★★★☆☆", "01-lexical.js", `runner(show) with x in both places`, "Which `x` does `show` print — outer or runner-local?", "What would dynamic scope have printed?"),
    "P02-block.md": makePred("07-scope", "P02", "block vs function", "★★☆☆☆", "03-block-fn.js", `var vs let inside if`, "Is fromVar visible after the if?", "Rewrite with only let — what breaks?"),
    "P03-nested.md": makePred("07-scope", "P03", "nested environments", "★★☆☆☆", "04-nested.js", `hi("ada"); yo("linus");`, "Do hi and yo share one greeting binding?", "Where does greeting live after makeGreeter returns?"),
  },
  broken: [
    {
      file: "01-broken-lookup.js",
      task: "Fix so printCount always reads the module-level count (not a shadowed local)",
      code: `// CONTRACT: printCount() prints 1 then 2 after bumps.
// Run: node 07-scope/challenges/broken/01-broken-lookup.js

"use strict";

let count = 0;

function bump() {
  count += 1;
}

function printCount() {
  let count = 999; // bug: shadows
  console.log(count);
}

bump();
printCount();
bump();
printCount();
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-draw-chain.md",
      diff: "★★★",
      body: `# C01 — Draw the chain

**Difficulty:** ★★★☆☆

For \`experiments/02-chain.js\`, draw environment records:

\`\`\`text
inner → outer → script/global
\`\`\`

Label which binding each identifier resolves to.
`,
    },
  ],
  solutions: {
    "01-broken-lookup.md": `# Solution

Remove the inner \`let count = 999\` so lookup finds the outer binding.
`,
    "C01-draw-chain.md": `# Solution notes

\`a\` → outer/script; \`b\` → outer fn env; \`c\` → inner env.
`,
  },
  review: `# Spaced review — 07 Scope

## Day 1
1. Lexical vs dynamic — one sentence.
2. Predict a shadowing bug.
3. var in if vs let in if.

## Day 3
1. Draw scope chain for nested functions.
2. Why does show() ignore runner-local x?

## Day 7 / 14 / 30
1. Teach environment records without metaphor-only language.
2. Bridge: what does a closure keep alive?
`,
  knowledge: `### Deep Fact
JavaScript uses **lexical** environments. Call-site does not redefine free variables.

### Specification Insight
ECMAScript Environment Records hold bindings; outer pointers form the chain.

### Common Misconception
“Scope is determined by where the function is called.” — That’s dynamic scope; JS is not that.

### Interview Insight
Explain lexical scope with a nested function example on a whiteboard.

### Production Insight
Shadowing bugs are silent logic errors — name carefully at boundaries.
`,
  workOrder: `1. lexical + P01  
2. chain + block + P02  
3. nested + P03  
4. Broken lookup  
5. C01 + review`,
  nextModule: "08-closures",
});

// 08 Closures
moduleKit("08", "closures", {
  title: "Closures",
  difficulty: "★★★★☆",
  prereq: "07-scope",
  outcomes: [
    "Define a closure in environment terms",
    "Predict loop + closure interactions (`var` vs `let`)",
    "Build private state with closures",
    "Spot accidental retention / stale capture bugs",
    "Explain why returned functions still see outer bindings",
  ],
  lessons: `# Lesson 1 — Closure = function + lexical environment

## Concise explanation

A closure is a function that retains access to bindings from its outer lexical environment after that outer function has returned.

## Experiment

\`experiments/01-basic-closure.js\` + [\`predictions/P01-basic.md\`](./predictions/P01-basic.md)

---

# Lesson 2 — The classic loop trap

## Concise explanation

\`var\` in a \`for\` loop shares one binding. \`let\` creates a new binding per iteration.

## Experiment

\`experiments/02-loop-closures.js\` + [\`predictions/P02-loop.md\`](./predictions/P02-loop.md)

---

# Lesson 3 — Private state

## Concise explanation

Outer locals not returned are still reachable by inner functions — encapsulation without classes.

## Experiment

\`experiments/03-private.js\`

---

# Lesson 4 — Stale captures & async teaser

## Concise explanation

Closures capture bindings (not snapshots of primitive values at creation — they see current binding values when they run).

## Experiment

\`experiments/04-live-binding.js\` + [\`predictions/P03-live.md\`](./predictions/P03-live.md)
`,
  experiments: {
    "01-basic-closure.js": `// 08-closures / 01-basic-closure.js
// PREDICT: predictions/P01-basic.md
"use strict";

function makeCounter() {
  let n = 0;
  return {
    inc() {
      n += 1;
      return n;
    },
    value() {
      return n;
    },
  };
}

const c = makeCounter();
console.log(c.inc(), c.inc(), c.value());
const d = makeCounter();
console.log(d.value(), c.value());
`,
    "02-loop-closures.js": `// 08-closures / 02-loop-closures.js
// PREDICT: predictions/P02-loop.md
"use strict";

const withVar = [];
for (var i = 0; i < 3; i++) {
  withVar.push(function () {
    return i;
  });
}
console.log(
  "var",
  withVar.map((f) => f()).join(",")
);

const withLet = [];
for (let j = 0; j < 3; j++) {
  withLet.push(function () {
    return j;
  });
}
console.log(
  "let",
  withLet.map((f) => f()).join(",")
);
`,
    "03-private.js": `// 08-closures / 03-private.js
"use strict";

function bankAccount(opening) {
  let balance = opening;
  return {
    deposit(n) {
      balance += n;
      return balance;
    },
    withdraw(n) {
      if (n > balance) throw new Error("insufficient");
      balance -= n;
      return balance;
    },
    // no direct balance export
  };
}

const acct = bankAccount(100);
console.log(acct.deposit(20));
console.log(acct.withdraw(50));
console.log("balance" in acct, acct.balance);
`,
    "04-live-binding.js": `// 08-closures / 04-live-binding.js
// PREDICT: predictions/P03-live.md
"use strict";

let msg = "one";
function read() {
  console.log(msg);
}
read();
msg = "two";
read();
`,
  },
  predictions: {
    "P01-basic.md": makePred("08-closures", "P01", "counter closure", "★★★☆☆", "01-basic-closure.js", `two counters c and d`, "Do c and d share n?", "Where does n live after makeCounter returns?"),
    "P02-loop.md": makePred("08-closures", "P02", "loop trap", "★★★★☆", "02-loop-closures.js", `var vs let push functions`, "What do the three var functions return? the let ones?", "How would an IIFE fix the var version?"),
    "P03-live.md": makePred("08-closures", "P03", "live bindings", "★★★☆☆", "04-live-binding.js", `msg changes between reads`, "Does read snapshot \"one\"?", "Relate this to async callbacks firing later."),
  },
  broken: [
    {
      file: "01-broken-buttons.js",
      task: "Fix so handlers report 0,1,2 not 3,3,3 (simulate with var loop)",
      code: `// CONTRACT: print 0 1 2
// Run: node 08-closures/challenges/broken/01-broken-buttons.js

"use strict";

const handlers = [];
for (var i = 0; i < 3; i++) {
  handlers.push(function () {
    console.log(i);
  });
}
handlers.forEach((h) => h());
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-explain-closure.md",
      diff: "★★★★",
      body: `# C01 — Explain without metaphors alone

**Difficulty:** ★★★★☆

In ≤12 sentences, explain closures using: lexical environment, binding, and lifetime.

Then give one production bug caused by accidental capture.
`,
    },
  ],
  solutions: {
    "01-broken-buttons.md": `# Solution

Use \`let i\` in the loop, or bind per iteration:

\`\`\`js
handlers.push((function (n) {
  return function () { console.log(n); };
})(i));
\`\`\`
`,
    "C01-explain-closure.md": `# Solution notes

Function object retains reference to outer Environment Record; bindings remain reachable → not GC'd while closure lives.
`,
  },
  review: `# Spaced review — 08 Closures

## Day 1
1. Definition in environment terms.
2. var vs let loop prediction.
3. Private balance pattern.

## Day 3
1. Live binding vs snapshot myth.
2. Fix 3,3,3 handlers cold.

## Day 7 / 14 / 30
1. Teach closures to a peer without “backpack” as the only model.
2. Connect to module pattern / React hooks mental model carefully.
`,
  knowledge: `### Deep Fact
Closures capture **bindings**, not frozen copies of primitive values.

### Why This Works
Environment retention explains both power (privacy) and bugs (stale loops, leaks).

### Common Misconception
“Closures copy variables when created.” — They close over the binding.

### Interview Insight
Loop + setTimeout classic; private state via closure.

### Production Insight
Long-lived closures can retain large objects — beware accidental captures in listeners.
`,
  workOrder: `1. basic + P01  
2. loop + P02  
3. private + live + P03  
4. Broken buttons  
5. C01 + review`,
  nextModule: "09-objects",
});

console.log("Wrote 06–08");
