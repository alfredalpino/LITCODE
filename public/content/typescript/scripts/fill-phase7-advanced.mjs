import { moduleKit, expHeader, makePred, knowledgeBox } from "./phase7-kit.mjs";

/** Type operators: 17–23, 26 */
export function fillAdvanced() {
  moduleKit({
    id: "17",
    slug: "keyof",
    title: "keyof",
    difficulty: "★★★☆☆",
    prereq: "16-generic-patterns",
    nextModule: "18-typeof",
    coreQuestion: "How does `keyof` produce key unions for safe property access?",
    outcomes: [
      "Compute `keyof T` for object types",
      "Combine with generics for safe getters/setters",
      "Predict keyof for unions and index signatures",
    ],
    lessons: `# Lesson 1 — Key unions

\`experiments/01-keyof.ts\` · [\`predictions/P01-keys.md\`](./predictions/P01-keys.md)

# Lesson 2 — Safe get/set

\`experiments/02-safe-access.ts\` · [\`predictions/P02-set.md\`](./predictions/P02-set.md)

# Lesson 3 — keyof pitfalls

\`experiments/03-pitfalls.ts\`
`,
    experiments: {
      "01-keyof.ts": `${expHeader("17-keyof", "keyof")}
type User = { id: string; name: string; age: number };
type UserKey = keyof User;
const keys: UserKey[] = ["id", "name", "age"];
console.log(keys);
export {};
`,
      "02-safe-access.ts": `${expHeader("17-keyof", "safe access")}
function get<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
function set<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}
const u = { id: "1", score: 10 };
console.log(get(u, "score"));
set(u, "score", 11);
console.log(u);
export {};
`,
      "03-pitfalls.ts": `${expHeader("17-keyof", "pitfalls")}
type A = { a: 1 };
type B = { b: 2 };
type U = A | B;
type KU = keyof U; // "a" & "b" → never for disjoint — actually intersection of keys
console.log("keyof union is intersection of keys (often surprising)");
type Both = A & B;
type KB = keyof Both;
const _k: KB = "a";
console.log(_k);
export {};
`,
    },
    predictions: {
      "P01-keys.md": makePred(
        "17-keyof",
        "P01",
        "UserKey",
        "★★",
        "01-keyof.ts",
        `type UserKey = keyof { id: string; name: string };`,
        "What is UserKey?"
      ),
      "P02-set.md": makePred(
        "17-keyof",
        "P02",
        "set typing",
        "★★★",
        "02-safe-access.ts",
        `set(u, "score", "nope")`,
        "Why does the third argument fail when key is `score`?"
      ),
    },
    broken: [
      {
        file: "01-string-key.ts",
        task: "Stop using bare string keys",
        code: `${expHeader("17-keyof", "string key")}
function read(obj: Record<string, number>, key: string) {
  return obj[key];
}
console.log(read({ a: 1 }, "b"));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-pick-keys.md",
        diff: "★★★",
        body: `# C01\n\nWrite \`function pick<T, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>\`.\n`,
      },
    ],
    solutions: {
      "01-string-key.fixed.ts": `function read<T extends Record<string, number>, K extends keyof T>(obj: T, key: K) {\n  return obj[key];\n}\nconsole.log(read({ a: 1 }, "a"));\nexport {};\n`,
      "C01-hints.md": `Reduce keys into a partial then assert Pick, or build via loop with typed result.\n`,
    },
    review: `# Review — 17\n\nkeyof · K extends keyof T · union keyof surprise\n`,
    knowledge: knowledgeBox({
      deep: "`keyof` of a union is the intersection of keys.",
      why: "Key unions enable typed dynamic access.",
      misconception: "`keyof` returns a runtime array of keys.",
      interview: "Implement typed get/set.",
      production: "Prefer keyof over `string` for known object maps.",
    }),
    workOrder: "1 keyof · 2 safe access · 3 pitfalls · 4 broken · 5 C01",
  });

  moduleKit({
    id: "18",
    slug: "typeof",
    title: "typeof Types",
    difficulty: "★★★☆☆",
    prereq: "17-keyof",
    nextModule: "19-indexed-access",
    coreQuestion: "How does `typeof` in type position capture value shapes?",
    outcomes: [
      "Use `typeof value` in type positions",
      "Derive types from const configs",
      "Contrast typeof operator (value) vs typeof type query",
    ],
    lessons: `# Lesson 1 — Type queries

\`experiments/01-typeof.ts\` · [\`predictions/P01-cfg.md\`](./predictions/P01-cfg.md)

# Lesson 2 — Config derivation

\`experiments/02-config.ts\` · [\`predictions/P02-keys.md\`](./predictions/P02-keys.md)

# Lesson 3 — ReturnType preview

\`experiments/03-return-type.ts\`
`,
    experiments: {
      "01-typeof.ts": `${expHeader("18-typeof", "typeof")}
const user = { id: "1", name: "Ada" };
type User = typeof user;
const u: User = { id: "2", name: "Grace" };
console.log(u);
export {};
`,
      "02-config.ts": `${expHeader("18-typeof", "config")}
const config = {
  apiUrl: "https://example.test",
  retries: 3,
} as const;
type Config = typeof config;
type ConfigKey = keyof Config;
console.log((Object.keys(config) as ConfigKey[]).join(","));
export {};
`,
      "03-return-type.ts": `${expHeader("18-typeof", "ReturnType")}
function makeUser() {
  return { id: "1", active: true };
}
type User = ReturnType<typeof makeUser>;
const u: User = { id: "2", active: false };
console.log(u);
export {};
`,
    },
    predictions: {
      "P01-cfg.md": makePred(
        "18-typeof",
        "P01",
        "typeof object",
        "★★",
        "01-typeof.ts",
        `const user = { id: "1", name: "Ada" };\ntype User = typeof user;`,
        "What fields does User have?"
      ),
      "P02-keys.md": makePred(
        "18-typeof",
        "P02",
        "as const config",
        "★★★",
        "02-config.ts",
        `const config = { retries: 3 } as const;\ntype R = typeof config.retries;`,
        "Is R `number` or `3`?"
      ),
    },
    broken: [
      {
        file: "01-duplicate-type.ts",
        task: "Derive the type from the value instead of duplicating",
        code: `${expHeader("18-typeof", "duplicate")}
const defaults = { theme: "dark", locale: "en" };
type Defaults = { theme: string; locale: string };
const d: Defaults = defaults;
console.log(d);
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-fn-typeof.md",
        diff: "★★",
        body: `# C01\n\nGiven a function value, derive its parameter types with \`Parameters<typeof fn>\` and log them conceptually in a comment + use one.\n`,
      },
    ],
    solutions: {
      "01-duplicate-type.fixed.ts": `const defaults = { theme: "dark", locale: "en" } as const;\ntype Defaults = typeof defaults;\nconst d: Defaults = defaults;\nconsole.log(d);\nexport {};\n`,
      "C01-hints.md": `type P = Parameters<typeof fn>;\n`,
    },
    review: `# Review — 18\n\ntypeof type query · as const · ReturnType\n`,
    knowledge: knowledgeBox({
      deep: "Value-space `typeof` ≠ type-query `typeof` — same keyword, different spaces.",
      why: "Single source of truth: values drive types.",
      misconception: "`typeof` always returns a string at compile time.",
      interview: "Derive a type from a const object.",
      production: "Config objects + typeof + keyof for typed settings.",
    }),
    workOrder: "1 typeof · 2 config · 3 ReturnType · 4 broken · 5 C01",
  });

  moduleKit({
    id: "19",
    slug: "indexed-access",
    title: "Indexed Access Types",
    difficulty: "★★★☆☆",
    prereq: "18-typeof",
    nextModule: "20-mapped-types",
    coreQuestion: "How does `T[K]` extract property types — including from unions of keys?",
    outcomes: [
      "Use `T[K]` and `T[keyof T]`",
      "Extract nested property types",
      "Combine with generics for pluck-style APIs",
    ],
    lessons: `# Lesson 1 — T[K]

\`experiments/01-index.ts\` · [\`predictions/P01-idx.md\`](./predictions/P01-idx.md)

# Lesson 2 — Unions of keys

\`experiments/02-key-union.ts\` · [\`predictions/P02-union.md\`](./predictions/P02-union.md)

# Lesson 3 — Nested

\`experiments/03-nested.ts\`
`,
    experiments: {
      "01-index.ts": `${expHeader("19-indexed-access", "T[K]")}
type User = { id: string; age: number };
type Id = User["id"];
type Age = User["age"];
const id: Id = "u1";
const age: Age = 30;
console.log(id, age);
export {};
`,
      "02-key-union.ts": `${expHeader("19-indexed-access", "key union")}
type User = { id: string; age: number; name: string };
type IdOrName = User["id" | "name"];
const x: IdOrName = "Ada";
console.log(x);
export {};
`,
      "03-nested.ts": `${expHeader("19-indexed-access", "nested")}
type Api = { data: { user: { email: string } } };
type Email = Api["data"]["user"]["email"];
const e: Email = "a@b.co";
console.log(e);
export {};
`,
    },
    predictions: {
      "P01-idx.md": makePred(
        "19-indexed-access",
        "P01",
        "User[id]",
        "★★",
        "01-index.ts",
        `type Id = { id: string; age: number }["id"];`,
        "What is Id?"
      ),
      "P02-union.md": makePred(
        "19-indexed-access",
        "P02",
        "Key union index",
        "★★★",
        "02-key-union.ts",
        `type X = { a: string; b: number }["a" | "b"];`,
        "What is X?"
      ),
    },
    broken: [
      {
        file: "01-hardcoded.ts",
        task: "Derive the field type via indexed access",
        code: `${expHeader("19-indexed-access", "hardcoded")}
type User = { id: string; role: "admin" | "user" };
function setRole(role: string) {
  console.log(role);
}
setRole("nope");
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-value-union.md",
        diff: "★★",
        body: `# C01\n\nFor \`type Cat = { name: string; age: number }\`, what is \`Cat[keyof Cat]\`? Prove with a variable.\n`,
      },
    ],
    solutions: {
      "01-hardcoded.fixed.ts": `type User = { id: string; role: "admin" | "user" };\nfunction setRole(role: User["role"]) {\n  console.log(role);\n}\nsetRole("admin");\nexport {};\n`,
      "C01-hints.md": `Cat[keyof Cat] = string | number.\n`,
    },
    review: `# Review — 19\n\nT[K] · key unions · nested paths\n`,
    knowledge: knowledgeBox({
      deep: "Indexing with a key union distributes into a value union.",
      why: "Keep field types DRY with the source object type.",
      misconception: "`T[K]` requires K to be a string literal only.",
      interview: "Extract a nested API response field type.",
      production: "Prefer indexed access over copy-pasted field types.",
    }),
    workOrder: "1 index · 2 key union · 3 nested · 4 broken · 5 C01",
  });

  moduleKit({
    id: "20",
    slug: "mapped-types",
    title: "Mapped Types",
    difficulty: "★★★★☆",
    prereq: "19-indexed-access",
    nextModule: "21-conditional-types",
    coreQuestion: "How do mapped types transform every property of a type?",
    outcomes: [
      "Write `{ [K in keyof T]: ... }` maps",
      "Apply readonly/optional modifiers via mapping",
      "Use key remapping (`as`) at a basic level",
    ],
    lessons: `# Lesson 1 — Basic maps

\`experiments/01-mapped.ts\` · [\`predictions/P01-opt.md\`](./predictions/P01-opt.md)

# Lesson 2 — Modifiers

\`experiments/02-modifiers.ts\`

# Lesson 3 — Remapping preview

\`experiments/03-remap.ts\` · [\`predictions/P02-remap.md\`](./predictions/P02-remap.md)
`,
    experiments: {
      "01-mapped.ts": `${expHeader("20-mapped-types", "mapped")}
type Optional<T> = { [K in keyof T]?: T[K] };
type User = { id: string; name: string };
type UserPatch = Optional<User>;
const patch: UserPatch = { name: "Ada" };
console.log(patch);
export {};
`,
      "02-modifiers.ts": `${expHeader("20-mapped-types", "modifiers")}
type ReadonlyDeepish<T> = { readonly [K in keyof T]: T[K] };
type Mutable<T> = { -readonly [K in keyof T]: T[K] };
type R = ReadonlyDeepish<{ a: number }>;
type M = Mutable<Readonly<{ a: number }>>;
const r: R = { a: 1 };
const m: M = { a: 2 };
m.a = 3;
console.log(r, m);
export {};
`,
      "03-remap.ts": `${expHeader("20-mapped-types", "remap")}
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type User = { name: string };
type UserGetters = Getters<User>;
const g: UserGetters = {
  getName: () => "Ada",
};
console.log(g.getName());
export {};
`,
    },
    predictions: {
      "P01-opt.md": makePred(
        "20-mapped-types",
        "P01",
        "Optional map",
        "★★★",
        "01-mapped.ts",
        `type Optional<T> = { [K in keyof T]?: T[K] };`,
        "How does this differ from Partial<T>?"
      ),
      "P02-remap.md": makePred(
        "20-mapped-types",
        "P02",
        "getName",
        "★★★★",
        "03-remap.ts",
        `type Getters<T> = { [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K] };`,
        "What key appears for `{ name: string }`?"
      ),
    },
    broken: [
      {
        file: "01-manual-partial.ts",
        task: "Replace hand-written optional fields with a mapped type",
        code: `${expHeader("20-mapped-types", "manual partial")}
type User = { id: string; name: string; email: string };
type UserPatch = { id?: string; name?: string; email?: string };
const p: UserPatch = { email: "a@b.co" };
console.log(p);
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-nullable.md",
        diff: "★★★",
        body: `# C01\n\nImplement \`type NullableProps<T> = { [K in keyof T]: T[K] | null }\`.\n`,
      },
    ],
    solutions: {
      "01-manual-partial.fixed.ts": `type User = { id: string; name: string; email: string };\ntype UserPatch = { [K in keyof User]?: User[K] };\nconst p: UserPatch = { email: "a@b.co" };\nconsole.log(p);\nexport {};\n`,
      "C01-hints.md": `Map each property to T[K] | null.\n`,
    },
    review: `# Review — 20\n\nmapped keys · +/- modifiers · remapping\n`,
    knowledge: knowledgeBox({
      deep: "Mapped types are the engine behind Partial, Readonly, Pick helpers.",
      why: "Transform shapes systematically instead of rewriting fields.",
      misconception: "Mapped types run at runtime over objects.",
      interview: "Implement Partial via mapping.",
      production: "Use maps for DTO ↔ domain field transforms.",
    }),
    workOrder: "1 mapped · 2 modifiers · 3 remap · 4 broken · 5 C01",
  });

  moduleKit({
    id: "21",
    slug: "conditional-types",
    title: "Conditional Types",
    difficulty: "★★★★☆",
    prereq: "20-mapped-types",
    nextModule: "22-infer",
    coreQuestion: "How does `T extends U ? X : Y` branch on types?",
    outcomes: [
      "Write basic conditional types",
      "See distributive conditionals over unions",
      "Use conditionals for API capability types",
    ],
    lessons: `# Lesson 1 — Basics

\`experiments/01-conditional.ts\` · [\`predictions/P01-cond.md\`](./predictions/P01-cond.md)

# Lesson 2 — Distribution

\`experiments/02-distributive.ts\` · [\`predictions/P02-dist.md\`](./predictions/P02-dist.md)

# Lesson 3 — Practical filter

\`experiments/03-extract-preview.ts\`
`,
    experiments: {
      "01-conditional.ts": `${expHeader("21-conditional-types", "conditional")}
type IsString<T> = T extends string ? true : false;
type A = IsString<"hi">;
type B = IsString<42>;
const a: A = true;
const b: B = false;
console.log(a, b);
export {};
`,
      "02-distributive.ts": `${expHeader("21-conditional-types", "distributive")}
type ToArray<T> = T extends unknown ? T[] : never;
type X = ToArray<string | number>; // string[] | number[]
const samples: X = ["a"];
console.log(samples);
export {};
`,
      "03-extract-preview.ts": `${expHeader("21-conditional-types", "extract")}
type OnlyString<T> = T extends string ? T : never;
type S = OnlyString<string | number | boolean>;
const s: S = "ok";
console.log(s);
export {};
`,
    },
    predictions: {
      "P01-cond.md": makePred(
        "21-conditional-types",
        "P01",
        "IsString",
        "★★★",
        "01-conditional.ts",
        `type IsString<T> = T extends string ? true : false;\ntype A = IsString<"hi">;`,
        "What is A?"
      ),
      "P02-dist.md": makePred(
        "21-conditional-types",
        "P02",
        "Distribution",
        "★★★★",
        "02-distributive.ts",
        `type ToArray<T> = T extends unknown ? T[] : never;\ntype X = ToArray<string | number>;`,
        "Why is X a union of arrays?"
      ),
    },
    broken: [
      {
        file: "01-non-dist.ts",
        task: "Explain/fix wrapping to control distribution (tuple wrap)",
        code: `${expHeader("21-conditional-types", "non-dist")}
type ToArray<T> = T extends unknown ? T[] : never;
type Wanted = (string | number)[]; // one array type
type Got = ToArray<string | number>; // distributed
console.log("Wanted vs Got — see comments / tsc");
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-non-null.md",
        diff: "★★★",
        body: `# C01\n\nImplement \`type NonNullable<T> = T extends null | undefined ? never : T\`.\n`,
      },
    ],
    solutions: {
      "01-non-dist.fixed.ts": `type ToArrayFlat<T> = [T] extends [unknown] ? T[] : never;\ntype Got = ToArrayFlat<string | number>; // (string | number)[]\nconst x: Got = ["a", 1];\nconsole.log(x);\nexport {};\n`,
      "C01-hints.md": `That's the library NonNullable pattern.\n`,
    },
    review: `# Review — 21\n\nconditional · distributive · Extract-like filters\n`,
    knowledge: knowledgeBox({
      deep: "Naked type params in conditionals distribute over unions.",
      why: "Branching types enable Extract/Exclude/ReturnType family.",
      misconception: "Conditionals execute at runtime.",
      interview: "Explain distributive conditional types.",
      production: "Reach for conditionals when unions must map differently.",
    }),
    workOrder: "1 basics · 2 distributive · 3 extract · 4 broken · 5 C01",
  });

  moduleKit({
    id: "22",
    slug: "infer",
    title: "infer",
    difficulty: "★★★★☆",
    prereq: "21-conditional-types",
    nextModule: "23-template-literal-types",
    coreQuestion: "How does `infer` extract pieces of types inside conditionals?",
    outcomes: [
      "Use `infer` in conditional types",
      "Rebuild ReturnType / Parameters sketches",
      "Extract Promise payload with Awaited-style infer",
    ],
    lessons: `# Lesson 1 — infer basics

\`experiments/01-infer.ts\` · [\`predictions/P01-ret.md\`](./predictions/P01-ret.md)

# Lesson 2 — Parameters

\`experiments/02-parameters.ts\`

# Lesson 3 — Promise payload

\`experiments/03-awaited.ts\` · [\`predictions/P02-await.md\`](./predictions/P02-await.md)
`,
    experiments: {
      "01-infer.ts": `${expHeader("22-infer", "infer return")}
type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;
type R = MyReturn<() => number>;
const r: R = 1;
console.log(r);
export {};
`,
      "02-parameters.ts": `${expHeader("22-infer", "parameters")}
type MyParams<T> = T extends (...args: infer P) => unknown ? P : never;
type P = MyParams<(a: string, b: number) => void>;
const p: P = ["x", 1];
console.log(p);
export {};
`,
      "03-awaited.ts": `${expHeader("22-infer", "awaited")}
type MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;
type A = MyAwaited<Promise<Promise<string>>>;
const a: A = "done";
console.log(a);
export {};
`,
    },
    predictions: {
      "P01-ret.md": makePred(
        "22-infer",
        "P01",
        "MyReturn",
        "★★★",
        "01-infer.ts",
        `type MyReturn<T> = T extends (...args: never[]) => infer R ? R : never;`,
        "What does `infer R` bind?"
      ),
      "P02-await.md": makePred(
        "22-infer",
        "P02",
        "Nested Promise",
        "★★★★",
        "03-awaited.ts",
        `type A = MyAwaited<Promise<Promise<string>>>;`,
        "What is A?"
      ),
    },
    broken: [
      {
        file: "01-any-unpack.ts",
        task: "Unpack promise type with infer instead of any",
        code: `${expHeader("22-infer", "any unpack")}
async function load(): Promise<{ id: string }> {
  return { id: "1" };
}
type Payload = any;
const demo: Payload = { id: "1" };
console.log(demo);
void load;
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-head.md",
        diff: "★★★★",
        body: `# C01\n\nImplement \`type Head<T> = T extends [infer H, ...unknown[]] ? H : never\`.\n`,
      },
    ],
    solutions: {
      "01-any-unpack.fixed.ts": `async function load(): Promise<{ id: string }> {\n  return { id: "1" };\n}\ntype Payload = MyAwaited<ReturnType<typeof load>>;\ntype MyAwaited<T> = T extends Promise<infer U> ? MyAwaited<U> : T;\nconst demo: Payload = { id: "1" };\nconsole.log(demo);\nvoid load;\nexport {};\n`,
      "C01-hints.md": `Tuple infer with rest.\n`,
    },
    review: `# Review — 22\n\ninfer R · Parameters · Awaited recursion\n`,
    knowledge: knowledgeBox({
      deep: "`infer` introduces a type variable in the true branch of a conditional.",
      why: "Unpack nested structures for libraries and utilities.",
      misconception: "`infer` works outside conditional types.",
      interview: "Reimplement ReturnType.",
      production: "Prefer built-in Awaited/ReturnType unless teaching or specializing.",
    }),
    workOrder: "1 infer return · 2 params · 3 awaited · 4 broken · 5 C01",
  });

  moduleKit({
    id: "23",
    slug: "template-literal-types",
    title: "Template Literal Types",
    difficulty: "★★★★☆",
    prereq: "22-infer",
    nextModule: "24-recursive-types",
    coreQuestion: "How do template literal types build string APIs at the type level?",
    outcomes: [
      "Compose string literal types with templates",
      "Use Capitalize / Uppercase helpers",
      "Model event names and routes from parts",
    ],
    lessons: `# Lesson 1 — Templates

\`experiments/01-template.ts\` · [\`predictions/P01-tpl.md\`](./predictions/P01-tpl.md)

# Lesson 2 — Intrinsic string manipulators

\`experiments/02-intrinsic.ts\`

# Lesson 3 — Event names

\`experiments/03-events.ts\` · [\`predictions/P02-on.md\`](./predictions/P02-on.md)
`,
    experiments: {
      "01-template.ts": `${expHeader("23-template-literal-types", "template")}
type World = "world";
type Hello = \`hello-\${World}\`;
const h: Hello = "hello-world";
console.log(h);
export {};
`,
      "02-intrinsic.ts": `${expHeader("23-template-literal-types", "intrinsic")}
type Prop = "name";
type Getter = \`get\${Capitalize<Prop>}\`;
const g: Getter = "getName";
console.log(g);
export {};
`,
      "03-events.ts": `${expHeader("23-template-literal-types", "events")}
type Base = "click" | "focus";
type HandlerName = \`on\${Capitalize<Base>}\`;
const names: HandlerName[] = ["onClick", "onFocus"];
console.log(names.join(","));
export {};
`,
    },
    predictions: {
      "P01-tpl.md": makePred(
        "23-template-literal-types",
        "P01",
        "hello-world",
        "★★★",
        "01-template.ts",
        `type Hello = \`hello-\${"world"}\`;`,
        "What string literal is Hello?"
      ),
      "P02-on.md": makePred(
        "23-template-literal-types",
        "P02",
        "HandlerName",
        "★★★",
        "03-events.ts",
        `type HandlerName = \`on\${Capitalize<"click" | "focus">}\`;`,
        "What is the union?"
      ),
    },
    broken: [
      {
        file: "01-open-string.ts",
        task: "Constrain route strings with templates",
        code: `${expHeader("23-template-literal-types", "open string")}
function go(path: string) {
  console.log(path);
}
go("/not-api");
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-css-var.md",
        diff: "★★★",
        body: `# C01\n\nType CSS variables as \`--\${string}\` and a function \`setVar(name, value)\`.\n`,
      },
    ],
    solutions: {
      "01-open-string.fixed.ts": `type ApiPath = \`/api/\${string}\`;\nfunction go(path: ApiPath) {\n  console.log(path);\n}\ngo("/api/users");\nexport {};\n`,
      "C01-hints.md": `type CssVar = \`--\${string}\`;\n`,
    },
    review: `# Review — 23\n\ntemplates · Capitalize · patterned strings\n`,
    knowledge: knowledgeBox({
      deep: "Template literals distribute over unions in interpolations.",
      why: "Stringly APIs gain autocomplete and typo checking.",
      misconception: "Template types validate arbitrary runtime strings beyond patterns.",
      interview: "Type `onClick`/`onFocus` from event names.",
      production: "Great for routes, CSS vars, event prop names.",
    }),
    workOrder: "1 template · 2 intrinsic · 3 events · 4 broken · 5 C01",
  });

  moduleKit({
    id: "26",
    slug: "utility-types",
    title: "Utility Types",
    difficulty: "★★★☆☆",
    prereq: "23-template-literal-types",
    nextModule: "29-enums",
    coreQuestion: "Can you reimplement and correctly choose Partial, Pick, Omit, Record, Readonly?",
    outcomes: [
      "Use Partial / Required / Readonly / Pick / Omit / Record / Exclude / Extract",
      "Reimplement 2–3 utilities via mapped/conditional types",
      "Choose utilities over hand-rolled duplicates",
    ],
    lessons: `# Lesson 1 — Everyday utilities

\`experiments/01-everyday.ts\` · [\`predictions/P01-pick.md\`](./predictions/P01-pick.md)

# Lesson 2 — Reimplement Partial & Pick

\`experiments/02-reimplement.ts\` · [\`predictions/P02-partial.md\`](./predictions/P02-partial.md)

# Lesson 3 — Exclude / Extract

\`experiments/03-exclude-extract.ts\`
`,
    experiments: {
      "01-everyday.ts": `${expHeader("26-utility-types", "everyday")}
type User = { id: string; name: string; email: string };
type UserPatch = Partial<User>;
type UserPreview = Pick<User, "id" | "name">;
type UserSecure = Omit<User, "email">;
type Roles = Record<"admin" | "user", boolean>;
const patch: UserPatch = { email: "a@b.co" };
const preview: UserPreview = { id: "1", name: "Ada" };
const secure: UserSecure = { id: "1", name: "Ada" };
const roles: Roles = { admin: true, user: false };
console.log(patch, preview, secure, roles);
export {};
`,
      "02-reimplement.ts": `${expHeader("26-utility-types", "reimplement")}
type MyPartial<T> = { [K in keyof T]?: T[K] };
type MyPick<T, K extends keyof T> = { [P in K]: T[P] };
type U = { a: number; b: string };
const p: MyPartial<U> = { a: 1 };
const k: MyPick<U, "b"> = { b: "x" };
console.log(p, k);
export {};
`,
      "03-exclude-extract.ts": `${expHeader("26-utility-types", "exclude extract")}
type T = "a" | "b" | "c";
type WithoutB = Exclude<T, "b">;
type OnlyA = Extract<T, "a" | "z">;
const x: WithoutB = "a";
const y: OnlyA = "a";
console.log(x, y);
export {};
`,
    },
    predictions: {
      "P01-pick.md": makePred(
        "26-utility-types",
        "P01",
        "Pick",
        "★★",
        "01-everyday.ts",
        `type UserPreview = Pick<{ id: string; email: string }, "id">;`,
        "What fields remain?"
      ),
      "P02-partial.md": makePred(
        "26-utility-types",
        "P02",
        "MyPartial",
        "★★★",
        "02-reimplement.ts",
        `type MyPartial<T> = { [K in keyof T]?: T[K] };`,
        "How does this relate to library Partial?"
      ),
    },
    broken: [
      {
        file: "01-wrong-omit.ts",
        task: "Use Omit correctly so password is removed from the public type",
        code: `${expHeader("26-utility-types", "wrong omit")}
type User = { id: string; password: string };
type PublicUser = User;
function toPublic(u: User): PublicUser {
  return u;
}
console.log(toPublic({ id: "1", password: "secret" }));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-my-readonly.md",
        diff: "★★★",
        body: `# C01\n\nImplement \`type MyReadonly<T> = { readonly [K in keyof T]: T[K] }\` and show assignment failure on mutation (comment).\n`,
      },
    ],
    solutions: {
      "01-wrong-omit.fixed.ts": `type User = { id: string; password: string };\ntype PublicUser = Omit<User, "password">;\nfunction toPublic(u: User): PublicUser {\n  const { password: _p, ...pub } = u;\n  return pub;\n}\nconsole.log(toPublic({ id: "1", password: "secret" }));\nexport {};\n`,
      "C01-hints.md": `Mapped readonly modifier.\n`,
    },
    review: `# Review — 26\n\nPartial/Pick/Omit/Record · reimplement · Exclude/Extract\n`,
    knowledge: knowledgeBox({
      deep: "Most utilities are thin wrappers over mapped/conditional types.",
      why: "Shared vocabulary across codebases and docs.",
      misconception: "Omit removes the field at runtime automatically.",
      interview: "Implement Pick and Omit.",
      production: "Prefer utilities; document when you need custom maps.",
    }),
    workOrder: "1 everyday · 2 reimplement · 3 exclude/extract · 4 broken · 5 C01",
  });

  console.log("Advanced 17–23, 26 written.");
}
