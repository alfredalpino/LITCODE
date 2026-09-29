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
  if (value instanceof Error) return value.stack || value.message;
  try {
    return JSON.stringify(value, null, 2) ?? String(value);
  } catch {
    return String(value);
  }
}

export type RunResult = { lines: ConsoleLine[]; ok: boolean };

export async function runJavaScript(code: string): Promise<RunResult> {
  const lines: ConsoleLine[] = [];
  const push =
    (kind: ConsoleLineKind) =>
    (...args: unknown[]) => {
      lines.push(line(kind, args.map(stringify).join(" ")));
    };

  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor as new (
      ...args: string[]
    ) => (...a: unknown[]) => Promise<unknown>;

    const fn = new AsyncFunction(
      "console",
      `"use strict";\n${code}`
    );

    const fakeConsole = {
      log: push("log"),
      info: push("info"),
      warn: push("warn"),
      error: push("error"),
      clear: () => {
        lines.length = 0;
      },
    };

    const result = await fn(fakeConsole);
    if (result !== undefined) {
      lines.push(line("info", `⇒ ${stringify(result)}`));
    }
    if (lines.length === 0) {
      lines.push(line("info", "Ran successfully (no console output)."));
    }
    return { lines, ok: true };
  } catch (err) {
    lines.push(line("error", stringify(err)));
    return { lines, ok: false };
  }
}

export async function runTypeScript(code: string): Promise<RunResult> {
  try {
    const { transform } = await import("sucrase");
    const { code: js } = transform(code, {
      transforms: ["typescript"],
      disableESTransforms: true,
    });
    return runJavaScript(js);
  } catch (err) {
    return { lines: [line("error", stringify(err))], ok: false };
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
          script.onerror = () => reject(new Error("Failed to load Pyodide"));
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
    // Drop the loading notice once ready
    lines.pop();

    py.setStdout({
      batched: (s) => {
        if (s) lines.push(line("log", s));
      },
    });
    py.setStderr({
      batched: (s) => {
        if (s) lines.push(line("error", s));
      },
    });

    const result = await py.runPythonAsync(code);
    if (result !== undefined && result !== null) {
      lines.push(line("info", `⇒ ${String(result)}`));
    }
    if (lines.length === 0) {
      lines.push(line("info", "Ran successfully (no output)."));
    }
    return { lines, ok: true };
  } catch (err) {
    lines.push(line("error", stringify(err)));
    return { lines, ok: false };
  }
}

export async function runCode(
  language: string,
  code: string
): Promise<RunResult> {
  if (language === "python") return runPython(code);
  if (language === "typescript") return runTypeScript(code);
  return runJavaScript(code);
}
