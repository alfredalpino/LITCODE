/**
 * Client + shared helpers for Judge0 CE via `/api/execute`.
 * JavaScript, TypeScript, and Python run locally in the browser; other mapped langs use remote.
 */

import type { JudgeLanguageId } from "./judge-languages";

export type ExecuteRequest = {
  language: JudgeLanguageId | string;
  code: string;
  stdin?: string;
};

export type ExecuteResponse = {
  ok: boolean;
  stdout: string;
  stderr: string;
  compileOutput: string;
  message: string;
  status: string;
  time?: string | null;
  memory?: number | null;
  language: string;
  engine: string;
  error?: string;
};

/** Judge0 CE language ids — https://ce.judge0.com/languages */
export const JUDGE0_LANGUAGE_IDS: Partial<Record<JudgeLanguageId, number>> = {
  c: 50,
  cpp: 54,
  csharp: 51,
  golang: 60,
  java: 62,
  kotlin: 78,
  swift: 83,
  rust: 73,
  dart: 90,
  scala: 81,
  elixir: 57,
  erlang: 58,
  php: 68,
  ruby: 72,
  python: 71,
  python3: 71,
  javascript: 63,
  typescript: 74,
};

const LOCAL_BROWSER_LANGS = new Set(["javascript", "typescript", "python", "python3"]);
/** Ruby / PHP have in-browser WASM runners — prefer local over Judge0. */
const WASM_BROWSER_LANGS = new Set(["ruby", "php"]);

export const MAX_EXECUTE_CODE_BYTES = 64 * 1024;
export const MAX_EXECUTE_STDIN_BYTES = 16 * 1024;

export function remoteExecutable(lang: string): boolean {
  if (LOCAL_BROWSER_LANGS.has(lang) || WASM_BROWSER_LANGS.has(lang)) return false;
  return JUDGE0_LANGUAGE_IDS[lang as JudgeLanguageId] !== undefined;
}

export function ensureRunnable(_language: JudgeLanguageId | string, code: string): string {
  return code;
}

function executeApiBase(): string {
  if (typeof window !== "undefined") return "";
  return process.env.LITCODE_EXECUTE_URL ?? "http://127.0.0.1:3000";
}

export async function executeRemote(req: ExecuteRequest): Promise<ExecuteResponse> {
  const language = String(req.language);
  if (!remoteExecutable(language)) {
    return {
      ok: false,
      stdout: "",
      stderr: `Language \`${language}\` is not configured for remote execution.`,
      compileOutput: "",
      message: "unsupported-language",
      status: "Unsupported Language",
      language,
      engine: "judge0",
    };
  }

  try {
    const res = await fetch(`${executeApiBase()}/api/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        code: ensureRunnable(language, req.code),
        stdin: req.stdin ?? "",
      }),
    });
    const body = (await res.json()) as ExecuteResponse & { error?: string };
    return {
      ok: Boolean(body.ok),
      stdout: body.stdout ?? "",
      stderr: body.stderr ?? body.error ?? "",
      compileOutput: body.compileOutput ?? "",
      message: body.message ?? "",
      status: body.status ?? (res.ok ? "Unknown" : `HTTP ${res.status}`),
      time: body.time ?? null,
      memory: body.memory ?? null,
      language: body.language ?? language,
      engine: body.engine ?? "judge0",
      error: body.error,
    };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      stdout: "",
      stderr: msg,
      compileOutput: "",
      message: "network-error",
      status: "Failed",
      language,
      engine: "judge0",
    };
  }
}

export function remoteResultToLines(
  res: ExecuteResponse,
  line: (kind: "log" | "info" | "warn" | "error", text: string) => { kind: string; text: string }
): Array<{ kind: string; text: string }> {
  const lines: Array<{ kind: string; text: string }> = [];
  if (res.compileOutput.trim()) {
    for (const chunk of res.compileOutput.trim().split("\n")) {
      lines.push(line("error", chunk));
    }
  }
  if (res.stderr.trim()) {
    for (const chunk of res.stderr.trim().split("\n")) {
      lines.push(line("error", chunk));
    }
  }
  if (res.stdout.trim()) {
    for (const chunk of res.stdout.trim().split("\n")) {
      lines.push(line("log", chunk));
    }
  }
  if (!res.ok && res.message && !res.stderr) {
    lines.push(line("warn", res.message));
  }
  if (lines.length === 0) {
    lines.push(
      line(
        res.ok ? "info" : "error",
        res.ok ? "Ran successfully (no output)." : `Judge status: ${res.status}`
      )
    );
  }
  return lines;
}
