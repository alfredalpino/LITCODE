/**
 * Browser-only language execution catalog.
 *
 * Active today (lazy CDN WASM where noted):
 * - JavaScript — AsyncFunction
 * - TypeScript — Sucrase → JS
 * - Python / Python3 — Pyodide
 * - Ruby — ruby.wasm (@ruby/4.0-wasm-wasi)
 * - PHP — php-wasm (PhpWeb 8.4)
 *
 * Planned (documented engines; not remote sandboxes):
 * - Go — Yaegi WASM (yaegi-browser)
 * - C / C++ — Wasmer JS SDK + clang registry (~30–100MB)
 * - Java — CheerpJ (license review)
 * - C# — .NET mono/Blazor WASM
 * - quickjs-emscripten — stronger JS isolation
 *
 * Blocked for interactive interview UX without a remote compiler:
 * - Rust, Dart, Kotlin, Swift, Scala, Elixir, Erlang, Racket
 *
 * Compiled languages (C++, Rust, Java, …) run via Judge0 CE at `/api/execute`.
 */

export const BROWSER_RUNNABLE_LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "python3",
  "ruby",
  "php",
] as const;

export type BrowserRunnableLanguage = (typeof BROWSER_RUNNABLE_LANGUAGES)[number];

export function isBrowserRunnable(lang: string): lang is BrowserRunnableLanguage {
  return (BROWSER_RUNNABLE_LANGUAGES as readonly string[]).includes(lang);
}

export type RunnerAvailabilityStatus =
  | "ready"
  | "planned"
  | "unsupported";

export type RunnerAvailability = {
  status: RunnerAvailabilityStatus;
  /** Short engine label for console / badges */
  engine: string;
  /** User-facing note */
  note: string;
  /** Approximate first-download size hint */
  sizeHint?: string;
};

/** Future / active engine slots for docs + UI. */
export type BrowserRunnerSlot =
  | "js-async-function"
  | "ts-sucrase"
  | "python-pyodide"
  | "ruby-wasm"
  | "php-wasm"
  | "go-yaegi-wasm"
  | "c-wasmer-clang"
  | "cpp-wasmer-clang"
  | "java-cheerpj"
  | "csharp-dotnet-wasm"
  | "js-quickjs-wasm";

export const BROWSER_RUNNER_STATUS: Record<
  BrowserRunnerSlot,
  "active" | "planned"
> = {
  "js-async-function": "active",
  "ts-sucrase": "active",
  "python-pyodide": "active",
  "ruby-wasm": "active",
  "php-wasm": "active",
  "go-yaegi-wasm": "planned",
  "c-wasmer-clang": "planned",
  "cpp-wasmer-clang": "planned",
  "java-cheerpj": "planned",
  "csharp-dotnet-wasm": "planned",
  "js-quickjs-wasm": "planned",
};

const READY: Record<string, RunnerAvailability> = {
  javascript: {
    status: "ready",
    engine: "AsyncFunction",
    note: "Runs in-page in your browser.",
  },
  typescript: {
    status: "ready",
    engine: "Sucrase",
    note: "Transpiles to JavaScript in the browser.",
  },
  python: {
    status: "ready",
    engine: "Pyodide",
    note: "CPython via WebAssembly (CDN). First run downloads the runtime.",
    sizeHint: "~10–30 MB",
  },
  python3: {
    status: "ready",
    engine: "Pyodide",
    note: "CPython via WebAssembly (CDN). First run downloads the runtime.",
    sizeHint: "~10–30 MB",
  },
  ruby: {
    status: "ready",
    engine: "ruby.wasm",
    note: "Official CRuby WASI build. First run downloads the runtime.",
    sizeHint: "~15–40 MB",
  },
  php: {
    status: "ready",
    engine: "php-wasm",
    note: "PHP 8.4 via WebAssembly. First run downloads the runtime.",
    sizeHint: "~5–15 MB",
  },
};

const PLANNED: Record<string, RunnerAvailability> = {
  golang: {
    status: "planned",
    engine: "Yaegi WASM",
    note: "Go interpreter in WASM is next — vendor yaegi-browser (~3 MB gz).",
    sizeHint: "~3–12 MB",
  },
  c: {
    status: "planned",
    engine: "Wasmer + clang",
    note: "In-browser clang exists but is huge; needs confirm-before-download UX.",
    sizeHint: "~30–100 MB",
  },
  cpp: {
    status: "planned",
    engine: "Wasmer + clang++",
    note: "Same toolchain path as C once clang WASM is wired.",
    sizeHint: "~30–100 MB",
  },
  java: {
    status: "planned",
    engine: "CheerpJ",
    note: "JVM-in-browser is feasible after license review.",
    sizeHint: "tens of MB",
  },
  csharp: {
    status: "planned",
    engine: ".NET WASM",
    note: "Blazor/mono runtime is heavy; queued after Go/C.",
    sizeHint: "large",
  },
};

const UNSUPPORTED_NOTE =
  "No mature in-browser interpreter/compiler for interview-style Run/Submit yet. Code stays editable; switch language to run tests, or watch for a WASM runtime.";

export function getRunnerAvailability(lang: string): RunnerAvailability {
  if (READY[lang]) return READY[lang];
  if (PLANNED[lang]) return PLANNED[lang];
  return {
    status: "unsupported",
    engine: "none",
    note: UNSUPPORTED_NOTE,
  };
}

/** Human list for picker footnotes. */
export function runnableLanguageLabels(): string {
  return "JavaScript · TypeScript · Python · Ruby · PHP";
}
