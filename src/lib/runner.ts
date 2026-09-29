import type { ConsoleLine, ConsoleLineKind } from "../types";
import {
  getRunnerAvailability,
  isBrowserRunnable,
  runnableLanguageLabels,
} from "./browser-runners";
import { buildRemoteJudgeProgram, parseRemoteCaseResults } from "./judge-harness";
import {
  executeRemote,
  remoteExecutable,
  remoteResultToLines,
} from "./remote-execute";

const RUBY_WASM_WASI_UMD =
  "https://cdn.jsdelivr.net/npm/@ruby/wasm-wasi@2.10.1/dist/browser.umd.js";
const RUBY_STDLIB_WASM =
  "https://cdn.jsdelivr.net/npm/@ruby/4.0-wasm-wasi@2.10.1/dist/ruby+stdlib.wasm";
const PHP_WASM_CDN = "https://cdn.jsdelivr.net/npm/php-wasm@0.1.0";

function line(kind: ConsoleLineKind, text: string): ConsoleLine {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    kind,
    text,
    ts: Date.now(),
  };
}

function stringify(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "bigint") return value.toString() + "n";
  if (value instanceof Error) return value.stack || value.message;
  if (typeof value === "function") return `[Function ${value.name || "anonymous"}]`;
  try {
    return JSON.stringify(value, (_k, v) =>
      typeof v === "bigint" ? v.toString() + "n" : v
    , 2) ?? String(value);
  } catch {
    return String(value);
  }
}

export type RunResult = { lines: ConsoleLine[]; ok: boolean; value?: unknown };

const NODE_HINT =
  "This snippet uses Node-only APIs (require/process/fs). Run it with Node locally, or rewrite using browser-safe APIs.";

function rewriteForBrowser(code: string): { code: string; warnings: string[] } {
  const warnings: string[] = [];
  let next = code;

  if (/\brequire\s*\(/.test(next) || /\bmodule\.exports\b/.test(next) || /\bexports\./.test(next)) {
    warnings.push(NODE_HINT);
  }
  if (/\bprocess\./.test(next)) {
    warnings.push("process.* is Node-specific; it is stubbed in this sandbox.");
  }

  // Strip TypeScript/ESM export noise when running as a script body
  next = next
    .replace(/^export\s+default\s+/gm, "")
    .replace(/^export\s+(?:async\s+)?function\s+/gm, "function ")
    .replace(/^export\s+(?:const|let|var|class|enum|type|interface)\s+/gm, (m) =>
      m.replace(/^export\s+/, "")
    )
    .replace(/^export\s*\{[^}]*\}\s*;?\s*$/gm, "");

  return { code: next, warnings };
}

export async function runJavaScript(code: string): Promise<RunResult> {
  const lines: ConsoleLine[] = [];
  const push =
    (kind: ConsoleLineKind) =>
    (...args: unknown[]) => {
      lines.push(line(kind, args.map(stringify).join(" ")));
    };

  const prepared = rewriteForBrowser(code);
  for (const w of prepared.warnings) lines.push(line("warn", w));

  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
      ...args: string[]
    ) => (...a: unknown[]) => Promise<unknown>;

    const sandboxConsole = {
      log: push("log"),
      info: push("info"),
      warn: push("warn"),
      error: push("error"),
      debug: push("info"),
      table: (data: unknown) => push("log")(stringify(data)),
      clear: () => {
        lines.length = 0;
      },
      time: () => undefined,
      timeEnd: () => undefined,
    };

    const processStub = {
      env: {},
      argv: ["browser"],
      cwd: () => "/",
      version: "browser-sandbox",
      versions: { node: "browser" },
      platform: "browser",
      nextTick: (fn: () => void) => queueMicrotask(fn),
      exit: () => {
        throw new Error("process.exit() is not available in the browser sandbox");
      },
    };

    const fn = new AsyncFunction(
      "console",
      "process",
      "require",
      "module",
      "exports",
      `"use strict";\n${prepared.code}`
    );

    const moduleObj = { exports: {} as Record<string, unknown> };
    const requireStub = (id: string) => {
      throw new Error(`require('${id}') is not available in the browser. ${NODE_HINT}`);
    };

    const result = await fn(
      sandboxConsole,
      processStub,
      requireStub,
      moduleObj,
      moduleObj.exports
    );

    const exported =
      result !== undefined
        ? result
        : Object.keys(moduleObj.exports).length
          ? moduleObj.exports
          : undefined;

    if (exported !== undefined) {
      lines.push(line("info", `⇒ ${stringify(exported)}`));
    }
    if (lines.filter((l) => l.kind !== "warn").length === 0) {
      lines.push(line("info", "Ran successfully (no console output)."));
    }
    return { lines, ok: true, value: exported };
  } catch (err) {
    const msg = stringify(err);
    lines.push(line("error", msg));
    if (/require is not defined|process is not defined|exports is not defined/i.test(msg)) {
      lines.push(line("warn", NODE_HINT));
    }
    return { lines, ok: false };
  }
}

export async function runTypeScript(code: string): Promise<RunResult> {
  try {
    const { transform } = await import("sucrase");
    const { code: js } = transform(code, {
      transforms: ["typescript", "imports"],
      disableESTransforms: true,
    });
    return runJavaScript(js);
  } catch (err) {
    return { lines: [line("error", `TypeScript compile error: ${stringify(err)}`)], ok: false };
  }
}

type PyodideInterface = {
  runPythonAsync: (code: string) => Promise<unknown>;
  setStdout: (opts: { batched: (s: string) => void }) => void;
  setStderr: (opts: { batched: (s: string) => void }) => void;
};

let pyodidePromise: Promise<PyodideInterface> | null = null;

async function loadPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    pyodidePromise = (async () => {
      const g = globalThis as unknown as {
        loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideInterface>;
      };
      if (!g.loadPyodide) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/pyodide.js";
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error("Failed to load Pyodide from CDN. Check network access."));
          document.head.appendChild(script);
        });
      }
      return g.loadPyodide!({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.27.5/full/",
      });
    })();
  }
  return pyodidePromise;
}

export async function runPython(code: string): Promise<RunResult> {
  const lines: ConsoleLine[] = [];
  try {
    lines.push(line("info", "Loading Python runtime (first run may take a moment)…"));
    const py = await loadPyodide();
    lines.pop();

    py.setStdout({
      batched: (s) => {
        if (s) lines.push(line("log", s.replace(/\n$/, "")));
      },
    });
    py.setStderr({
      batched: (s) => {
        if (s) lines.push(line("error", s.replace(/\n$/, "")));
      },
    });

    const result = await py.runPythonAsync(code);
    if (result !== undefined && result !== null) {
      const text = typeof result === "string" ? result : String(result);
      if (text && text !== "undefined" && text !== "None") {
        lines.push(line("info", `⇒ ${text}`));
      }
    }
    if (lines.length === 0) {
      lines.push(line("info", "Ran successfully (no output)."));
    }
    return { lines, ok: true, value: result };
  } catch (err) {
    // Allow retry after a failed CDN load
    pyodidePromise = null;
    lines.push(line("error", stringify(err)));
    lines.push(line("warn", "Python runtime failed to load or run. Check network and Retry Run."));
    return { lines, ok: false };
  }
}

type RubyVm = {
  eval: (code: string) => { toString: () => string };
};

let rubyPromise: Promise<RubyVm> | null = null;

function loadScriptOnce(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-litcode-src="${src}"]`);
    if (existing) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.litcodeSrc = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
    document.head.appendChild(script);
  });
}

async function loadRubyVm(): Promise<RubyVm> {
  if (!rubyPromise) {
    rubyPromise = (async () => {
      await loadScriptOnce(RUBY_WASM_WASI_UMD);
      const g = globalThis as unknown as {
        ["ruby-wasm-wasi"]?: {
          DefaultRubyVM: (
            mod: WebAssembly.Module,
            opts?: { consolePrint?: boolean; env?: Record<string, string> }
          ) => Promise<{ vm: RubyVm }>;
        };
      };
      const api = g["ruby-wasm-wasi"];
      if (!api?.DefaultRubyVM) {
        throw new Error("ruby-wasm-wasi UMD did not expose DefaultRubyVM");
      }
      const response = await fetch(RUBY_STDLIB_WASM);
      if (!response.ok) {
        throw new Error(`Failed to fetch Ruby WASM (${response.status})`);
      }
      const module = await WebAssembly.compileStreaming(response);
      const { vm } = await api.DefaultRubyVM(module, {
        consolePrint: false,
        env: { RUBYOPT: "-rjson" },
      });
      return vm;
    })();
  }
  return rubyPromise;
}

function wrapRubyWithStdoutCapture(code: string): string {
  return `
require "stringio"
__lf_buf = StringIO.new
$stdout = __lf_buf
$stderr = __lf_buf
begin
${code}
ensure
  __LF_STDOUT__ = __lf_buf.string
end
__LF_STDOUT__
`;
}

export async function runRuby(code: string): Promise<RunResult> {
  const lines: ConsoleLine[] = [];
  try {
    lines.push(line("info", "Loading Ruby runtime (ruby.wasm — first run may take a moment)…"));
    const vm = await loadRubyVm();
    lines.pop();
    const captured = vm.eval(wrapRubyWithStdoutCapture(code)).toString();
    if (captured) {
      for (const chunk of captured.replace(/\n$/, "").split("\n")) {
        if (chunk.length) lines.push(line("log", chunk));
      }
    }
    if (lines.length === 0) {
      lines.push(line("info", "Ran successfully (no output)."));
    }
    return { lines, ok: true, value: captured };
  } catch (err) {
    rubyPromise = null;
    lines.push(line("error", stringify(err)));
    lines.push(line("warn", "Ruby runtime failed to load or run. Check network and Retry Run."));
    return { lines, ok: false };
  }
}

type PhpWebInstance = {
  binary: Promise<unknown>;
  run: (code: string) => Promise<number>;
  exec: (code: string) => Promise<unknown>;
  addEventListener: (type: string, listener: (e: Event) => void) => void;
  removeEventListener: (type: string, listener: (e: Event) => void) => void;
};

let phpPromise: Promise<PhpWebInstance> | null = null;

async function loadPhp(): Promise<PhpWebInstance> {
  if (!phpPromise) {
    phpPromise = (async () => {
      const url = `${PHP_WASM_CDN}/PhpWeb.mjs`;
      // Avoid bundling the WASM package into the Next client graph.
      const mod = (await import(
        /* webpackIgnore: true */
        /* @vite-ignore */
        url
      )) as { PhpWeb: new (args?: Record<string, unknown>) => PhpWebInstance };
      const php = new mod.PhpWeb({
        version: "8.4",
        locateFile: (file: string) => `${PHP_WASM_CDN}/${file}`,
      });
      await php.binary;
      return php;
    })();
  }
  return phpPromise;
}

function ensurePhpTags(code: string): string {
  const trimmed = code.trim();
  if (trimmed.startsWith("<?php") || trimmed.startsWith("<?=")) return code;
  return `<?php\n${code}`;
}

export async function runPhp(code: string): Promise<RunResult> {
  const lines: ConsoleLine[] = [];
  try {
    lines.push(line("info", "Loading PHP runtime (php-wasm — first run may take a moment)…"));
    const php = await loadPhp();
    lines.pop();

    const stdout: string[] = [];
    const stderr: string[] = [];
    const onOutput = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) stdout.push(String(detail));
    };
    const onError = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      if (detail) stderr.push(String(detail));
    };
    php.addEventListener("output", onOutput);
    php.addEventListener("error", onError);
    try {
      const exit = await php.run(ensurePhpTags(code));
      const out = stdout.join("").replace(/\n$/, "");
      const err = stderr.join("").replace(/\n$/, "");
      if (out) {
        for (const chunk of out.split("\n")) {
          if (chunk.length) lines.push(line("log", chunk));
        }
      }
      if (err) {
        for (const chunk of err.split("\n")) {
          if (chunk.length) lines.push(line("error", chunk));
        }
      }
      if (lines.length === 0) {
        lines.push(
          line(
            "info",
            exit === 0
              ? "Ran successfully (no output)."
              : `PHP exited with code ${exit} (no output).`
          )
        );
      }
      return { lines, ok: exit === 0 && !err, value: out };
    } finally {
      php.removeEventListener("output", onOutput);
      php.removeEventListener("error", onError);
    }
  } catch (err) {
    phpPromise = null;
    lines.push(line("error", stringify(err)));
    lines.push(line("warn", "PHP runtime failed to load or run. Check network and Retry Run."));
    return { lines, ok: false };
  }
}

async function runRemote(language: string, code: string, stdin?: string): Promise<RunResult> {
  const res = await executeRemote({ language, code, stdin });
  const lines = remoteResultToLines(res, (kind, text) => line(kind, text)) as ConsoleLine[];
  lines.unshift(line("info", `Engine: Judge0 CE · ${res.status}`));
  return { lines, ok: res.ok };
}

export async function runCode(language: string, code: string): Promise<RunResult> {
  if (language === "python" || language === "python3") return runPython(code);
  if (language === "typescript") return runTypeScript(code);
  if (language === "javascript") return runJavaScript(code);
  if (language === "ruby") return runRuby(code);
  if (language === "php") return runPhp(code);

  if (remoteExecutable(language)) {
    return runRemote(language, code);
  }

  const avail = getRunnerAvailability(language);
  if (avail.status === "planned") {
    return {
      lines: [
        line(
          "info",
          `${language}: runtime planned (${avail.engine}${avail.sizeHint ? `, ${avail.sizeHint}` : ""}). ${avail.note}`
        ),
        line(
          "warn",
          `Not wired yet — pick ${runnableLanguageLabels()} or a Judge0-backed language (C++, Rust, …).`
        ),
      ],
      ok: false,
    };
  }

  return {
    lines: [
      line("warn", `${language}: ${avail.note}`),
      line(
        "info",
        `Runnable today: ${runnableLanguageLabels()}. Engines download on first Run.`
      ),
    ],
    ok: false,
  };
}

/** Judge a DSA solution function against JSON-serializable tests. */
export async function judgeSolution(opts: {
  language: string;
  code: string;
  functionName: string;
  tests: Array<{ id: string; input: unknown[]; expected: unknown }>;
}): Promise<{
  lines: ConsoleLine[];
  results: Array<{ id: string; pass: boolean; got?: unknown; expected: unknown; error?: string }>;
  passed: number;
  total: number;
}> {
  const { language, code, functionName, tests } = opts;
  const results: Array<{
    id: string;
    pass: boolean;
    got?: unknown;
    expected: unknown;
    error?: string;
  }> = [];
  const lines: ConsoleLine[] = [];

  if (remoteExecutable(language)) {
    const program =
      buildRemoteJudgeProgram(language, code, functionName, tests) ?? code;
    const res = await executeRemote({ language, code: program });
    const parsed = parseRemoteCaseResults(res.stdout, tests);
    for (const r of parsed) {
      lines.push(
        line(
          r.pass ? "log" : "error",
          `${r.id}: ${r.pass ? "Accepted" : r.error ?? "Wrong Answer"}`
        )
      );
      results.push({
        id: r.id,
        pass: r.pass,
        expected: r.expected,
        error: r.error,
      });
    }
    if (!res.ok && results.every((r) => !r.pass)) {
      lines.push(...remoteResultToLines(res, (kind, text) => line(kind, text)));
    }
    lines.unshift(line("info", `Engine: Judge0 CE · ${res.status}`));
    const passed = results.filter((r) => r.pass).length;
    return { lines, results, passed, total: tests.length };
  }

  if (!isBrowserRunnable(language)) {
    const avail = getRunnerAvailability(language);
    return {
      lines: [
        line(
          "warn",
          avail.status === "planned"
            ? `Submit grading for ${language} is planned (${avail.engine}). ${avail.note}`
            : `Submit grading needs a browser or Judge0 runtime. ${avail.note}`
        ),
        line("info", `Graded in-browser: ${runnableLanguageLabels()}.`),
      ],
      results: tests.map((t) => ({
        id: t.id,
        pass: false,
        expected: t.expected,
        error: avail.status === "planned" ? "Runtime planned" : "No runner",
      })),
      passed: 0,
      total: tests.length,
    };
  }

  try {
    let solver: ((...args: unknown[]) => unknown) | null = null;

    if (language === "python" || language === "python3") {
      const py = await loadPyodide();
      const wrap = `
${code}

__solver__ = ${functionName}
`;
      await py.runPythonAsync(wrap);
      const pySolver = await py.runPythonAsync(`__solver__`);
      solver = (...args: unknown[]) => {
        // pyodide proxies
        const fn = pySolver as { (...a: unknown[]): unknown };
        return fn(...args);
      };
    } else if (language === "ruby") {
      const vm = await loadRubyVm();
      vm.eval(code);
      solver = (...args: unknown[]) => {
        const payload = JSON.stringify(args);
        const ruby = `
require "json"
__lf_args = JSON.parse(${JSON.stringify(payload)})
__lf_result = method(:${functionName}).call(*__lf_args)
JSON.generate(__lf_result)
`;
        const raw = vm.eval(ruby).toString();
        try {
          return JSON.parse(raw);
        } catch {
          return raw;
        }
      };
    } else if (language === "php") {
      const php = await loadPhp();
      await php.run(ensurePhpTags(code));
      solver = async (...args: unknown[]) => {
        const payload = JSON.stringify(args);
        const phpCode = `<?php
$__lf_args = json_decode(${JSON.stringify(payload)}, true);
if (!class_exists('Solution')) { throw new Error('Define class Solution'); }
$__lf_s = new Solution();
if (!method_exists($__lf_s, ${JSON.stringify(functionName)})) {
  throw new Error('Method ${functionName} not found on Solution');
}
echo json_encode($__lf_s->${functionName}(...$__lf_args));
`;
        const out: string[] = [];
        const err: string[] = [];
        const onOutput = (e: Event) => {
          const detail = (e as CustomEvent<string>).detail;
          if (detail) out.push(String(detail));
        };
        const onError = (e: Event) => {
          const detail = (e as CustomEvent<string>).detail;
          if (detail) err.push(String(detail));
        };
        php.addEventListener("output", onOutput);
        php.addEventListener("error", onError);
        try {
          const exit = await php.run(phpCode);
          const text = out.join("");
          const errText = err.join("");
          if (exit !== 0 || errText) {
            throw new Error(errText || `PHP exit ${exit}`);
          }
          try {
            return JSON.parse(text);
          } catch {
            return text;
          }
        } finally {
          php.removeEventListener("output", onOutput);
          php.removeEventListener("error", onError);
        }
      };
    } else {
      let js = code;
      if (language === "typescript") {
        const { transform } = await import("sucrase");
        js = transform(code, {
          transforms: ["typescript", "imports"],
          disableESTransforms: true,
        }).code;
      }
      const prepared = rewriteForBrowser(js);
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
        ...args: string[]
      ) => (...a: unknown[]) => Promise<unknown>;
      const fn = new AsyncFunction(
        "console",
        `"use strict";\n${prepared.code}\n;return typeof ${functionName}!=="undefined"?${functionName}:null;`
      );
      const noop = () => undefined;
      const fakeConsole = { log: noop, info: noop, warn: noop, error: noop, clear: noop };
      solver = (await fn(fakeConsole)) as ((...args: unknown[]) => unknown) | null;
      if (!solver) {
        throw new Error(`Function \`${functionName}\` was not found. Export or declare it.`);
      }
    }

    for (const t of tests) {
      try {
        const got = await Promise.resolve(solver!(...t.input));
        const pass = deepEqual(normalize(got), normalize(t.expected));
        results.push({ id: t.id, pass, got, expected: t.expected });
        lines.push(
          line(pass ? "log" : "error", `${t.id}: ${pass ? "Accepted" : "Wrong Answer"}`)
        );
        if (!pass) {
          lines.push(line("info", `  expected ${stringify(t.expected)}`));
          lines.push(line("info", `  got      ${stringify(got)}`));
        }
      } catch (err) {
        results.push({
          id: t.id,
          pass: false,
          expected: t.expected,
          error: stringify(err),
        });
        lines.push(line("error", `${t.id}: Runtime Error`));
        lines.push(line("error", stringify(err)));
      }
    }
  } catch (err) {
    lines.push(line("error", stringify(err)));
  }

  const passed = results.filter((r) => r.pass).length;
  return { lines, results, passed, total: tests.length };
}

function normalize(v: unknown): unknown {
  if (Array.isArray(v)) return v.map(normalize);
  if (v && typeof v === "object") {
    // PyProxy / Map-ish
    const maybe = v as { toJs?: () => unknown };
    if (typeof maybe.toJs === "function") return normalize(maybe.toJs());
  }
  return v;
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (typeof a !== typeof b) return false;
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) return false;
    return a.every((x, i) => deepEqual(x, b[i]));
  }
  if (a && b && typeof a === "object" && typeof b === "object") {
    const ak = Object.keys(a as object).sort();
    const bk = Object.keys(b as object).sort();
    if (ak.length !== bk.length) return false;
    return ak.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
    );
  }
  return false;
}
