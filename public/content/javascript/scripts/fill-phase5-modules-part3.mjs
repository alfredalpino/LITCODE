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

function moduleKit(id, slug, cfg) {
  const {
    title, difficulty, prereq, outcomes, lessons, experiments,
    predictions, broken, challenges, solutions, review, knowledge, workOrder, nextModule,
  } = cfg;
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

// 09 Objects
moduleKit("09", "objects", {
  title: "Objects",
  difficulty: "★★★☆☆",
  prereq: "08-closures",
  outcomes: [
    "Create and mutate object properties confidently",
    "Use shorthand, computed keys, and methods",
    "Read property descriptors at a basic level",
    "Distinguish own vs inherited properties (bridge to prototypes)",
    "Use Object.assign / spread as shallow copies",
  ],
  lessons: `# Lesson 1 — Objects are property bags with identity

## Concise explanation

An ordinary object maps property keys (string/symbol) to values. Equality is by reference.

## Experiment

\`experiments/01-literals.js\` + [\`predictions/P01-props.md\`](./predictions/P01-props.md)

---

# Lesson 2 — Access, mutation, deletion

## Concise explanation

Dot vs bracket access. \`delete\` removes own properties. Missing properties yield \`undefined\` (not ReferenceError).

## Experiment

\`experiments/02-access.js\`

---

# Lesson 3 — Descriptors (intro)

## Concise explanation

Properties have attributes: writable, enumerable, configurable (data properties). Getters/setters are accessor properties.

## Experiment

\`experiments/03-descriptors.js\` + [\`predictions/P02-desc.md\`](./predictions/P02-desc.md)

---

# Lesson 4 — Shallow copy traps

## Concise explanation

\`{...obj}\` and \`Object.assign\` copy **enumerable own** properties one level deep — nested objects stay shared.

## Experiment

\`experiments/04-shallow.js\` + [\`predictions/P03-shallow.md\`](./predictions/P03-shallow.md)
`,
  experiments: {
    "01-literals.js": `// 09-objects / 01-literals.js
// PREDICT: predictions/P01-props.md
"use strict";

const key = "role";
const user = {
  name: "ada",
  [key]: "admin",
  greet() {
    return "hi " + this.name;
  },
};

console.log(user.name, user.role);
console.log(user.greet());
console.log(Object.keys(user));
`,
    "02-access.js": `// 09-objects / 02-access.js
"use strict";

const o = { a: 1 };
console.log(o.a, o["a"], o.missing);
o.b = 2;
delete o.a;
console.log(o);
`,
    "03-descriptors.js": `// 09-objects / 03-descriptors.js
// PREDICT: predictions/P02-desc.md
"use strict";

const o = {};
Object.defineProperty(o, "hidden", {
  value: 42,
  writable: false,
  enumerable: false,
  configurable: true,
});

console.log(o.hidden);
console.log(Object.keys(o));
console.log(Object.getOwnPropertyDescriptor(o, "hidden"));
try {
  o.hidden = 99;
} catch (e) {
  console.log("assign →", e.name);
}
console.log("after assign attempt", o.hidden);
`,
    "04-shallow.js": `// 09-objects / 04-shallow.js
// PREDICT: predictions/P03-shallow.md
"use strict";

const original = { n: 1, nest: { x: 1 } };
const copy = { ...original };
copy.n = 2;
copy.nest.x = 99;
console.log("original.n", original.n);
console.log("original.nest.x", original.nest.x);
console.log("same nest?", original.nest === copy.nest);
`,
  },
  predictions: {
    "P01-props.md": makePred("09-objects", "P01", "literals", "★★☆☆☆", "01-literals.js", `computed key + method`, "What keys appear in Object.keys?", "Does greet use this correctly here?"),
    "P02-desc.md": makePred("09-objects", "P02", "descriptors", "★★★☆☆", "03-descriptors.js", `non-enumerable non-writable`, "Do Object.keys include hidden? Does assignment throw in strict?", "When would you use defineProperty?"),
    "P03-shallow.md": makePred("09-objects", "P03", "shallow copy", "★★★☆☆", "04-shallow.js", `spread copy then mutate nest`, "Does original.n change? nest.x?", "How would you deep-clone carefully?"),
  },
  broken: [
    {
      file: "01-broken-merge.js",
      task: "Fix merge so nested settings are not shared with the defaults object",
      code: `// CONTRACT: mutating result.nested must not change DEFAULTS.nested
// Run: node 09-objects/challenges/broken/01-broken-merge.js

"use strict";

const DEFAULTS = { nested: { theme: "dark" } };

function merge(over) {
  return Object.assign(DEFAULTS, over); // bug: mutates defaults + shallow
}

const result = merge({ nested: { theme: "light" } });
result.nested.theme = "broken";
console.log(DEFAULTS.nested.theme); // should stay "dark" — currently wrong path
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-pick.md",
      diff: "★★★",
      body: `# C01 — pick

**Difficulty:** ★★★☆☆

Implement \`pick(obj, keys)\` returning a new object with only the listed own keys that exist.

Predict \`pick({a:1,b:2}, ["a","c"])\`.
`,
    },
  ],
  solutions: {
    "01-broken-merge.md": `# Solution

Never mutate DEFAULTS. Shallow-merge carefully; clone nested objects when needed:

\`\`\`js
return {
  ...DEFAULTS,
  ...over,
  nested: { ...DEFAULTS.nested, ...(over.nested || {}) },
};
\`\`\`
`,
    "C01-pick.md": `# Solution

\`\`\`js
function pick(obj, keys) {
  const out = {};
  for (const k of keys) {
    if (Object.prototype.hasOwnProperty.call(obj, k)) out[k] = obj[k];
  }
  return out;
}
\`\`\`
`,
  },
  review: `# Spaced review — 09 Objects

## Day 1
1. Own property vs missing key.
2. Descriptor fields.
3. Shallow copy hazard.

## Day 3
1. Implement pick cold.
2. Fix defaults merge bug.

## Day 7 / 14 / 30
1. Teach defineProperty use cases.
2. Bridge to prototypes: where do inherited methods live?
`,
  knowledge: `### Deep Fact
\`Object.keys\` skips non-enumerable and symbol keys.

### Why This Works
Property attributes explain frozen APIs, libraries, and enumeration surprises.

### Common Misconception
“Spread deep-clones.” — It does not.

### Interview Insight
Shallow vs deep copy; hasOwnProperty vs \`in\`.

### Production Insight
Prefer immutable update patterns at state boundaries; freeze config objects when helpful.
`,
  workOrder: `1. literals + access + P01  
2. descriptors + P02  
3. shallow + P03  
4. Broken merge  
5. C01 + review`,
  nextModule: "10-prototypes",
});

// 10 Prototypes
moduleKit("10", "prototypes", {
  title: "Prototypes",
  difficulty: "★★★★☆",
  prereq: "09-objects",
  outcomes: [
    "Explain [[Prototype]] delegation",
    "Contrast `obj.__proto__` vs `Constructor.prototype`",
    "Use Object.create and getPrototypeOf",
    "Predict own vs inherited property lookup",
    "See classes as syntax over the same model (bridge to 11)",
  ],
  lessons: `# Lesson 1 — Delegation, not copying

## Concise explanation

If a property is missing on an object, the engine continues lookup on its prototype link.

## Experiment

\`experiments/01-delegation.js\` + [\`predictions/P01-delegate.md\`](./predictions/P01-delegate.md)

---

# Lesson 2 — \`prototype\` vs \`[[Prototype]]\`

## Concise explanation

- \`Fn.prototype\` — the object that will become \`[[Prototype]]\` of instances created with \`new Fn\`  
- \`obj.[[Prototype]]\` — the actual delegate link (\`Object.getPrototypeOf(obj)\`)

## Experiment

\`experiments/02-constructor.js\` + [\`predictions/P02-ctor.md\`](./predictions/P02-ctor.md)

---

# Lesson 3 — Object.create

## Concise explanation

Create an object with a chosen prototype (including \`null\` for a pure dictionary).

## Experiment

\`experiments/03-create.js\`

---

# Lesson 4 — Own vs inherited

## Experiment

\`experiments/04-own-vs-inherited.js\` + [\`predictions/P03-own.md\`](./predictions/P03-own.md)
`,
  experiments: {
    "01-delegation.js": `// 10-prototypes / 01-delegation.js
// PREDICT: predictions/P01-delegate.md
"use strict";

const proto = {
  greet() {
    return "hi " + this.name;
  },
};

const user = Object.create(proto);
user.name = "ada";
console.log(user.greet());
console.log(Object.getPrototypeOf(user) === proto);
console.log(user.hasOwnProperty("greet"));
`,
    "02-constructor.js": `// 10-prototypes / 02-constructor.js
// PREDICT: predictions/P02-ctor.md
"use strict";

function Person(name) {
  this.name = name;
}
Person.prototype.kind = "human";

const p = new Person("ada");
console.log(p.name, p.kind);
console.log(Object.getPrototypeOf(p) === Person.prototype);
console.log(p.constructor === Person);
`,
    "03-create.js": `// 10-prototypes / 03-create.js
"use strict";

const dict = Object.create(null);
dict.a = 1;
console.log(dict.a);
console.log("toString" in dict);
console.log(Object.getPrototypeOf(dict));
`,
    "04-own-vs-inherited.js": `// 10-prototypes / 04-own-vs-inherited.js
// PREDICT: predictions/P03-own.md
"use strict";

const p = { shared: true };
const o = Object.create(p);
o.own = true;

console.log("own" in o, "shared" in o);
console.log(Object.keys(o));
console.log(Object.hasOwn(o, "shared"));
for (const k in o) console.log("for-in", k);
`,
  },
  predictions: {
    "P01-delegate.md": makePred("10-prototypes", "P01", "delegation", "★★★☆☆", "01-delegation.js", `greet on proto, name on user`, "Where is greet found? Is it own?", "What is `this` inside greet?"),
    "P02-ctor.md": makePred("10-prototypes", "P02", "constructor.prototype", "★★★☆☆", "02-constructor.js", `new Person`, "What is [[Prototype]] of p?", "If you add Person.prototype.age, do existing instances see it?"),
    "P03-own.md": makePred("10-prototypes", "P03", "own vs inherited", "★★★☆☆", "04-own-vs-inherited.js", `in vs keys vs hasOwn`, "Which APIs see shared?", "Why are null-prototype objects used for dictionaries?"),
  },
  broken: [
    {
      file: "01-broken-proto-link.js",
      task: "Fix so dog.speak() works via prototype delegation",
      code: `// CONTRACT: dog.speak() → "woof"
// Run: node 10-prototypes/challenges/broken/01-broken-proto-link.js

"use strict";

const animal = {
  speak() {
    return "woof";
  },
};

const dog = {};
dog.__proto__ = null; // bug: wiped link — also avoid __proto__ in modern code
// intended: link dog to animal

try {
  console.log(dog.speak());
} catch (e) {
  console.log(e.name, e.message.split("\\n")[0]);
}
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-diagram.md",
      diff: "★★★★",
      body: `# C01 — Diagram

**Difficulty:** ★★★★☆

Draw:

\`\`\`text
instance ──[[Prototype]]──► Person.prototype ──► Object.prototype ──► null
\`\`\`

Label where \`constructor\` and a method you add live.
`,
    },
  ],
  solutions: {
    "01-broken-proto-link.md": `# Solution

\`\`\`js
const dog = Object.create(animal);
console.log(dog.speak());
\`\`\`

Prefer \`Object.setPrototypeOf\` / \`Object.create\` over \`__proto__\`.
`,
    "C01-diagram.md": `# Solution notes

Methods usually on \`Person.prototype\`; own data on instance; \`constructor\` points back to Person by default.
`,
  },
  review: `# Spaced review — 10 Prototypes

## Day 1
1. Delegation definition.
2. Fn.prototype vs [[Prototype]].
3. Object.create(null) purpose.

## Day 3
1. Predict own vs inherited for \`in\` / keys / hasOwn.
2. Fix a broken prototype link.

## Day 7 / 14 / 30
1. Teach prototypes without only saying “inheritance”.
2. Preview how \`class\` desugars.
`,
  knowledge: `### Deep Fact
Almost all ordinary objects eventually delegate to \`Object.prototype\` unless you cut the chain.

### Why This Works
One lookup model explains methods, inheritance, and many “weird” missing-property cases.

### Common Misconception
“\`__proto__\` is the real property you should set.” — Prefer \`getPrototypeOf\` / \`Object.create\`.

### Interview Insight
Explain prototype chain for \`new\` + method sharing.

### Production Insight
Don’t mutate built-in prototypes in shared apps.
`,
  workOrder: `1. delegation + P01  
2. constructor + create + P02  
3. own vs inherited + P03  
4. Broken link  
5. C01 + review`,
  nextModule: "11-classes",
});

// 11 Classes
moduleKit("11", "classes", {
  title: "Classes",
  difficulty: "★★★☆☆ (peaks at ★★★★)",
  prereq: "10-prototypes",
  outcomes: [
    "Treat `class` as syntax over prototypes",
    "Use constructor, methods, extends, super",
    "Predict prototype relationships for subclasses",
    "Know private fields exist (`#`) at a practical level",
    "Avoid class mythology that hides the prototype model",
  ],
  lessons: `# Lesson 1 — Class syntax, same engine model

## Concise explanation

\`class Foo {}\` creates a constructor function and puts methods on \`Foo.prototype\` (mostly).

## Experiment

\`experiments/01-class-basics.js\` + [\`predictions/P01-class.md\`](./predictions/P01-class.md)

---

# Lesson 2 — extends & super

## Concise explanation

\`extends\` wires the prototype chain. \`super\` in constructors calls the parent constructor; in methods it refers to the parent prototype’s method.

## Experiment

\`experiments/02-extends.js\` + [\`predictions/P02-extends.md\`](./predictions/P02-extends.md)

---

# Lesson 3 — Instance vs static

## Concise explanation

Instance methods live on the prototype. \`static\` methods hang on the constructor itself.

## Experiment

\`experiments/03-static.js\`

---

# Lesson 4 — Private fields teaser

## Concise explanation

\`#field\` is truly private to the class (not just underscore convention).

## Experiment

\`experiments/04-private.js\` + [\`predictions/P03-private.md\`](./predictions/P03-private.md)
`,
  experiments: {
    "01-class-basics.js": `// 11-classes / 01-class-basics.js
// PREDICT: predictions/P01-class.md
"use strict";

class Person {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return "hi " + this.name;
  }
}

const p = new Person("ada");
console.log(p.greet());
console.log(typeof Person);
console.log(Object.getPrototypeOf(p) === Person.prototype);
console.log(p.hasOwnProperty("greet"));
`,
    "02-extends.js": `// 11-classes / 02-extends.js
// PREDICT: predictions/P02-extends.md
"use strict";

class Animal {
  constructor(name) {
    this.name = name;
  }
  speak() {
    return "...";
  }
}

class Dog extends Animal {
  speak() {
    return "woof " + this.name;
  }
}

const d = new Dog("rex");
console.log(d.speak());
console.log(d instanceof Dog, d instanceof Animal);
console.log(Object.getPrototypeOf(Dog.prototype) === Animal.prototype);
`,
    "03-static.js": `// 11-classes / 03-static.js
"use strict";

class MathUtil {
  static double(n) {
    return n * 2;
  }
  triple(n) {
    return n * 3;
  }
}

console.log(MathUtil.double(4));
const m = new MathUtil();
console.log(m.triple(4));
try {
  console.log(m.double(4));
} catch (e) {
  console.log("instance.double →", e.name);
}
`,
    "04-private.js": `// 11-classes / 04-private.js
// PREDICT: predictions/P03-private.md
"use strict";

class Counter {
  #n = 0;
  inc() {
    this.#n += 1;
    return this.#n;
  }
}

const c = new Counter();
console.log(c.inc(), c.inc());
console.log("n" in c, c.n);
// NOTE: reading c.#n outside the class is a SyntaxError — do not uncomment.
console.log("private field is not visible as c.n →", c.n);
`,
  },
  predictions: {
    "P01-class.md": makePred("11-classes", "P01", "class desugar", "★★★☆☆", "01-class-basics.js", `typeof Person; greet own?`, "Is Person a function? Is greet own on instance?", "What does new do conceptually?"),
    "P02-extends.md": makePred("11-classes", "P02", "extends chain", "★★★☆☆", "02-extends.js", `instanceof + prototype parent`, "What is [[Prototype]] of Dog.prototype?", "If Animal.prototype.speak changes, do Dogs see it when not overridden?"),
    "P03-private.md": makePred("11-classes", "P03", "private fields", "★★☆☆☆", "04-private.js", `c.n vs #n`, "Can outside code read #n? (Would even parsing `c.#n` outside fail?)", "How is this different from _n convention?"),
  },
  broken: [
    {
      file: "01-broken-super.js",
      task: "Fix subclass constructor to call super before using this",
      code: `// CONTRACT: new Employee("ada", 1) works and prints ada
// Run: node 11-classes/challenges/broken/01-broken-super.js

"use strict";

class Person {
  constructor(name) {
    this.name = name;
  }
}

class Employee extends Person {
  constructor(name, id) {
    this.id = id; // bug: before super
    super(name);
  }
}

try {
  const e = new Employee("ada", 1);
  console.log(e.name, e.id);
} catch (err) {
  console.log(err.name, err.message.split("\\n")[0]);
}
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-desugar.md",
      diff: "★★★★",
      body: `# C01 — Desugar

**Difficulty:** ★★★★☆

Rewrite a tiny \`class Point { constructor(x,y){...} dist(){...} }\` as constructor + \`prototype\` assignments.

Prove \`Object.getPrototypeOf(instance) === Point.prototype\`.
`,
    },
  ],
  solutions: {
    "01-broken-super.md": `# Solution

Call \`super(name)\` **before** accessing \`this\` in the subclass constructor.
`,
    "C01-desugar.md": `# Solution sketch

\`\`\`js
function Point(x, y) { this.x = x; this.y = y; }
Point.prototype.dist = function () { /* ... */ };
\`\`\`
`,
  },
  review: `# Spaced review — 11 Classes

## Day 1
1. Class ≈ constructor + prototype methods.
2. extends wiring.
3. super-before-this rule.

## Day 3
1. static vs instance.
2. Private fields vs underscore.

## Day 7 / 14 / 30
1. Desugar a class cold.
2. Explain why prototype mental model still matters.
`,
  knowledge: `### Deep Fact
\`typeof Class\` is \`"function"\`. Classes are not a separate runtime type.

### Why This Works
Keeping the prototype model prevents cargo-cult OOP.

### Common Misconception
“Classes create a new inheritance system different from prototypes.” — Syntax over the same system.

### Interview Insight
super ordering; static vs prototype methods; private fields.

### Production Insight
Prefer composition when inheritance hierarchies get deep.
`,
  workOrder: `1. basics + P01  
2. extends + static + P02  
3. private + P03  
4. Broken super  
5. C01 + review`,
  nextModule: "12-arrays",
});

// 12 Arrays
moduleKit("12", "arrays", {
  title: "Arrays",
  difficulty: "★★★☆☆",
  prereq: "11-classes",
  outcomes: [
    "Distinguish dense vs sparse arrays",
    "Choose mutating vs non-mutating methods deliberately",
    "Use map / filter / reduce with accurate mental models",
    "Predict length behavior with holes and deletes",
    "Bridge array iteration to later iterator labs",
  ],
  lessons: `# Lesson 1 — Arrays are objects with length

## Concise explanation

Arrays are exotic objects specializing in numeric index keys + \`length\`. They are not a separate primitive type (\`typeof [] === "object"\`).

## Experiment

\`experiments/01-basics.js\` + [\`predictions/P01-basics.md\`](./predictions/P01-basics.md)

---

# Lesson 2 — Sparse arrays & holes

## Concise explanation

Holes are missing properties — not slots filled with \`undefined\`. Many methods skip holes; some do not.

## Experiment

\`experiments/02-sparse.js\` + [\`predictions/P02-sparse.md\`](./predictions/P02-sparse.md)

---

# Lesson 3 — Mutators vs non-mutators

## Concise explanation

\`push/pop/splice/sort\` mutate. \`map/filter/slice/concat/toSorted\` (modern) return new arrays.

## Experiment

\`experiments/03-mutate.js\`

---

# Lesson 4 — map / filter / reduce

## Concise explanation

- \`map\` — transform each element  
- \`filter\` — keep elements  
- \`reduce\` — accumulate  

## Experiment

\`experiments/04-mfr.js\` + [\`predictions/P03-mfr.md\`](./predictions/P03-mfr.md)
`,
  experiments: {
    "01-basics.js": `// 12-arrays / 01-basics.js
// PREDICT: predictions/P01-basics.md
"use strict";

const a = [10, 20, 30];
console.log(a.length, typeof a, Array.isArray(a));
a[5] = 50;
console.log("length after a[5]=", a.length);
console.log("a[3]", a[3]);
console.log("3" in a, "5" in a);
`,
    "02-sparse.js": `// 12-arrays / 02-sparse.js
// PREDICT: predictions/P02-sparse.md
"use strict";

const a = [];
a.length = 3;
console.log("keys", Object.keys(a));
console.log(
  "map",
  a.map(() => 1)
);

const b = [undefined, undefined, undefined];
console.log("b keys", Object.keys(b));
console.log(
  "b map",
  b.map(() => 1)
);
`,
    "03-mutate.js": `// 12-arrays / 03-mutate.js
"use strict";

const a = [3, 1, 2];
const sortedCopy = a.toSorted?.() ?? [...a].sort((x, y) => x - y);
console.log("copy", sortedCopy, "orig", a);
a.sort((x, y) => x - y);
console.log("mutated", a);

const b = [1, 2, 3];
const c = b.concat([4]);
console.log(b, c, b === c);
`,
    "04-mfr.js": `// 12-arrays / 04-mfr.js
// PREDICT: predictions/P03-mfr.md
"use strict";

const nums = [1, 2, 3, 4];
console.log(
  "map",
  nums.map((n) => n * 2)
);
console.log(
  "filter",
  nums.filter((n) => n % 2 === 0)
);
console.log(
  "reduce sum",
  nums.reduce((acc, n) => acc + n, 0)
);
console.log(
  "reduce build",
  nums.reduce((acc, n) => {
    acc[n] = n * n;
    return acc;
  }, {})
);
`,
  },
  predictions: {
    "P01-basics.md": makePred("12-arrays", "P01", "length & holes", "★★★☆☆", "01-basics.js", `a[5]=50 on length-3`, "What is length? Is index 3 present?", "typeof [] vs Array.isArray"),
    "P02-sparse.md": makePred("12-arrays", "P02", "sparse vs undefined", "★★★★☆", "02-sparse.js", `length=3 empty vs [undefined,undefined,undefined]`, "Do both map the same?", "When do holes matter in real code?"),
    "P03-mfr.md": makePred("12-arrays", "P03", "map filter reduce", "★★☆☆☆", "04-mfr.js", `reduce to object of squares`, "What is the initial value role in reduce?", "When is reduce the wrong tool?"),
  },
  broken: [
    {
      file: "01-broken-sum-sq.js",
      task: "Fix so sum of squares of evens for [1,2,3,4] is 20",
      code: `// CONTRACT: 2^2 + 4^2 = 20
// Run: node 12-arrays/challenges/broken/01-broken-sum-sq.js

"use strict";

function sumEvenSquares(arr) {
  return arr
    .filter((n) => n % 2 === 0)
    .map((n) => n * n)
    .reduce((a, b) => a + b); // bug: no init → throws on empty filter
}

console.log(sumEvenSquares([1, 2, 3, 4]));
console.log(sumEvenSquares([1, 3])); // expect 0
`,
    },
  ],
  challenges: [
    {
      id: "C01",
      file: "C01-chunk.md",
      diff: "★★★",
      body: `# C01 — chunk

**Difficulty:** ★★★☆☆

Implement \`chunk(arr, size)\` that splits into subarrays of length \`size\` (last may be shorter).

Predict \`chunk([1,2,3,4,5], 2)\`.
`,
    },
  ],
  solutions: {
    "01-broken-sum-sq.md": `# Solution

Provide \`reduce\` initial value \`0\`:

\`\`\`js
.reduce((a, b) => a + b, 0)
\`\`\`
`,
    "C01-chunk.md": `# Solution sketch

Loop with stride \`size\`, \`slice(i, i+size)\` into result.
`,
  },
  review: `# Spaced review — 12 Arrays

## Day 1
1. Arrays are objects — evidence.
2. Sparse vs undefined-filled.
3. Mutating sort vs toSorted/copy.

## Day 3
1. map/filter/reduce pipeline.
2. Empty reduce without init.

## Day 7 / 14 / 30
1. Implement chunk cold.
2. Proceed to iterators (13) when ready — still scaffold until later phases.
`,
  knowledge: `### Deep Fact
\`length\` is more than a count — assigning to it can create holes or truncate.

### Why This Works
Knowing mutators vs copies prevents accidental shared-state bugs.

### Common Misconception
“Holes are undefined elements.” — Missing properties ≠ present undefined.

### Interview Insight
Implement map/filter/reduce; discuss sparsity; complexity of methods.

### Production Insight
Prefer non-mutating updates in UI state; beware \`sort\` in place.
`,
  workOrder: `1. basics + P01  
2. sparse + mutate + P02  
3. mfr + P03  
4. Broken sum sq  
5. C01 + review`,
  nextModule: "13-iterators",
});

console.log("Wrote 09–12");
