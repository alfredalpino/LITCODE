import {
  moduleKit,
  scaffoldModule,
  expHeader,
  makePred,
  knowledgeBox,
} from "./phase7-kit.mjs";

/** Fundamentals + structural + generics: 04–16 */
export function fillFundamentals() {
  // ─── 04 Functions ─────────────────────────────────────────────────────
  moduleKit({
    id: "04",
    slug: "functions",
    title: "Function Types",
    difficulty: "★★☆☆☆",
    prereq: "03-type-inference",
    nextModule: "05-objects",
    coreQuestion:
      "How do you type parameters, returns, callbacks, and higher-order functions without lying?",
    outcomes: [
      "Annotate parameters and return types at API boundaries",
      "Write callable type aliases vs inline function types",
      "Type callbacks and higher-order functions",
      "Explain optional / default / rest at the type level",
      "Avoid `Function` and implicit `any` in APIs",
    ],
    lessons: `# Lesson 1 — Parameter & return annotations

Annotate **boundaries**. Let inference handle obvious locals.

\`experiments/01-params-returns.ts\` · [\`predictions/P01-callback.md\`](./predictions/P01-callback.md)

# Lesson 2 — Function type positions

\`(x: number) => string\` is a type. Name it when reused.

\`experiments/02-function-types.ts\`

# Lesson 3 — Higher-order functions

Feel the need for generics before module 14 solves it cleanly.

\`experiments/03-hof.ts\` · [\`predictions/P02-hof.md\`](./predictions/P02-hof.md)

# Lesson 4 — Optional, default, rest

Optional ⇒ \`T | undefined\` in types. Defaults are runtime. Rest is a typed array.

\`experiments/04-optional-rest.ts\`
`,
    experiments: {
      "01-params-returns.ts": `${expHeader("04-functions", "params & returns")}
function add(a: number, b: number): number {
  return a + b;
}
function logLabel(label: string): void {
  console.log("label:", label);
}
const greet = (name: string): string => \`hello, \${name}\`;
console.log(add(2, 3));
logLabel(greet("lab"));
// add("2", 3); // tsc error
export {};
`,
      "02-function-types.ts": `${expHeader("04-functions", "function type aliases")}
type Mapper = (n: number) => number;
type Predicate = (n: number) => boolean;
const double: Mapper = (n) => n * 2;
const isEven: Predicate = (n) => n % 2 === 0;
function applyAll(values: number[], map: Mapper, keep: Predicate): number[] {
  return values.map(map).filter(keep);
}
console.log(applyAll([1, 2, 3, 4], double, isEven));
const bad: Function = double;
console.log("Function erases arity:", typeof bad);
export {};
`,
      "03-hof.ts": `${expHeader("04-functions", "higher-order once")}
function once<T extends (...args: never[]) => unknown>(fn: T): T {
  let called = false;
  let result: ReturnType<T>;
  return ((...args: Parameters<T>) => {
    if (!called) {
      called = true;
      result = fn(...args) as ReturnType<T>;
    }
    return result;
  }) as T;
}
const init = once(() => {
  console.log("init ran");
  return 42;
});
console.log(init(), init());
export {};
`,
      "04-optional-rest.ts": `${expHeader("04-functions", "optional default rest")}
function buildUrl(path: string, query?: string, ...segments: string[]): string {
  const base = segments.length ? \`/\${segments.join("/")}\${path}\` : path;
  return query ? \`\${base}?\${query}\` : base;
}
function pad(n: number, width = 2): string {
  return String(n).padStart(width, "0");
}
console.log(buildUrl("/items", "q=ts", "api", "v1"));
console.log(pad(7), pad(7, 4));
export {};
`,
    },
    predictions: {
      "P01-callback.md": makePred(
        "04-functions",
        "P01",
        "Callback typing",
        "★★",
        "01-params-returns.ts",
        `const nums = [1, 2, 3];\nnums.map((n) => n.toFixed(1));`,
        "What type is inferred for `n`? Why does contextual typing matter?"
      ),
      "P02-hof.md": makePred(
        "04-functions",
        "P02",
        "once() calls",
        "★★★",
        "03-hof.ts",
        `const init = once(() => { console.log("init ran"); return 42; });\nconsole.log(init(), init());`,
        "How many times does `init ran` print?"
      ),
    },
    broken: [
      {
        file: "01-loose-callback.ts",
        task: "Replace `Function` so wrong arity becomes a type error",
        code: `${expHeader("04-functions", "loose callback")}
function runTwice(fn: Function) {
  fn();
  fn("oops");
}
runTwice((x: number) => console.log(x.toFixed(2)));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-type-the-api.md",
        diff: "★★★",
        body: `# C01 — Type the API\n\nImplement \`createPipe(...fns)\` for number→number steps. No \`any\`. Explain when generics become necessary.\n`,
      },
    ],
    solutions: {
      "01-loose-callback.fixed.ts": `type ZeroArg = () => void;\nfunction runTwice(fn: ZeroArg) { fn(); fn(); }\nrunTwice(() => console.log("ok"));\nexport {};\n`,
      "C01-hints.md": `# Reduce left-to-right. Concrete number first; generics later.\n`,
    },
    review: `# Review — 04\n\n- Function vs precise call signature\n- Optional vs default\n- Re-type createPipe cold\n`,
    knowledge: knowledgeBox({
      deep: "Prefer precise call signatures over `Function`.",
      why: "Typed callbacks catch integration bugs at the call site.",
      misconception: "`Function` is the proper function type.",
      interview: "Explain contextual typing of `map` callbacks.",
      production: "Annotate public returns; infer internals.",
    }),
    workOrder: "1 Params · 2 aliases · 3 HOF · 4 optional/rest · 5 broken · 6 C01",
  });

  // ─── 05 Objects / arrays / tuples ─────────────────────────────────────
  moduleKit({
    id: "05",
    slug: "objects",
    title: "Objects, Arrays & Tuples",
    difficulty: "★★☆☆☆",
    prereq: "04-functions",
    nextModule: "06-unions",
    coreQuestion:
      "How do object types, arrays, and tuples model shape — including optional and readonly?",
    outcomes: [
      "Write object types with optional and readonly fields",
      "Explain excess property checks on fresh literals",
      "Distinguish `T[]` from tuples `[A, B]`",
      "Use readonly arrays intentionally",
      "Model nested records without `any`",
    ],
    lessons: `# Lesson 1 — Object types

\`experiments/01-object-types.ts\` · [\`predictions/P01-excess.md\`](./predictions/P01-excess.md)

# Lesson 2 — Excess property checks

Fresh literals get excess checks; pre-typed variables often do not.

\`experiments/02-excess-properties.ts\`

# Lesson 3 — Arrays

\`experiments/03-arrays.ts\`

# Lesson 4 — Tuples

\`experiments/04-tuples.ts\` · [\`predictions/P02-tuple.md\`](./predictions/P02-tuple.md)
`,
    experiments: {
      "01-object-types.ts": `${expHeader("05-objects", "object types")}
type User = { id: string; name: string; email?: string; readonly createdAt: number };
const u: User = { id: "u1", name: "Ada", createdAt: Date.now() };
console.log(u.name, u.email ?? "(no email)");
export {};
`,
      "02-excess-properties.ts": `${expHeader("05-objects", "excess properties")}
type Point = { x: number; y: number };
const ok: Point = { x: 1, y: 2 };
console.log("ok", ok);
const weird = { x: 1, y: 2, z: 3 };
const sneaky: Point = weird;
console.log("sneaky still has z at runtime", (weird as { z: number }).z);
export {};
`,
      "03-arrays.ts": `${expHeader("05-objects", "arrays")}
const xs: number[] = [1, 2, 3];
xs.push(4);
const frozen: readonly number[] = [10, 20];
function sum(nums: readonly number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
console.log(sum(xs), sum(frozen));
export {};
`,
      "04-tuples.ts": `${expHeader("05-objects", "tuples")}
type Pair = [string, number];
type Entry = [key: string, value: unknown];
const pair: Pair = ["age", 30];
const entry: Entry = ["role", "admin"];
function first<T>(t: readonly [T, ...unknown[]]): T {
  return t[0];
}
console.log(pair[0], pair[1], first(entry));
export {};
`,
    },
    predictions: {
      "P01-excess.md": makePred(
        "05-objects",
        "P01",
        "Excess properties",
        "★★★",
        "02-excess-properties.ts",
        `type Point = { x: number; y: number };\nconst weird = { x: 1, y: 2, z: 3 };\nconst sneaky: Point = weird;`,
        "Does this compile? Does `z` exist at runtime?"
      ),
      "P02-tuple.md": makePred(
        "05-objects",
        "P02",
        "Tuple vs array",
        "★★",
        "04-tuples.ts",
        `const a: number[] = [1, 2];\nconst t: [number, number] = [1, 2];\na.push(3);`,
        "How do tuples differ from arrays of length 2?"
      ),
    },
    broken: [
      {
        file: "01-mutable-config.ts",
        task: "Harden shared config with readonly so callers cannot mutate",
        code: `${expHeader("05-objects", "mutable config")}
type Config = { endpoints: string[]; debug: boolean };
const config: Config = { endpoints: ["/api"], debug: true };
function useConfig(c: Config) {
  c.endpoints.push("/secret");
  c.debug = false;
}
useConfig(config);
console.log(config);
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-model-response.md",
        diff: "★★★",
        body: `# C01 — Model API JSON\n\nType \`{ ok: true, data: { id, tags[] }, meta: [string, number] }\` without \`any\`.\n`,
      },
    ],
    solutions: {
      "01-mutable-config.fixed.ts": `type Config = { readonly endpoints: readonly string[]; readonly debug: boolean };\nconst config: Config = { endpoints: ["/api"], debug: true };\nfunction useConfig(c: Config) { console.log(c.endpoints.length, c.debug); }\nuseConfig(config);\nexport {};\n`,
      "C01-hints.md": `type Response = { ok: true; data: { id: string; tags: string[] }; meta: [string, number] };\n`,
    },
    review: `# Review — 05\n\nExcess checks · readonly arrays · tuple vs array\n`,
    knowledge: knowledgeBox({
      deep: "Excess checks are freshness heuristics — extra runtime fields can still exist.",
      why: "Object/tuple models keep DTOs honest at compile time.",
      misconception: "TS strips unknown properties at runtime.",
      interview: "Contrast tuple vs array; readonly params as capability limits.",
      production: "Readonly shared config by default.",
    }),
    workOrder: "1 objects · 2 excess · 3 arrays · 4 tuples · 5 broken · 6 C01",
  });

  // ─── 06 Unions ────────────────────────────────────────────────────────
  moduleKit({
    id: "06",
    slug: "unions",
    title: "Union Types",
    difficulty: "★★☆☆☆",
    prereq: "05-objects",
    nextModule: "07-intersections",
    coreQuestion: "How do unions model 'one of these' — and how do discriminants make them usable?",
    outcomes: [
      "Build unions of primitives and object shapes",
      "Use discriminated unions with a literal tag",
      "Explain assignability into and out of unions",
      "Avoid stringly unions when a discriminant exists",
    ],
    lessons: `# Lesson 1 — Unions as sets

\`string | number\` means one inhabitant from either set.

\`experiments/01-primitive-unions.ts\` · [\`predictions/P01-union.md\`](./predictions/P01-union.md)

# Lesson 2 — Discriminated unions

A shared literal field enables safe narrowing.

\`experiments/02-discriminated.ts\` · [\`predictions/P02-tag.md\`](./predictions/P02-tag.md)

# Lesson 3 — Union members & exhaustiveness preview

\`experiments/03-union-members.ts\`
`,
    experiments: {
      "01-primitive-unions.ts": `${expHeader("06-unions", "primitive unions")}
function formatId(id: string | number): string {
  return typeof id === "string" ? id.toUpperCase() : id.toFixed(0);
}
console.log(formatId("abc"), formatId(42));
export {};
`,
      "02-discriminated.ts": `${expHeader("06-unions", "discriminated")}
type Ok = { ok: true; value: string };
type Err = { ok: false; error: string };
type Result = Ok | Err;

function show(r: Result): string {
  if (r.ok) return r.value;
  return r.error;
}
console.log(show({ ok: true, value: "yes" }));
console.log(show({ ok: false, error: "nope" }));
export {};
`,
      "03-union-members.ts": `${expHeader("06-unions", "members")}
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle":
      return Math.PI * s.r ** 2;
    case "rect":
      return s.w * s.h;
  }
}
console.log(area({ kind: "circle", r: 2 }).toFixed(2));
export {};
`,
    },
    predictions: {
      "P01-union.md": makePred(
        "06-unions",
        "P01",
        "Union access",
        "★★",
        "01-primitive-unions.ts",
        `declare const x: string | number;\n// x.toFixed(1);`,
        "Why is calling `toFixed` without narrowing illegal?"
      ),
      "P02-tag.md": makePred(
        "06-unions",
        "P02",
        "Discriminant",
        "★★★",
        "02-discriminated.ts",
        `type Result = { ok: true; value: string } | { ok: false; error: string };\nfunction show(r: Result) { if (r.ok) return r.value; return r.error; }`,
        "What property makes narrowing reliable here?"
      ),
    },
    broken: [
      {
        file: "01-stringly.ts",
        task: "Replace string status with a discriminated union",
        code: `${expHeader("06-unions", "stringly")}
type Job = { status: string; result?: string; error?: string };
function message(j: Job): string {
  if (j.status === "done") return j.result!.toUpperCase();
  return j.error ?? "unknown";
}
console.log(message({ status: "done", result: "ok" }));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-event-union.md",
        diff: "★★★",
        body: `# C01 — Event union\n\nModel click | keydown events with a \`type\` discriminant and a handler that is exhaustive.\n`,
      },
    ],
    solutions: {
      "01-stringly.fixed.ts": `type Job = { status: "done"; result: string } | { status: "failed"; error: string };\nfunction message(j: Job): string {\n  if (j.status === "done") return j.result.toUpperCase();\n  return j.error;\n}\nconsole.log(message({ status: "done", result: "ok" }));\nexport {};\n`,
      "C01-hints.md": `Use \`type: "click" | "keydown"\` as the tag; switch on it.\n`,
    },
    review: `# Review — 06\n\nUnion as set · discriminant · why string status fails\n`,
    knowledge: knowledgeBox({
      deep: "Discriminated unions are the primary UI/state modeling tool in TS.",
      why: "A tag makes control-flow analysis precise.",
      misconception: "Optional fields on one fat object equal a union.",
      interview: "Design a Result type without exceptions.",
      production: "Prefer tagged unions for async job/UI state.",
    }),
    workOrder: "1 primitives · 2 discriminated · 3 shapes · 4 broken · 5 C01",
  });

  // ─── 07 Intersections ─────────────────────────────────────────────────
  moduleKit({
    id: "07",
    slug: "intersections",
    title: "Intersection Types",
    difficulty: "★★☆☆☆",
    prereq: "06-unions",
    nextModule: "08-literal-types",
    coreQuestion: "When does `A & B` mean 'both', and when does it collapse to `never`?",
    outcomes: [
      "Compose object types with `&`",
      "Predict incompatible intersections → `never`",
      "Contrast intersections vs extends/interface merging",
      "Use intersections for mixin-style composition carefully",
    ],
    lessons: `# Lesson 1 — Object intersections

\`experiments/01-object-and.ts\` · [\`predictions/P01-and.md\`](./predictions/P01-and.md)

# Lesson 2 — Incompatible intersections

\`experiments/02-never-intersection.ts\` · [\`predictions/P02-never.md\`](./predictions/P02-never.md)

# Lesson 3 — Practical composition

\`experiments/03-compose.ts\`
`,
    experiments: {
      "01-object-and.ts": `${expHeader("07-intersections", "object &")}
type Identified = { id: string };
type Named = { name: string };
type Entity = Identified & Named;
const e: Entity = { id: "1", name: "Node" };
console.log(e.id, e.name);
export {};
`,
      "02-never-intersection.ts": `${expHeader("07-intersections", "never intersection")}
type A = { tag: "a"; n: number };
type B = { tag: "b"; n: string };
type Impossible = A & B;
// const x: Impossible = ... // tag: "a" & "b" → never
console.log("A & B on conflicting literals collapses tag to never (tsc)");
export {};
`,
      "03-compose.ts": `${expHeader("07-intersections", "compose")}
type Timestamped = { createdAt: number };
type SoftDelete = { deletedAt?: number };
type RecordRow = { id: string; body: string } & Timestamped & SoftDelete;
const row: RecordRow = { id: "r1", body: "hi", createdAt: Date.now() };
console.log(row);
export {};
`,
    },
    predictions: {
      "P01-and.md": makePred(
        "07-intersections",
        "P01",
        "Entity fields",
        "★★",
        "01-object-and.ts",
        `type Entity = { id: string } & { name: string };`,
        "What properties must a value provide?"
      ),
      "P02-never.md": makePred(
        "07-intersections",
        "P02",
        "Conflicting tags",
        "★★★",
        "02-never-intersection.ts",
        `type Impossible = { tag: "a" } & { tag: "b" };`,
        "What is the type of `tag` on Impossible?"
      ),
    },
    broken: [
      {
        file: "01-conflict.ts",
        task: "Fix the model so props are composable without never",
        code: `${expHeader("07-intersections", "conflict")}
type Button = { kind: "button"; label: string };
type Link = { kind: "link"; href: string };
type Control = Button & Link; // oops
function render(c: Control) {
  console.log(c);
}
// render({ kind: "button", label: "Go", href: "/" });
console.log("Control is effectively uninhabitable");
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-with-id.md",
        diff: "★★",
        body: `# C01 — WithId\n\nWrite \`type WithId<T> = T & { id: string }\` and use it for a \`UserDraft\` → \`User\` flow.\n`,
      },
    ],
    solutions: {
      "01-conflict.fixed.ts": `type Control = Button | Link; // union, not &\ntype Button = { kind: "button"; label: string };\ntype Link = { kind: "link"; href: string };\nfunction render(c: Control) {\n  if (c.kind === "button") console.log(c.label);\n  else console.log(c.href);\n}\nrender({ kind: "button", label: "Go" });\nexport {};\n`,
      "C01-hints.md": `WithId is the classic intersection helper before mapped types.\n`,
    },
    review: `# Review — 07\n\n& on objects · never collapse · union vs intersection for variants\n`,
    knowledge: knowledgeBox({
      deep: "Intersecting conflicting primitive/literal properties yields `never`.",
      why: "Composition expresses 'all of these shapes simultaneously'.",
      misconception: "`A & B` means 'either A or B'.",
      interview: "When to use `&` vs interface extends.",
      production: "Variants → union; mixins/cross-cutting fields → intersection.",
    }),
    workOrder: "1 object & · 2 never · 3 compose · 4 broken · 5 C01",
  });

  // ─── 08 Literal types ─────────────────────────────────────────────────
  moduleKit({
    id: "08",
    slug: "literal-types",
    title: "Literal Types & as const",
    difficulty: "★★★☆☆",
    prereq: "07-intersections",
    nextModule: "09-type-narrowing",
    coreQuestion: "How do literal types and `as const` lock down finite state spaces?",
    outcomes: [
      "Use string/number/boolean literal types",
      "Apply `as const` to objects and arrays",
      "Model finite state with literal unions",
      "Contrast `satisfies` preview mentally (where available)",
    ],
    lessons: `# Lesson 1 — Literal types

\`experiments/01-literals.ts\` · [\`predictions/P01-widen.md\`](./predictions/P01-widen.md)

# Lesson 2 — as const

\`experiments/02-as-const.ts\` · [\`predictions/P02-const.md\`](./predictions/P02-const.md)

# Lesson 3 — State modeling

\`experiments/03-state.ts\`
`,
    experiments: {
      "01-literals.ts": `${expHeader("08-literal-types", "literals")}
type Direction = "n" | "s" | "e" | "w";
function move(d: Direction): string {
  return \`go \${d}\`;
}
let widened = "n"; // string
const locked = "n"; // "n"
console.log(move(locked));
// move(widened); // may error depending on annotation — prefer Direction
console.log("widened is", typeof widened);
export {};
`,
      "02-as-const.ts": `${expHeader("08-literal-types", "as const")}
const routes = ["home", "about", "contact"] as const;
type Route = (typeof routes)[number];
function go(r: Route) {
  console.log("→", r);
}
go("home");
console.log(routes);
export {};
`,
      "03-state.ts": `${expHeader("08-literal-types", "state")}
type Traffic = "red" | "yellow" | "green";
function next(t: Traffic): Traffic {
  if (t === "red") return "green";
  if (t === "green") return "yellow";
  return "red";
}
console.log(next("green"));
export {};
`,
    },
    predictions: {
      "P01-widen.md": makePred(
        "08-literal-types",
        "P01",
        "Widening",
        "★★",
        "01-literals.ts",
        `let x = "n";\nconst y = "n";`,
        "What are the types of `x` and `y`?"
      ),
      "P02-const.md": makePred(
        "08-literal-types",
        "P02",
        "as const routes",
        "★★★",
        "02-as-const.ts",
        `const routes = ["home", "about"] as const;\ntype Route = (typeof routes)[number];`,
        "What is `Route`?"
      ),
    },
    broken: [
      {
        file: "01-string-mode.ts",
        task: "Replace open string mode with literal union + as const config",
        code: `${expHeader("08-literal-types", "string mode")}
const config = { mode: "dark" };
function apply(mode: "light" | "dark") {
  console.log(mode);
}
// apply(config.mode); // string not assignable
apply("dark");
console.log(config);
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-http-methods.md",
        diff: "★★",
        body: `# C01 — HTTP methods\n\nDefine \`Method\` as a literal union from an \`as const\` array and a \`fetchApi(method, path)\` signature.\n`,
      },
    ],
    solutions: {
      "01-string-mode.fixed.ts": `const config = { mode: "dark" } as const;\nfunction apply(mode: "light" | "dark") { console.log(mode); }\napply(config.mode);\nexport {};\n`,
      "C01-hints.md": `const METHODS = ["GET","POST"] as const; type Method = typeof METHODS[number];\n`,
    },
    review: `# Review — 08\n\nWidening · as const · finite state unions\n`,
    knowledge: knowledgeBox({
      deep: "`as const` asks for the narrowest inferred type (readonly + literals).",
      why: "Finite literals make illegal states unrepresentable.",
      misconception: "`as const` changes runtime values.",
      interview: "How do you derive a union from a const array?",
      production: "Config tables with `as const` + derived unions.",
    }),
    workOrder: "1 literals · 2 as const · 3 state · 4 broken · 5 C01",
  });

  // ─── 09 Narrowing ─────────────────────────────────────────────────────
  moduleKit({
    id: "09",
    slug: "type-narrowing",
    title: "Type Narrowing",
    difficulty: "★★★☆☆",
    prereq: "08-literal-types",
    nextModule: "10-type-guards",
    coreQuestion: "How does control-flow analysis narrow unions — and where does it fail?",
    outcomes: [
      "Use typeof / equality / in / instanceof narrowing",
      "Predict when CFA loses narrowing (aliases, mutations)",
      "Combine discriminants with switch exhaustiveness",
    ],
    lessons: `# Lesson 1 — Built-in narrowing

\`experiments/01-typeof-in.ts\` · [\`predictions/P01-in.md\`](./predictions/P01-in.md)

# Lesson 2 — Equality & discriminants

\`experiments/02-equality.ts\`

# Lesson 3 — Narrowing pitfalls

\`experiments/03-pitfalls.ts\` · [\`predictions/P02-alias.md\`](./predictions/P02-alias.md)
`,
    experiments: {
      "01-typeof-in.ts": `${expHeader("09-type-narrowing", "typeof / in")}
function len(x: string | string[]): number {
  if (typeof x === "string") return x.length;
  return x.length;
}
function label(p: { name: string } | { id: number }): string {
  if ("name" in p) return p.name;
  return String(p.id);
}
console.log(len("ab"), len(["a", "b"]), label({ name: "x" }));
export {};
`,
      "02-equality.ts": `${expHeader("09-type-narrowing", "equality")}
type Resp = { status: 200; body: string } | { status: 404; error: string };
function read(r: Resp): string {
  if (r.status === 200) return r.body;
  return r.error;
}
console.log(read({ status: 200, body: "ok" }));
export {};
`,
      "03-pitfalls.ts": `${expHeader("09-type-narrowing", "pitfalls")}
function maybe(x: string | null) {
  if (x === null) return;
  const y = x;
  console.log(y.toUpperCase());
}
maybe("hi");
maybe(null);
export {};
`,
    },
    predictions: {
      "P01-in.md": makePred(
        "09-type-narrowing",
        "P01",
        "`in` operator",
        "★★",
        "01-typeof-in.ts",
        `function label(p: { name: string } | { id: number }) {\n  if ("name" in p) return p.name;\n  return String(p.id);\n}`,
        "Why is `in` valid narrowing here?"
      ),
      "P02-alias.md": makePred(
        "09-type-narrowing",
        "P02",
        "After null check",
        "★★",
        "03-pitfalls.ts",
        `function maybe(x: string | null) {\n  if (x === null) return;\n  console.log(x.toUpperCase());\n}`,
        "What is `x`'s type after the early return?"
      ),
    },
    broken: [
      {
        file: "01-unsafe-access.ts",
        task: "Narrow before property access",
        code: `${expHeader("09-type-narrowing", "unsafe")}
type Input = { value: string } | null;
function upper(i: Input): string {
  return i.value.toUpperCase();
}
console.log(upper({ value: "ok" }));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-parse-unknown.md",
        diff: "★★★",
        body: `# C01 — Narrow unknown\n\nWrite \`function asString(u: unknown): string | undefined\` using typeof / array checks only (no assertions).\n`,
      },
    ],
    solutions: {
      "01-unsafe-access.fixed.ts": `type Input = { value: string } | null;\nfunction upper(i: Input): string {\n  if (!i) return "";\n  return i.value.toUpperCase();\n}\nconsole.log(upper({ value: "ok" }));\nexport {};\n`,
      "C01-hints.md": `typeof u === "string"; Array.isArray is for arrays.\n`,
    },
    review: `# Review — 09\n\ntypeof · in · discriminant equality · early return narrowing\n`,
    knowledge: knowledgeBox({
      deep: "CFA tracks discriminants and typeof; stored boolean aliases can lose correlation.",
      why: "Narrowing turns unions into actionable types without casts.",
      misconception: "Once narrowed, mutations never widen again.",
      interview: "Walk through narrowing a Result type.",
      production: "Prefer discriminants over parallel optional fields.",
    }),
    workOrder: "1 typeof/in · 2 equality · 3 pitfalls · 4 broken · 5 C01",
  });

  // ─── 10 Type guards ───────────────────────────────────────────────────
  moduleKit({
    id: "10",
    slug: "type-guards",
    title: "Type Guards & Predicates",
    difficulty: "★★★☆☆",
    prereq: "09-type-narrowing",
    nextModule: "11-interfaces",
    coreQuestion: "When is a custom type predicate honest — and when is it a lie?",
    outcomes: [
      "Write `value is T` predicates",
      "Contrast predicates vs real runtime validation",
      "Use assertion functions (`asserts`) carefully",
      "Keep guards honest at trust boundaries",
    ],
    lessons: `# Lesson 1 — Type predicates

\`experiments/01-predicate.ts\` · [\`predictions/P01-is.md\`](./predictions/P01-is.md)

# Lesson 2 — Predicates are not validators

\`experiments/02-honesty.ts\` · [\`predictions/P02-lie.md\`](./predictions/P02-lie.md)

# Lesson 3 — asserts

\`experiments/03-asserts.ts\`
`,
    experiments: {
      "01-predicate.ts": `${expHeader("10-type-guards", "predicate")}
type Cat = { meow: true; name: string };
type Dog = { bark: true; name: string };
function isCat(a: Cat | Dog): a is Cat {
  return "meow" in a;
}
function speak(a: Cat | Dog) {
  if (isCat(a)) console.log(a.name, "meow");
  else console.log(a.name, "bark");
}
speak({ meow: true, name: "Mochi" });
export {};
`,
      "02-honesty.ts": `${expHeader("10-type-guards", "honesty")}
type User = { id: string; email: string };
// Dishonest guard — trusts shape without checking email format
function isUser(u: unknown): u is User {
  return typeof u === "object" && u !== null && "id" in u && "email" in u;
}
const raw: unknown = { id: 1, email: false };
if (isUser(raw)) {
  console.log("guard said User, runtime:", raw);
}
export {};
`,
      "03-asserts.ts": `${expHeader("10-type-guards", "asserts")}
function assertDefined<T>(x: T | null | undefined): asserts x is T {
  if (x == null) throw new Error("undefined");
}
const maybe: string | undefined = "lab";
assertDefined(maybe);
console.log(maybe.toUpperCase());
export {};
`,
    },
    predictions: {
      "P01-is.md": makePred(
        "10-type-guards",
        "P01",
        "Predicate narrowing",
        "★★",
        "01-predicate.ts",
        `function isCat(a: Cat | Dog): a is Cat { return "meow" in a; }`,
        "What does `a is Cat` change for the checker after a true result?"
      ),
      "P02-lie.md": makePred(
        "10-type-guards",
        "P02",
        "Dishonest guard",
        "★★★",
        "02-honesty.ts",
        `function isUser(u: unknown): u is User { return typeof u === "object" && u !== null && "id" in u; }`,
        "Why can this still be wrong at runtime?"
      ),
    },
    broken: [
      {
        file: "01-bad-guard.ts",
        task: "Make the guard check actual string fields",
        code: `${expHeader("10-type-guards", "bad guard")}
type Point = { x: number; y: number };
function isPoint(u: unknown): u is Point {
  return typeof u === "object" && u !== null;
}
const raw: unknown = { x: "1", y: "2" };
if (isPoint(raw)) console.log(raw.x.toFixed(1));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-is-string-array.md",
        diff: "★★★",
        body: `# C01 — isStringArray\n\nImplement \`function isStringArray(u: unknown): u is string[]\` correctly.\n`,
      },
    ],
    solutions: {
      "01-bad-guard.fixed.ts": `type Point = { x: number; y: number };\nfunction isPoint(u: unknown): u is Point {\n  return (\n    typeof u === "object" &&\n    u !== null &&\n    typeof (u as { x?: unknown }).x === "number" &&\n    typeof (u as { y?: unknown }).y === "number"\n  );\n}\nconst raw: unknown = { x: 1, y: 2 };\nif (isPoint(raw)) console.log(raw.x.toFixed(1));\nexport {};\n`,
      "C01-hints.md": `Array.isArray + every typeof === "string".\n`,
    },
    review: `# Review — 10\n\n\`is\` predicates · honesty · asserts\n`,
    knowledge: knowledgeBox({
      deep: "A predicate is a contract you make with the checker — lying is allowed and dangerous.",
      why: "Custom guards extend CFA to your domain types.",
      misconception: "Type guards validate data like Zod.",
      interview: "Difference between predicate and assertion function.",
      production: "Untrusted JSON → real validation; guards for trusted in-process unions.",
    }),
    workOrder: "1 predicate · 2 honesty · 3 asserts · 4 broken · 5 C01",
  });

  // ─── 11 Interfaces ────────────────────────────────────────────────────
  moduleKit({
    id: "11",
    slug: "interfaces",
    title: "Interfaces",
    difficulty: "★★☆☆☆",
    prereq: "10-type-guards",
    nextModule: "12-type-aliases",
    coreQuestion: "When do interfaces win over type aliases — and what does merging do?",
    outcomes: [
      "Declare interfaces with optional/readonly/method syntax",
      "Extend interfaces",
      "Explain declaration merging",
      "Choose interface vs type alias intentionally",
    ],
    lessons: `# Lesson 1 — Interface basics

\`experiments/01-interface.ts\` · [\`predictions/P01-ext.md\`](./predictions/P01-ext.md)

# Lesson 2 — Extends

\`experiments/02-extends.ts\`

# Lesson 3 — Merging

\`experiments/03-merging.ts\` · [\`predictions/P02-merge.md\`](./predictions/P02-merge.md)
`,
    experiments: {
      "01-interface.ts": `${expHeader("11-interfaces", "basics")}
interface User {
  id: string;
  name: string;
  email?: string;
  greet(): string;
}
const u: User = {
  id: "1",
  name: "Ada",
  greet() {
    return \`hi \${this.name}\`;
  },
};
console.log(u.greet());
export {};
`,
      "02-extends.ts": `${expHeader("11-interfaces", "extends")}
interface Identified {
  id: string;
}
interface User extends Identified {
  name: string;
}
const u: User = { id: "1", name: "Ada" };
console.log(u);
export {};
`,
      "03-merging.ts": `${expHeader("11-interfaces", "merging")}
interface Box {
  width: number;
}
interface Box {
  height: number;
}
const b: Box = { width: 1, height: 2 };
console.log(b);
export {};
`,
    },
    predictions: {
      "P01-ext.md": makePred(
        "11-interfaces",
        "P01",
        "extends",
        "★★",
        "02-extends.ts",
        `interface User extends Identified { name: string }`,
        "Must User provide `id`?"
      ),
      "P02-merge.md": makePred(
        "11-interfaces",
        "P02",
        "Merging",
        "★★★",
        "03-merging.ts",
        `interface Box { width: number }\ninterface Box { height: number }`,
        "What is the resulting Box shape?"
      ),
    },
    broken: [
      {
        file: "01-bad-impl.ts",
        task: "Satisfy the interface without `any`",
        code: `${expHeader("11-interfaces", "bad impl")}
interface Repo {
  get(id: string): { id: string; title: string };
}
const repo: Repo = {
  get(id) {
    return { id, title: 42 as any };
  },
};
console.log(repo.get("1"));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-interface-vs-type.md",
        diff: "★★",
        body: `# C01 — Interface vs type\n\nList 3 cases where interface is preferable and 3 where type alias is required (unions, tuples, mapped).\n`,
      },
    ],
    solutions: {
      "01-bad-impl.fixed.ts": `interface Repo {\n  get(id: string): { id: string; title: string };\n}\nconst repo: Repo = {\n  get(id) {\n    return { id, title: "ok" };\n  },\n};\nconsole.log(repo.get("1"));\nexport {};\n`,
      "C01-hints.md": `Interfaces: object shapes + merging. Types: unions, tuples, mapped, primitives.\n`,
    },
    review: `# Review — 11\n\nextends · merging · interface vs type\n`,
    knowledge: knowledgeBox({
      deep: "Interfaces can merge; type aliases cannot.",
      why: "Stable object contracts for public APIs and class implements.",
      misconception: "Interfaces exist at runtime.",
      interview: "When would declaration merging surprise you?",
      production: "Library ambient augmentation uses merging carefully.",
    }),
    workOrder: "1 basics · 2 extends · 3 merging · 4 broken · 5 C01",
  });

  // ─── 12 Type aliases ──────────────────────────────────────────────────
  moduleKit({
    id: "12",
    slug: "type-aliases",
    title: "Type Aliases",
    difficulty: "★★☆☆☆",
    prereq: "11-interfaces",
    nextModule: "13-structural-typing",
    coreQuestion: "What can type aliases express that interfaces cannot?",
    outcomes: [
      "Alias unions, tuples, and function types",
      "Build reusable domain aliases",
      "Know when aliases are erased completely",
    ],
    lessons: `# Lesson 1 — Beyond objects

\`experiments/01-aliases.ts\` · [\`predictions/P01-alias.md\`](./predictions/P01-alias.md)

# Lesson 2 — Domain modeling

\`experiments/02-domain.ts\`

# Lesson 3 — Recursive preview

\`experiments/03-recursive-preview.ts\` · [\`predictions/P02-json.md\`](./predictions/P02-json.md)
`,
    experiments: {
      "01-aliases.ts": `${expHeader("12-type-aliases", "aliases")}
type ID = string;
type Pair = [ID, number];
type Handler = (id: ID) => void;
const p: Pair = ["u1", 1];
const h: Handler = (id) => console.log(id);
h(p[0]);
export {};
`,
      "02-domain.ts": `${expHeader("12-type-aliases", "domain")}
type Email = string;
type User = { id: string; email: Email };
type UserId = User["id"];
const u: User = { id: "1", email: "a@b.co" };
const id: UserId = u.id;
console.log(id, u.email);
export {};
`,
      "03-recursive-preview.ts": `${expHeader("12-type-aliases", "json-ish")}
type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };
const data: Json = { ok: true, items: [1, "x", null] };
console.log(JSON.stringify(data));
export {};
`,
    },
    predictions: {
      "P01-alias.md": makePred(
        "12-type-aliases",
        "P01",
        "Alias erasure",
        "★★",
        "01-aliases.ts",
        `type ID = string;\nconst x: ID = "a";`,
        "Does `ID` exist after compilation?"
      ),
      "P02-json.md": makePred(
        "12-type-aliases",
        "P02",
        "Recursive Json",
        "★★★",
        "03-recursive-preview.ts",
        `type Json = string | number | Json[] | { [k: string]: Json };`,
        "Why must this be a type alias (not interface alone) for the union form?"
      ),
    },
    broken: [
      {
        file: "01-any-alias.ts",
        task: "Replace `any` domain alias with precise types",
        code: `${expHeader("12-type-aliases", "any alias")}
type Payload = any;
function send(p: Payload) {
  console.log(p.user.id);
}
send({ user: null });
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-result-alias.md",
        diff: "★★★",
        body: `# C01 — Result alias\n\nDefine \`type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }\` and a \`mapResult\` helper.\n`,
      },
    ],
    solutions: {
      "01-any-alias.fixed.ts": `type Payload = { user: { id: string } };\nfunction send(p: Payload) {\n  console.log(p.user.id);\n}\nsend({ user: { id: "1" } });\nexport {};\n`,
      "C01-hints.md": `Discriminated Result + generic map on ok branch.\n`,
    },
    review: `# Review — 12\n\nunions/tuples as aliases · erasure · Result pattern\n`,
    knowledge: knowledgeBox({
      deep: "Aliases are erased; they never add runtime brands by themselves.",
      why: "Express unions and computed types interfaces cannot.",
      misconception: "`type UserId = string` creates a nominal UserId.",
      interview: "Interface vs type — give a decision rule.",
      production: "Domain aliases document intent; branded types need extra patterns.",
    }),
    workOrder: "1 aliases · 2 domain · 3 recursive · 4 broken · 5 C01",
  });

  // ─── 13 Structural typing ─────────────────────────────────────────────
  moduleKit({
    id: "13",
    slug: "structural-typing",
    title: "Structural Typing",
    difficulty: "★★★☆☆",
    prereq: "12-type-aliases",
    nextModule: "14-generics",
    coreQuestion: "Why does TypeScript accept values that were never declared as implementing a type?",
    outcomes: [
      "Predict structural assignability",
      "Contrast structural vs nominal typing",
      "Use fresh literal checks vs structural openness",
      "Sketch branding when nominal-ish IDs are needed",
    ],
    lessons: `# Lesson 1 — Structure matches

\`experiments/01-structural.ts\` · [\`predictions/P01-struct.md\`](./predictions/P01-struct.md)

# Lesson 2 — Extra fields

\`experiments/02-extra-fields.ts\`

# Lesson 3 — Branding sketch

\`experiments/03-branding.ts\` · [\`predictions/P02-brand.md\`](./predictions/P02-brand.md)
`,
    experiments: {
      "01-structural.ts": `${expHeader("13-structural-typing", "structural")}
type Point = { x: number; y: number };
const p = { x: 1, y: 2, label: "origin" };
function print(pt: Point) {
  console.log(pt.x, pt.y);
}
print(p);
export {};
`,
      "02-extra-fields.ts": `${expHeader("13-structural-typing", "extra")}
type User = { id: string };
function take(u: User) {
  console.log(u.id);
}
const full = { id: "1", role: "admin" };
take(full);
export {};
`,
      "03-branding.ts": `${expHeader("13-structural-typing", "branding")}
type UserId = string & { readonly __brand: "UserId" };
function asUserId(s: string): UserId {
  return s as UserId;
}
function loadUser(id: UserId) {
  console.log("load", id);
}
loadUser(asUserId("u1"));
// loadUser("u1"); // tsc error — string not UserId
export {};
`,
    },
    predictions: {
      "P01-struct.md": makePred(
        "13-structural-typing",
        "P01",
        "Structural accept",
        "★★",
        "01-structural.ts",
        `type Point = { x: number; y: number };\nprint({ x: 1, y: 2, label: "o" });`,
        "Why is a value with extra `label` accepted when passed via a variable?"
      ),
      "P02-brand.md": makePred(
        "13-structural-typing",
        "P02",
        "Brand",
        "★★★",
        "03-branding.ts",
        `type UserId = string & { readonly __brand: "UserId" };`,
        "Does `__brand` exist at runtime?"
      ),
    },
    broken: [
      {
        file: "01-wrong-id.ts",
        task: "Prevent mixing OrderId and UserId with branding",
        code: `${expHeader("13-structural-typing", "wrong id")}
function refund(orderId: string, userId: string) {
  console.log(orderId, userId);
}
const userId = "u1";
const orderId = "o9";
refund(userId, orderId); // swapped — still compiles
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-nominal.md",
        diff: "★★★",
        body: `# C01 — Explain structural\n\nIn your own words: why TS is structural, one bug it allows, and how branding mitigates ID mixups.\n`,
      },
    ],
    solutions: {
      "01-wrong-id.fixed.ts": `type UserId = string & { __brand: "UserId" };\ntype OrderId = string & { __brand: "OrderId" };\nfunction refund(orderId: OrderId, userId: UserId) {\n  console.log(orderId, userId);\n}\nconst userId = "u1" as UserId;\nconst orderId = "o9" as OrderId;\nrefund(orderId, userId);\nexport {};\n`,
      "C01-hints.md": `Structural = shape compatibility. Brand = compile-time phantom property.\n`,
    },
    review: `# Review — 13\n\nstructural assignability · freshness · branding\n`,
    knowledge: knowledgeBox({
      deep: "TS is structural; nominal IDs need brands or classes.",
      why: "Duck typing at compile time matches JS's runtime openness.",
      misconception: "Declaring `implements` is required for assignability.",
      interview: "How would you stop OrderId/UserId mixups?",
      production: "Brand critical IDs at module boundaries.",
    }),
    workOrder: "1 structural · 2 extras · 3 branding · 4 broken · 5 C01",
  });

  // ─── 14 Generics ──────────────────────────────────────────────────────
  moduleKit({
    id: "14",
    slug: "generics",
    title: "Generics",
    difficulty: "★★★☆☆",
    prereq: "13-structural-typing",
    nextModule: "15-generic-constraints",
    coreQuestion: "How do type parameters let APIs stay precise without hard-coding types?",
    outcomes: [
      "Write generic functions and infer type arguments",
      "Use multiple type parameters",
      "Read generic errors",
      "Avoid unnecessary generics (YAGNI at type level)",
    ],
    lessons: `# Lesson 1 — First type parameter

\`experiments/01-identity.ts\` · [\`predictions/P01-infer.md\`](./predictions/P01-infer.md)

# Lesson 2 — Generic collections

\`experiments/02-box.ts\`

# Lesson 3 — Inference vs explicit

\`experiments/03-inference.ts\` · [\`predictions/P02-explicit.md\`](./predictions/P02-explicit.md)
`,
    experiments: {
      "01-identity.ts": `${expHeader("14-generics", "identity")}
function identity<T>(value: T): T {
  return value;
}
console.log(identity("ts"), identity(42));
export {};
`,
      "02-box.ts": `${expHeader("14-generics", "box")}
type Box<T> = { value: T };
function mapBox<T, U>(b: Box<T>, f: (t: T) => U): Box<U> {
  return { value: f(b.value) };
}
console.log(mapBox({ value: 2 }, (n) => String(n)));
export {};
`,
      "03-inference.ts": `${expHeader("14-generics", "inference")}
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair("x", 1);
console.log(p);
export {};
`,
    },
    predictions: {
      "P01-infer.md": makePred(
        "14-generics",
        "P01",
        "Inference",
        "★★",
        "01-identity.ts",
        `identity("ts")`,
        "What is `T` inferred as?"
      ),
      "P02-explicit.md": makePred(
        "14-generics",
        "P02",
        "pair types",
        "★★",
        "03-inference.ts",
        `const p = pair("x", 1);`,
        "What is the type of `p`?"
      ),
    },
    broken: [
      {
        file: "01-any-generic.ts",
        task: "Replace any with a real type parameter",
        code: `${expHeader("14-generics", "any generic")}
function first(xs: any[]): any {
  return xs[0];
}
console.log(first([1, 2]).toFixed(1));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-pluck.md",
        diff: "★★★",
        body: `# C01 — pluck\n\nImplement \`function pluck<T, K extends keyof T>(items: T[], key: K): T[K][]\`.\n`,
      },
    ],
    solutions: {
      "01-any-generic.fixed.ts": `function first<T>(xs: T[]): T | undefined {\n  return xs[0];\n}\nconsole.log(first([1, 2])?.toFixed(1));\nexport {};\n`,
      "C01-hints.md": `K extends keyof T; return items.map(i => i[key]).\n`,
    },
    review: `# Review — 14\n\nidentity · Box · inference · when not to generic\n`,
    knowledge: knowledgeBox({
      deep: "Generics preserve relationships between inputs and outputs.",
      why: "One implementation, many types — without `any`.",
      misconception: "More type parameters always means better API.",
      interview: "Implement identity and explain inference.",
      production: "Generic only when callers need preserved relationships.",
    }),
    workOrder: "1 identity · 2 box · 3 inference · 4 broken · 5 C01",
  });

  // ─── 15 Generic constraints ───────────────────────────────────────────
  moduleKit({
    id: "15",
    slug: "generic-constraints",
    title: "Generic Constraints",
    difficulty: "★★★☆☆",
    prereq: "14-generics",
    nextModule: "16-generic-patterns",
    coreQuestion: "How does `extends` constrain type parameters to useful shapes?",
    outcomes: [
      "Write `T extends Shape` constraints",
      "Use `keyof` constraints (`K extends keyof T`)",
      "Combine defaults with constraints",
    ],
    lessons: `# Lesson 1 — extends constraints

\`experiments/01-extends.ts\` · [\`predictions/P01-len.md\`](./predictions/P01-len.md)

# Lesson 2 — keyof constraints

\`experiments/02-keyof-constraint.ts\` · [\`predictions/P02-key.md\`](./predictions/P02-key.md)

# Lesson 3 — Defaults

\`experiments/03-defaults.ts\`
`,
    experiments: {
      "01-extends.ts": `${expHeader("15-generic-constraints", "extends")}
function lengthOf<T extends { length: number }>(x: T): number {
  return x.length;
}
console.log(lengthOf("abc"), lengthOf([1, 2]));
export {};
`,
      "02-keyof-constraint.ts": `${expHeader("15-generic-constraints", "keyof")}
function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
console.log(getProp({ a: 1, b: "x" }, "b"));
export {};
`,
      "03-defaults.ts": `${expHeader("15-generic-constraints", "defaults")}
type ApiResponse<T = unknown> = { data: T; status: number };
const r: ApiResponse<string> = { data: "ok", status: 200 };
const u: ApiResponse = { data: { n: 1 }, status: 200 };
console.log(r, u);
export {};
`,
    },
    predictions: {
      "P01-len.md": makePred(
        "15-generic-constraints",
        "P01",
        "length constraint",
        "★★",
        "01-extends.ts",
        `lengthOf(42)`,
        "Does this compile? Why?"
      ),
      "P02-key.md": makePred(
        "15-generic-constraints",
        "P02",
        "keyof",
        "★★★",
        "02-keyof-constraint.ts",
        `getProp({ a: 1 }, "b")`,
        "Why is `\"b\"` rejected?"
      ),
    },
    broken: [
      {
        file: "01-unconstrained.ts",
        task: "Constrain so `.id` access is safe",
        code: `${expHeader("15-generic-constraints", "unconstrained")}
function idOf<T>(x: T): string {
  return (x as { id: string }).id;
}
console.log(idOf({ id: "1" }));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-merge.md",
        diff: "★★★",
        body: `# C01 — merge\n\n\`function merge<T extends object, U extends object>(a: T, b: U): T & U\`\n`,
      },
    ],
    solutions: {
      "01-unconstrained.fixed.ts": `function idOf<T extends { id: string }>(x: T): string {\n  return x.id;\n}\nconsole.log(idOf({ id: "1" }));\nexport {};\n`,
      "C01-hints.md": `return { ...a, ...b } as T & U (note: runtime overlap rules).\n`,
    },
    review: `# Review — 15\n\nextends · keyof · defaults\n`,
    knowledge: knowledgeBox({
      deep: "`extends` on type params is a constraint, not inheritance runtime.",
      why: "Constraints unlock property access inside generic bodies.",
      misconception: "`T extends string | number` means T is the whole union always.",
      interview: "Implement getProp with keyof.",
      production: "Constrain at the boundary; keep unconstrained when truly opaque.",
    }),
    workOrder: "1 extends · 2 keyof · 3 defaults · 4 broken · 5 C01",
  });

  // ─── 16 Generic patterns ──────────────────────────────────────────────
  moduleKit({
    id: "16",
    slug: "generic-patterns",
    title: "Generic Patterns",
    difficulty: "★★★★☆",
    prereq: "15-generic-constraints",
    nextModule: "17-keyof",
    coreQuestion: "Which generic API patterns show up in real codebases — and when are they overkill?",
    outcomes: [
      "Implement Result / Option-style helpers",
      "Type a simple event map",
      "Build a typed factory / repository sketch",
      "Judge when a pattern improves DX vs puzzles",
    ],
    lessons: `# Lesson 1 — Result helpers

\`experiments/01-result.ts\` · [\`predictions/P01-map.md\`](./predictions/P01-map.md)

# Lesson 2 — Event map

\`experiments/02-event-map.ts\` · [\`predictions/P02-emit.md\`](./predictions/P02-emit.md)

# Lesson 3 — Repository sketch

\`experiments/03-repo.ts\`
`,
    experiments: {
      "01-result.ts": `${expHeader("16-generic-patterns", "result")}
type Result<T, E = string> =
  | { ok: true; value: T }
  | { ok: false; error: E };

function mapOk<T, U, E>(r: Result<T, E>, f: (t: T) => U): Result<U, E> {
  return r.ok ? { ok: true, value: f(r.value) } : r;
}
console.log(mapOk({ ok: true, value: 2 }, (n) => n * 2));
export {};
`,
      "02-event-map.ts": `${expHeader("16-generic-patterns", "event map")}
type Events = {
  login: { userId: string };
  logout: undefined;
};
function emit<K extends keyof Events>(type: K, payload: Events[K]) {
  console.log(type, payload);
}
emit("login", { userId: "u1" });
emit("logout", undefined);
export {};
`,
      "03-repo.ts": `${expHeader("16-generic-patterns", "repo")}
type Entity = { id: string };
function createRepo<T extends Entity>() {
  const items = new Map<string, T>();
  return {
    save(item: T) {
      items.set(item.id, item);
    },
    get(id: string): T | undefined {
      return items.get(id);
    },
  };
}
const users = createRepo<{ id: string; name: string }>();
users.save({ id: "1", name: "Ada" });
console.log(users.get("1"));
export {};
`,
    },
    predictions: {
      "P01-map.md": makePred(
        "16-generic-patterns",
        "P01",
        "mapOk",
        "★★★",
        "01-result.ts",
        `mapOk({ ok: false, error: "x" }, (n: number) => n + 1)`,
        "What is returned? Does `f` run?"
      ),
      "P02-emit.md": makePred(
        "16-generic-patterns",
        "P02",
        "emit payload",
        "★★★",
        "02-event-map.ts",
        `emit("login", { userId: 1 })`,
        "Why should this fail under tsc?"
      ),
    },
    broken: [
      {
        file: "01-loose-emit.ts",
        task: "Type emit so wrong payloads fail",
        code: `${expHeader("16-generic-patterns", "loose emit")}
function emit(type: string, payload: any) {
  console.log(type, payload);
}
emit("login", { nope: true });
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-option.md",
        diff: "★★★",
        body: `# C01 — Option\n\nImplement \`type Option<T> = T | null\` helpers \`map\` / \`unwrapOr\` without \`any\`.\n`,
      },
    ],
    solutions: {
      "01-loose-emit.fixed.ts": `type Events = { login: { userId: string } };\nfunction emit<K extends keyof Events>(type: K, payload: Events[K]) {\n  console.log(type, payload);\n}\nemit("login", { userId: "u1" });\nexport {};\n`,
      "C01-hints.md": `null-preserving map; unwrapOr provides default.\n`,
    },
    review: `# Review — 16\n\nResult · EventMap · Repo · overkill check\n`,
    knowledge: knowledgeBox({
      deep: "Event maps couple string keys to payload types via keyof.",
      why: "Patterns encode invariants once for many call sites.",
      misconception: "Every API should be fully generic.",
      interview: "Design a typed pub/sub for 3 events.",
      production: "Prefer boring concrete types until a second use appears.",
    }),
    workOrder: "1 Result · 2 EventMap · 3 Repo · 4 broken · 5 C01",
  });

  console.log("Fundamentals 04–16 written.");
}
