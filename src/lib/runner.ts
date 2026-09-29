import type { ConsoleLine, ConsoleLineKind } from "../types";

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
    lines.push(line("error", stringify(err)));
    return { lines, ok: false };
  }
}

export async function runCode(language: string, code: string): Promise<RunResult> {
  if (language === "python") return runPython(code);
  if (language === "typescript") return runTypeScript(code);
  return runJavaScript(code);
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

  try {
    let solver: ((...args: unknown[]) => unknown) | null = null;

    if (language === "python") {
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
