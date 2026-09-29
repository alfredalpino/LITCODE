#!/usr/bin/env node
/**
 * Scaffolds new LITCODE laboratory language folders (Ruby, Rust, C/C++, Java)
 * as *honest scaffolds* — topic skeletons + titles only, no runnable labs yet.
 *
 * Each module emits:
 *   NN-slug/README.md   (marked "**Status:** scaffold")
 *   NN-slug/STATUS.md   ("status: scaffold")
 * Plus a lab-root README.md + CURRICULUM.md (become catalog references).
 *
 * Topic outlines are derived from the PUBLIC roadmap.sh role roadmaps
 * (roadmap.sh/rust, /cpp, /java) and community Ruby learning outlines.
 * Only high-level topic titles + prompts are scaffolded here — no paid or
 * copyrighted lesson content is copied. sync-content.mjs will treat every
 * module as "scaffold" (0 ready) until a real lab is authored.
 *
 * Idempotent: existing module README/STATUS files are left untouched unless
 * --force is passed, so hand-authored labs are never clobbered.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FORCE = process.argv.includes("--force");

/** @typedef {{ slug: string; title: string; idea: string; prereq?: string }} Topic */

/**
 * @type {Array<{
 *   dir: string;
 *   name: string;
 *   short: string;
 *   tagline: string;
 *   roadmap: string;
 *   overview: string;
 *   modules: Topic[];
 * }>}
 */
const LABS = [
  {
    dir: "ruby-laboratory",
    name: "Ruby Laboratory",
    short: "Ruby",
    tagline: "Everything is an object. Learn Ruby by predicting message sends, then running.",
    roadmap: "Community Ruby learning outline (rubymonstas / coders.sh Ruby track — language track only, not Rails).",
    overview:
      "Ruby language fundamentals: values, objects, methods, blocks, modules, and metaprogramming. The Rails framework is intentionally out of scope for this language lab.",
    modules: [
      { slug: "environment-runtime", title: "Environment & the Ruby Runtime", idea: "rbenv/ruby install, irb/pry REPL, how MRI parses and evaluates a script, everything-is-an-object mental model." },
      { slug: "syntax-values-types", title: "Syntax, Values & Types", idea: "Integers, floats, booleans, nil, symbols vs strings, truthiness (only nil/false are falsey), object_id.", prereq: "environment-runtime" },
      { slug: "control-flow-methods", title: "Control Flow & Methods", idea: "if/unless/case, while/until, method definition, implicit return, default & keyword args, splat args." },
      { slug: "collections-enumerable", title: "Collections: Arrays, Hashes & Enumerable", idea: "Array/Hash literals, the Enumerable module (map/select/reduce/each_with_object), lazy enumerators." },
      { slug: "strings-symbols", title: "Strings & Symbols", idea: "String mutability, interpolation, format, frozen string literals, symbol interning and when to use each." },
      { slug: "objects-classes", title: "Objects & Classes", idea: "Defining classes, initialize, instance vs class variables, attr_accessor, self, the method lookup chain." },
      { slug: "modules-mixins", title: "Modules & Mixins", idea: "Namespacing, include vs extend vs prepend, Comparable/Enumerable mixins, ancestors chain." },
      { slug: "blocks-procs-lambdas", title: "Blocks, Procs & Lambdas", idea: "yield & block_given?, &block conversion, Proc vs lambda arity/return semantics, closures over scope." },
      { slug: "error-handling", title: "Error Handling & Exceptions", idea: "begin/rescue/ensure/retry, exception hierarchy, raising and defining custom errors, ensure vs return." },
      { slug: "metaprogramming", title: "Metaprogramming", idea: "define_method, method_missing/respond_to_missing?, send, open classes, instance_variable_get/set." },
      { slug: "testing-basics", title: "Testing (Minitest & RSpec basics)", idea: "Minitest assertions vs RSpec expectations, arrange/act/assert, red-green loop, test doubles overview." },
    ],
  },
  {
    dir: "rust-laboratory",
    name: "Rust Laboratory",
    short: "Rust",
    tagline: "The borrow checker is a teacher. Predict what compiles, then let rustc grade you.",
    roadmap: "roadmap.sh/rust (Rust Developer roadmap) — Introduction, Language Basics, Data Structures, Ownership, Error Handling, Concurrency, Modules/Crates, Macros, Traits/Generics.",
    overview:
      "Rust's ownership model, type system, and fearless concurrency. Focus is on the language and std; web/embedded specialization tracks are out of scope for this lab.",
    modules: [
      { slug: "introduction-toolchain", title: "Introduction & Toolchain", idea: "What/why Rust, rustup, cargo new/run/build, the Rust Playground, edition model, rustfmt/clippy." },
      { slug: "variables-types-constants", title: "Variables, Data Types & Constants", idea: "let/let mut, shadowing, scalar (i32/f64/bool/char) & compound (tuple/array) types, const vs static.", prereq: "introduction-toolchain" },
      { slug: "control-flow", title: "Control Flow & Constructs", idea: "if as expression, loop/while/for, loop labels & break values, ranges, match basics." },
      { slug: "functions-methods", title: "Functions & Method Syntax", idea: "fn signatures, expressions vs statements, return, impl methods, associated functions." },
      { slug: "ownership-borrowing", title: "Ownership & Borrowing", idea: "Move semantics, &T vs &mut T, the borrow checker rules, slices, stack vs heap, Copy vs Clone.", prereq: "variables-types-constants" },
      { slug: "structs-enums-matching", title: "Structs, Enums & Pattern Matching", idea: "struct/tuple/unit structs, enums with data, match exhaustiveness, if let/while let, Option destructuring." },
      { slug: "error-handling", title: "Error Handling (Option, Result, ?)", idea: "Option vs Result, the ? operator, propagating errors, custom error types, panic! vs recoverable errors.", prereq: "structs-enums-matching" },
      { slug: "traits-generics", title: "Traits & Generics", idea: "Trait definitions & impls, trait bounds, associated types, generic functions/structs, trait objects (dyn)." },
      { slug: "collections", title: "Collections & Data Structures", idea: "Vec, String, HashMap/HashSet, BTreeMap, iterators & adaptors, ownership interplay with collections." },
      { slug: "modules-crates-cargo", title: "Modules, Crates & Cargo", idea: "mod/use/pub visibility, crate layout, dependency management, workspaces, publishing to crates.io." },
      { slug: "concurrency", title: "Concurrency & Parallelism", idea: "threads, move closures, channels (mpsc), Arc<Mutex<T>>, Send/Sync marker traits, data-race freedom." },
      { slug: "macros-metaprogramming", title: "Macros & Metaprogramming", idea: "declarative macro_rules!, an overview of procedural macros & custom derive, when macros beat functions." },
    ],
  },
  {
    dir: "cpp-laboratory",
    name: "C / C++ Laboratory",
    short: "C/C++",
    tagline: "You manage the memory. Predict lifetimes and undefined behavior, then run.",
    roadmap: "roadmap.sh/cpp (C++ Developer roadmap) + algomaster/CppBetterExplained sequencing — fundamentals, OOP, pointers/memory, STL, templates, modern C++, concurrency.",
    overview:
      "C and C++ from the machine up: the compilation model, pointers and manual memory, RAII, the STL, templates, and modern C++ (C++11–20). C is treated as the shared procedural core.",
    modules: [
      { slug: "introduction-toolchain", title: "Introduction & Toolchain", idea: "C vs C++ history, GCC/Clang/MSVC, preprocess → compile → assemble → link, translation units, headers." },
      { slug: "syntax-variables-types", title: "Syntax, Variables & Data Types", idea: "Fundamental types & sizes, const/constexpr, integer promotion & narrowing, cin/cout, auto.", prereq: "introduction-toolchain" },
      { slug: "control-flow-functions", title: "Control Flow & Functions", idea: "if/switch/loops, function declaration vs definition, pass-by-value vs reference, overloading, default args." },
      { slug: "arrays-strings-vectors", title: "Arrays, Strings & Vectors", idea: "C arrays & decay, char* vs std::string, std::vector basics, range-based for, bounds & buffer safety." },
      { slug: "pointers-references-memory", title: "Pointers, References & Memory", idea: "Address-of/deref, pointer arithmetic, references, new/delete, stack vs heap, dangling pointers & leaks.", prereq: "syntax-variables-types" },
      { slug: "oop-classes", title: "Object-Oriented C++ (Classes)", idea: "class vs struct, constructors/destructors, encapsulation, member init lists, the rule of three/five." },
      { slug: "inheritance-polymorphism", title: "Inheritance & Polymorphism", idea: "Public inheritance, virtual functions & the vtable, abstract classes, override/final, slicing.", prereq: "oop-classes" },
      { slug: "templates-generics", title: "Templates & Generic Programming", idea: "Function & class templates, template argument deduction, specialization, an intro to concepts (C++20)." },
      { slug: "stl", title: "The Standard Template Library (STL)", idea: "Containers (vector/map/set/unordered_map), iterators, algorithms (sort/find/transform), functors & lambdas." },
      { slug: "raii-smart-pointers", title: "Resource Management & RAII", idea: "RAII idiom, unique_ptr/shared_ptr/weak_ptr, move semantics & rvalue references, ownership transfer.", prereq: "pointers-references-memory" },
      { slug: "modern-cpp", title: "Modern C++ (C++11/17/20)", idea: "auto/decltype, structured bindings, optional/variant, ranges overview, constexpr, when to prefer them." },
      { slug: "concurrency", title: "Concurrency & Multithreading", idea: "std::thread, mutex & lock_guard, condition_variable, atomics, data races & the memory model overview." },
    ],
  },
  {
    dir: "java-laboratory",
    name: "Java Laboratory",
    short: "Java",
    tagline: "Compile to bytecode, run on the JVM. Predict object behavior, then run.",
    roadmap: "roadmap.sh/java (modern Java Developer roadmap) — basics, OOP, collections, exceptions, functional Java, concurrency, JVM. Frameworks (Spring) are out of scope here.",
    overview:
      "Core Java and the JVM: syntax, object-oriented design, the collections framework, generics, functional Java (lambdas/streams), and concurrency. Enterprise frameworks are out of scope for this language lab.",
    modules: [
      { slug: "ecosystem-jvm", title: "Java Ecosystem & the JVM", idea: "JDK vs JRE vs JVM, javac → bytecode → JIT, the lifecycle of a program, main method, classpath." },
      { slug: "syntax-variables-types", title: "Basic Syntax, Variables & Types", idea: "Primitives vs references, var, autoboxing, type casting, literals, String immutability.", prereq: "ecosystem-jvm" },
      { slug: "control-flow-methods", title: "Control Flow, Loops & Methods", idea: "if/switch (incl. switch expressions), loops, method declaration, overloading, varargs, pass-by-value." },
      { slug: "arrays-strings-math", title: "Arrays, Strings & Math", idea: "Array creation & iteration, String vs StringBuilder, common String methods, Math utilities." },
      { slug: "oop-classes-objects", title: "Object-Oriented Programming Basics", idea: "Classes/objects, fields & methods, constructors, access modifiers, static keyword, packages." },
      { slug: "encapsulation-inheritance-polymorphism", title: "Encapsulation, Inheritance & Polymorphism", idea: "Getters/setters, extends, super, method overriding, dynamic dispatch, final, Object methods.", prereq: "oop-classes-objects" },
      { slug: "interfaces-abstract-classes", title: "Interfaces & Abstract Classes", idea: "Abstract vs interface, default methods, multiple interface inheritance, enums, records." },
      { slug: "exception-handling", title: "Exception Handling", idea: "Checked vs unchecked, try/catch/finally, try-with-resources, throw/throws, custom exceptions." },
      { slug: "collections-generics", title: "Collections Framework & Generics", idea: "List/Set/Map/Queue, ArrayList vs LinkedList, iterators, generic types & bounded wildcards.", prereq: "oop-classes-objects" },
      { slug: "functional-java-streams", title: "Functional Java (Lambdas & Streams)", idea: "Functional interfaces, lambdas & method references, the Stream pipeline, Optional, collectors." },
      { slug: "concurrency-threads", title: "Concurrency & Threads", idea: "Thread/Runnable, synchronization, the Java Memory Model overview, ExecutorService, virtual threads." },
      { slug: "io-files-modules", title: "I/O, Files & Modules", idea: "java.io vs java.nio, reading/writing files, serialization overview, the module system (JPMS) intro." },
    ],
  },
];

function pad2(n) {
  return String(n).padStart(2, "0");
}

function moduleReadme(labShort, order, topic) {
  const prereq = topic.prereq
    ? `**Prerequisites:** ${topic.prereq}\n\n`
    : "";
  return `# ${pad2(order)} — ${topic.title}

**Status:** scaffold

This ${labShort} module is a planned topic skeleton derived from the public roadmap
outline. It is **not a finished LITCODE lab yet** — there are no runnable
experiments, predictions, or challenges here. Do not treat the sidebar entry as
a completed laboratory.

**What this lab will land later:** ${topic.idea}

${prereq}**LITCODE loop (once authored):** Predict → Run → Break → Explain, with
runnable snippets and a predictions gate.

Until then, use the ready labs in JavaScript, Python, or TypeScript for the full
predict-run-break-explain experience.
`;
}

function labReadme(lab) {
  const list = lab.modules
    .map((m, i) => `- ${pad2(i)} — ${m.title}`)
    .join("\n");
  return `# ${lab.name}

**Status:** scaffold (topic skeletons only — 0 ready modules)

${lab.overview}

## Planned curriculum

${list}

## Provenance

${lab.roadmap}

Only high-level topic titles and one-line prompts are scaffolded here. No paid or
copyrighted lesson content has been copied. Each module will be promoted to
"ready" only once it ships real runnable labs (predictions + experiments +
challenges), so the "ready" counts on /labs stay honest.
`;
}

function curriculum(lab) {
  const rows = lab.modules
    .map(
      (m, i) =>
        `| ${pad2(i)} | ${m.title} | ${m.idea}${m.prereq ? ` (after ${m.prereq})` : ""} |`
    )
    .join("\n");
  return `# ${lab.short} Curriculum

Derived from: ${lab.roadmap}

| # | Module | Planned focus |
| --- | --- | --- |
${rows}

All modules are currently **scaffold** status. See each module's \`STATUS.md\`.
`;
}

let created = 0;
let skipped = 0;

for (const lab of LABS) {
  const labRoot = path.join(ROOT, lab.dir);
  fs.mkdirSync(labRoot, { recursive: true });

  // Lab-root reference docs
  for (const [file, content] of [
    ["README.md", labReadme(lab)],
    ["CURRICULUM.md", curriculum(lab)],
  ]) {
    const dest = path.join(labRoot, file);
    if (!fs.existsSync(dest) || FORCE) {
      fs.writeFileSync(dest, content);
      created++;
    } else {
      skipped++;
    }
  }

  lab.modules.forEach((topic, i) => {
    const modDir = path.join(labRoot, `${pad2(i)}-${topic.slug}`);
    fs.mkdirSync(modDir, { recursive: true });
    const files = [
      ["README.md", moduleReadme(lab.short, i, topic)],
      ["STATUS.md", "status: scaffold\n"],
    ];
    for (const [file, content] of files) {
      const dest = path.join(modDir, file);
      if (!fs.existsSync(dest) || FORCE) {
        fs.writeFileSync(dest, content);
        created++;
      } else {
        skipped++;
      }
    }
  });

  console.log(`Scaffolded ${lab.short}: ${lab.modules.length} modules → ${lab.dir}/`);
}

console.log(`\nDone. ${created} files written, ${skipped} left untouched.`);
