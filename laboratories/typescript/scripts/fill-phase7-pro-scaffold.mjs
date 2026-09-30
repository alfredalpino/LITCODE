import { moduleKit, scaffoldModule, expHeader, makePred, knowledgeBox } from "./phase7-kit.mjs";

/** Professional modules + honest scaffolds for the next curriculum band */
export function fillProfessionalAndScaffolds() {
  // ─── 29 Enums ─────────────────────────────────────────────────────────
  moduleKit({
    id: "29",
    slug: "enums",
    title: "Enums & const alternatives",
    difficulty: "★★★☆☆",
    prereq: "08-literal-types",
    nextModule: "30-namespaces",
    coreQuestion: "When do enums help — and when is `as const` + union safer?",
    outcomes: [
      "Use string and numeric enums",
      "Predict runtime emit for enums",
      "Prefer `as const` objects for many modern APIs",
      "Explain const enum trade-offs",
    ],
    lessons: `# Lesson 1 — String enums

\`experiments/01-string-enum.ts\` · [\`predictions/P01-enum.md\`](./predictions/P01-enum.md)

# Lesson 2 — Numeric enums & reverse mapping

\`experiments/02-numeric-enum.ts\`

# Lesson 3 — as const alternative

\`experiments/03-as-const-alt.ts\` · [\`predictions/P02-alt.md\`](./predictions/P02-alt.md)
`,
    experiments: {
      "01-string-enum.ts": `${expHeader("29-enums", "string enum")}
enum Direction {
  North = "NORTH",
  South = "SOUTH",
}
function move(d: Direction) {
  console.log("move", d);
}
move(Direction.North);
console.log("runtime object keys", Object.keys(Direction));
export {};
`,
      "02-numeric-enum.ts": `${expHeader("29-enums", "numeric enum")}
enum Status {
  Idle,
  Running,
  Done,
}
console.log(Status.Running, Status[1]);
export {};
`,
      "03-as-const-alt.ts": `${expHeader("29-enums", "as const alt")}
const Direction = {
  North: "NORTH",
  South: "SOUTH",
} as const;
type Direction = (typeof Direction)[keyof typeof Direction];
function move(d: Direction) {
  console.log(d);
}
move(Direction.North);
export {};
`,
    },
    predictions: {
      "P01-enum.md": makePred(
        "29-enums",
        "P01",
        "Enum runtime",
        "★★★",
        "01-string-enum.ts",
        `enum Direction { North = "NORTH" }\nconsole.log(typeof Direction);`,
        "Does a string enum leave a runtime object?"
      ),
      "P02-alt.md": makePred(
        "29-enums",
        "P02",
        "as const union",
        "★★★",
        "03-as-const-alt.ts",
        `type Direction = (typeof Direction)[keyof typeof Direction];`,
        "What is the Direction type?"
      ),
    },
    broken: [
      {
        file: "01-open-status.ts",
        task: "Replace open string with enum or const union",
        code: `${expHeader("29-enums", "open status")}
function setStatus(s: string) {
  console.log(s);
}
setStatus("runnign");
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-enum-vs-const.md",
        diff: "★★★",
        body: `# C01\n\nWrite a short ADR: when you allow enums in a codebase vs mandating \`as const\` unions. Include tree-shaking / isolatedModules concerns.\n`,
      },
    ],
    solutions: {
      "01-open-status.fixed.ts": `const Status = { Idle: "idle", Running: "running" } as const;\ntype Status = (typeof Status)[keyof typeof Status];\nfunction setStatus(s: Status) {\n  console.log(s);\n}\nsetStatus(Status.Running);\nexport {};\n`,
      "C01-hints.md": `Numeric enums reverse-map; const enums need careful emit; as const is often enough.\n`,
    },
    review: `# Review — 29\n\nstring/numeric enums · runtime · as const alternative\n`,
    knowledge: knowledgeBox({
      deep: "Enums are one of the few type-system features that emit runtime values (unless const enum).",
      why: "Named finite sets — but unions often suffice.",
      misconception: "Enums are erased like interfaces.",
      interview: "Enum vs union literal trade-offs.",
      production: "Default to `as const` + union unless enum interop is required.",
    }),
    workOrder: "1 string enum · 2 numeric · 3 as const · 4 broken · 5 C01",
  });

  // ─── 32 Declaration files ─────────────────────────────────────────────
  moduleKit({
    id: "32",
    slug: "declaration-files",
    title: "Declaration Files",
    difficulty: "★★★★☆",
    prereq: "12-type-aliases",
    nextModule: "33-ambient-types",
    coreQuestion: "How do `.d.ts` files describe JavaScript to the type checker?",
    outcomes: [
      "Read ambient module declarations",
      "Write a minimal typing for an untyped helper",
      "Explain `declare` vs implementation",
      "Know DefinitelyTyped / `@types` workflow at a high level",
    ],
    lessons: `# Lesson 1 — declare vs value

\`experiments/01-declare-sketch.ts\` · [\`predictions/P01-declare.md\`](./predictions/P01-declare.md)

# Lesson 2 — Typing an untyped function shape

\`experiments/02-shim-types.ts\` · [\`predictions/P02-shim.md\`](./predictions/P02-shim.md)

# Lesson 3 — Module shape notes

\`experiments/03-module-shape.ts\`
`,
    experiments: {
      "01-declare-sketch.ts": `${expHeader("32-declaration-files", "declare sketch")}
/**
 * In a real project this signature would live in legacy-greet.d.ts:
 *   declare function legacyGreet(name: string): string;
 * \`declare\` alone emits nothing — a JS implementation must exist at runtime.
 */
function legacyGreet(name: string): string {
  return \`hi \${name}\`;
}
console.log(legacyGreet("lab"));
console.log("Lesson: .d.ts describes; .js implements.");
export {};
`,
      "02-shim-types.ts": `${expHeader("32-declaration-files", "shim")}
/** Imagine this came from untyped JS — we only *describe* it */
type UntypedLib = {
  version: string;
  add(a: number, b: number): number;
};
const lib: UntypedLib = {
  version: "1.0.0",
  add: (a, b) => a + b,
};
console.log(lib.version, lib.add(2, 3));
export {};
`,
      "03-module-shape.ts": `${expHeader("32-declaration-files", "module shape")}
// Conceptual export shape for a JS module:
export type Widget = { id: string };
export function createWidget(id: string): Widget {
  return { id };
}
console.log(createWidget("w1"));
`,
    },
    predictions: {
      "P01-declare.md": makePred(
        "32-declaration-files",
        "P01",
        "declare",
        "★★★",
        "01-declare-sketch.ts",
        `declare function legacyGreet(name: string): string;`,
        "Does `declare` emit JavaScript by itself?"
      ),
      "P02-shim.md": makePred(
        "32-declaration-files",
        "P02",
        "Shim type",
        "★★",
        "02-shim-types.ts",
        `type UntypedLib = { add(a: number, b: number): number };`,
        "Where must the real implementation come from?"
      ),
    },
    broken: [
      {
        file: "01-any-global.ts",
        task: "Replace any global with a precise declare shape (local simulation OK)",
        code: `${expHeader("32-declaration-files", "any global")}
const g = globalThis as any;
g.APP_NAME = 42;
console.log(String(g.APP_NAME).toUpperCase());
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-write-dts.md",
        diff: "★★★★",
        body: `# C01 — Write a .d.ts sketch\n\nIn a markdown code block, write \`legacy-kit.d.ts\` for:\n\n\`\`\`js\nexports.add = (a, b) => a + b;\nexports.VERSION = "1";\n\`\`\`\n`,
      },
    ],
    solutions: {
      "01-any-global.fixed.ts": `type AppGlobal = typeof globalThis & { APP_NAME: string };\n(globalThis as AppGlobal).APP_NAME = "LITCODE";\nconsole.log((globalThis as AppGlobal).APP_NAME.toUpperCase());\nexport {};\n`,
      "C01-hints.md": `export function add(a: number, b: number): number; export const VERSION: string;\n`,
    },
    review: `# Review — 32\n\ndeclare · ambient vs value · @types workflow\n`,
    knowledge: knowledgeBox({
      deep: "`.d.ts` files are types-only; they must match real runtime or you lie to users.",
      why: "Untyped JS becomes usable under strict TypeScript.",
      misconception: "Installing `@types/foo` implements foo.",
      interview: "How do you type a legacy global?",
      production: "Prefer shipping types with the package; DefinitelyTyped as fallback.",
    }),
    workOrder: "1 declare · 2 shim · 3 module shape · 4 broken · 5 C01",
  });

  // ─── 45 Error handling ────────────────────────────────────────────────
  moduleKit({
    id: "45",
    slug: "error-handling",
    title: "Error Handling Types",
    difficulty: "★★★☆☆",
    prereq: "10-type-guards",
    nextModule: "46-runtime-validation",
    coreQuestion: "How do you type failures with `unknown` catches and Result models — without pretending types validate?",
    outcomes: [
      "Type `catch` clauses as `unknown`",
      "Normalize errors to a domain type",
      "Use Result for expected failures",
      "Avoid `catch (e: any)`",
    ],
    lessons: `# Lesson 1 — unknown catches

\`experiments/01-unknown-catch.ts\` · [\`predictions/P01-catch.md\`](./predictions/P01-catch.md)

# Lesson 2 — Normalize errors

\`experiments/02-normalize.ts\`

# Lesson 3 — Result for expected failure

\`experiments/03-result-errors.ts\` · [\`predictions/P02-result.md\`](./predictions/P02-result.md)
`,
    experiments: {
      "01-unknown-catch.ts": `${expHeader("45-error-handling", "unknown catch")}
function parse(json: string): unknown {
  try {
    return JSON.parse(json);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.log("parse failed:", msg);
    return null;
  }
}
console.log(parse("{\\"a\\":1}"), parse("nope"));
export {};
`,
      "02-normalize.ts": `${expHeader("45-error-handling", "normalize")}
type AppError = { code: string; message: string };
function toAppError(e: unknown): AppError {
  if (e instanceof Error) return { code: "ERR", message: e.message };
  return { code: "ERR", message: String(e) };
}
try {
  throw new Error("boom");
} catch (e) {
  console.log(toAppError(e));
}
export {};
`,
      "03-result-errors.ts": `${expHeader("45-error-handling", "result")}
type Result<T> = { ok: true; value: T } | { ok: false; error: string };
function divide(a: number, b: number): Result<number> {
  if (b === 0) return { ok: false, error: "div0" };
  return { ok: true, value: a / b };
}
console.log(divide(10, 2), divide(1, 0));
export {};
`,
    },
    predictions: {
      "P01-catch.md": makePred(
        "45-error-handling",
        "P01",
        "catch typing",
        "★★",
        "01-unknown-catch.ts",
        `catch (e: unknown) { console.log(e.message); }`,
        "Why is `e.message` illegal before narrowing?"
      ),
      "P02-result.md": makePred(
        "45-error-handling",
        "P02",
        "Result vs throw",
        "★★★",
        "03-result-errors.ts",
        `divide(1, 0)`,
        "When prefer Result over throw?"
      ),
    },
    broken: [
      {
        file: "01-any-catch.ts",
        task: "Remove any from catch and narrow safely",
        code: `${expHeader("45-error-handling", "any catch")}
try {
  JSON.parse("{");
} catch (e: any) {
  console.log(e.message.toUpperCase());
}
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-try-map.md",
        diff: "★★★",
        body: `# C01\n\nWrite \`function tryMap<T, U>(r: Result<T>, f: (t: T) => U): Result<U>\`.\n`,
      },
    ],
    solutions: {
      "01-any-catch.fixed.ts": `try {\n  JSON.parse("{");\n} catch (e: unknown) {\n  const msg = e instanceof Error ? e.message : String(e);\n  console.log(msg.toUpperCase());\n}\nexport {};\n`,
      "C01-hints.md": `If !r.ok return r; else map value.\n`,
    },
    review: `# Review — 45\n\nunknown catch · normalize · Result\n`,
    knowledge: knowledgeBox({
      deep: "Thrown values are `unknown` in modern TS — anything can be thrown.",
      why: "Honest failure typing prevents silent `any` propagation.",
      misconception: "`catch (e: Error)` is always valid.",
      interview: "How do you type errors at API boundaries?",
      production: "Expected domain failures → Result; truly exceptional → throw.",
    }),
    workOrder: "1 unknown catch · 2 normalize · 3 Result · 4 broken · 5 C01",
  });

  // ─── 48 API design ────────────────────────────────────────────────────
  moduleKit({
    id: "48",
    slug: "api-design",
    title: "Type-Safe API Design",
    difficulty: "★★★★☆",
    prereq: "45-error-handling",
    nextModule: "49-async-types",
    coreQuestion: "How do you design request → validate → domain → response without trusting types alone?",
    outcomes: [
      "Separate wire types from domain types",
      "Type a handler that validates unknown input",
      "Return typed success/error envelopes",
      "Keep DTOs and domain models from leaking into each other",
    ],
    lessons: `# Lesson 1 — Wire vs domain

\`experiments/01-wire-domain.ts\` · [\`predictions/P01-wire.md\`](./predictions/P01-wire.md)

# Lesson 2 — Validate unknown

\`experiments/02-validate.ts\` · [\`predictions/P02-val.md\`](./predictions/P02-val.md)

# Lesson 3 — Envelope responses

\`experiments/03-envelope.ts\`
`,
    experiments: {
      "01-wire-domain.ts": `${expHeader("48-api-design", "wire vs domain")}
type UserDTO = { id: string; name: string };
type User = { id: string; displayName: string };
function toDomain(dto: UserDTO): User {
  return { id: dto.id, displayName: dto.name };
}
console.log(toDomain({ id: "1", name: "Ada" }));
export {};
`,
      "02-validate.ts": `${expHeader("48-api-design", "validate")}
type UserDTO = { id: string; name: string };
function parseUser(raw: unknown): UserDTO | null {
  if (typeof raw !== "object" || raw === null) return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || typeof r.name !== "string") return null;
  return { id: r.id, name: r.name };
}
console.log(parseUser({ id: "1", name: "Ada" }), parseUser({ id: 1 }));
export {};
`,
      "03-envelope.ts": `${expHeader("48-api-design", "envelope")}
type ApiOk<T> = { ok: true; data: T };
type ApiErr = { ok: false; error: { code: string; message: string } };
type ApiResponse<T> = ApiOk<T> | ApiErr;
function ok<T>(data: T): ApiOk<T> {
  return { ok: true, data };
}
function err(code: string, message: string): ApiErr {
  return { ok: false, error: { code, message } };
}
const res: ApiResponse<{ id: string }> = ok({ id: "1" });
console.log(res);
void err;
export {};
`,
    },
    predictions: {
      "P01-wire.md": makePred(
        "48-api-design",
        "P01",
        "DTO mapping",
        "★★",
        "01-wire-domain.ts",
        `function toDomain(dto: UserDTO): User`,
        "Why not use UserDTO everywhere in the app?"
      ),
      "P02-val.md": makePred(
        "48-api-design",
        "P02",
        "parseUser",
        "★★★",
        "02-validate.ts",
        `parseUser({ id: 1, name: "Ada" })`,
        "What should be returned and why?"
      ),
    },
    broken: [
      {
        file: "01-trust-json.ts",
        task: "Stop casting JSON.parse directly to a domain type",
        code: `${expHeader("48-api-design", "trust json")}
type User = { id: string; name: string };
function load(json: string): User {
  return JSON.parse(json) as User;
}
console.log(load("{\\"id\\":1}"));
export {};
`,
      },
    ],
    challenges: [
      {
        id: "C01",
        file: "C01-handler.md",
        diff: "★★★★",
        body: `# C01 — Handler\n\nWrite \`function createUser(raw: unknown): ApiResponse<User>\` that validates, maps to domain, and returns ok/err envelopes.\n`,
      },
    ],
    solutions: {
      "01-trust-json.fixed.ts": `type UserDTO = { id: string; name: string };\nfunction parseUser(raw: unknown): UserDTO | null {\n  if (typeof raw !== "object" || raw === null) return null;\n  const r = raw as Record<string, unknown>;\n  if (typeof r.id !== "string" || typeof r.name !== "string") return null;\n  return { id: r.id, name: r.name };\n}\nfunction load(json: string): UserDTO | null {\n  try {\n    return parseUser(JSON.parse(json));\n  } catch {\n    return null;\n  }\n}\nconsole.log(load('{"id":"1","name":"Ada"}'), load('{"id":1}'));\nexport {};\n`,
      "C01-hints.md": `parse → map → ok(); on failure err("VALIDATION", ...).\n`,
    },
    review: `# Review — 48\n\nwire vs domain · validate unknown · envelopes\n`,
    knowledge: knowledgeBox({
      deep: "Types on DTOs do not validate JSON — parsers do.",
      why: "Clear boundaries prevent corrupt data from becoming trusted domain objects.",
      misconception: "`as User` after JSON.parse is fine in production.",
      interview: "Design a typed HTTP handler end-to-end.",
      production: "One mapper at the edge; domain stays pure.",
    }),
    workOrder: "1 wire/domain · 2 validate · 3 envelope · 4 broken · 5 C01",
  });

  // ─── Scaffolds (next band only) ───────────────────────────────────────
  const untilReady =
    "complete the ready path `00`–`23`, `26`, `29`, `32`, `45`, `48` first — then expand this scaffold.";

  const scaffolds = [
    {
      id: "24",
      slug: "recursive-types",
      title: "Recursive Types",
      idea: "JSONValue-style recursion, depth limits, and practical tree models.",
      prereq: "23-template-literal-types",
    },
    {
      id: "25",
      slug: "distributive-types",
      title: "Distributive Types Deep Dive",
      idea: "Anti-distribution patterns, union mapping, and library-scale conditionals.",
      prereq: "21-conditional-types",
    },
    {
      id: "27",
      slug: "classes",
      title: "Classes",
      idea: "TS modifiers vs runtime; parameter properties; implements.",
      prereq: "13-structural-typing",
    },
    {
      id: "28",
      slug: "abstract-classes",
      title: "Abstract Classes",
      idea: "Abstract members and when interfaces win instead.",
      prereq: "27-classes",
    },
    {
      id: "30",
      slug: "namespaces",
      title: "Namespaces",
      idea: "Legacy namespaces, merging, and when you still see them.",
      prereq: "29-enums",
    },
    {
      id: "31",
      slug: "modules",
      title: "Modules",
      idea: "ESM, `import type`, and type-only boundaries.",
      prereq: "12-type-aliases",
    },
    {
      id: "33",
      slug: "ambient-types",
      title: "Ambient Types",
      idea: "`declare global`, ambient modules, and augmentation hazards.",
      prereq: "32-declaration-files",
    },
    {
      id: "34",
      slug: "module-resolution",
      title: "Module Resolution",
      idea: "Resolution vs execution; bundler vs node10/node16/nodenext.",
      prereq: "31-modules",
    },
    {
      id: "40",
      slug: "tsconfig",
      title: "tsconfig Laboratory",
      idea: "Break/fix important compiler options with experiments.",
      prereq: "01-toolchain",
    },
    {
      id: "41",
      slug: "compiler",
      title: "Compiler Modes",
      idea: "`tsc` emit vs check; incremental; diagnostics.",
      prereq: "40-tsconfig",
    },
    {
      id: "42",
      slug: "build-pipelines",
      title: "Build Pipelines",
      idea: "Bundlers vs `tsc`; when each fits.",
      prereq: "41-compiler",
    },
    {
      id: "43",
      slug: "source-maps",
      title: "Source Maps",
      idea: "Debugging emitted code and map fidelity.",
      prereq: "41-compiler",
    },
    {
      id: "44",
      slug: "project-references",
      title: "Project References",
      idea: "Monorepo-scale TypeScript project references.",
      prereq: "42-build-pipelines",
    },
    {
      id: "46",
      slug: "runtime-validation",
      title: "Runtime Validation",
      idea: "Untrusted data → trusted types (library-light).",
      prereq: "45-error-handling",
    },
    {
      id: "47",
      slug: "schema-validation",
      title: "Schema Validation",
      idea: "Schema concepts without locking to one library.",
      prereq: "46-runtime-validation",
    },
    {
      id: "49",
      slug: "async-types",
      title: "Async Types",
      idea: "`Promise<T>`, `Awaited`, async function typing.",
      prereq: "22-infer",
    },
    {
      id: "50",
      slug: "promises",
      title: "Promise Combinators",
      idea: "Combinators and tuple inference for Promise.all.",
      prereq: "49-async-types",
    },
    {
      id: "61",
      slug: "testing",
      title: "Testing with Types",
      idea: "Runtime tests + typed mocks; type-level tests overview.",
      prereq: "48-api-design",
    },
  ];

  for (const s of scaffolds) {
    scaffoldModule({ ...s, until: untilReady });
  }

  console.log("Professional + scaffolds written.");
}
