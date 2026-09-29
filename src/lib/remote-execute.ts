/**
 * Legacy remote-execute helpers — Judge0 path removed.
 * Kept so old imports / docs references fail closed with a clear browser-only message.
 * Prefer `browser-runners.ts` + `runner.ts` for all execution.
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
};

/** @deprecated Remote Judge0 ids — unused; browser-only execution. */
export const JUDGE0_LANGUAGE_IDS: Partial<Record<JudgeLanguageId, number>> = {};

/** Always false — no remote execution path. */
export function remoteExecutable(_lang: string): boolean {
  return false;
}

export function ensureRunnable(_language: JudgeLanguageId | string, code: string): string {
  return code;
}

export async function executeRemote(req: ExecuteRequest): Promise<ExecuteResponse> {
  return {
    ok: false,
    stdout: "",
    stderr:
      "Remote language sandboxes are disabled. Use in-browser runners (JavaScript, TypeScript, Python, Ruby, PHP).",
    compileOutput: "",
    message: "browser-only",
    status: "Unavailable",
    language: String(req.language),
    engine: "browser-only",
  };
}
