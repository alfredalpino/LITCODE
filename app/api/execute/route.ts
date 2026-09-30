import { NextRequest, NextResponse } from "next/server";
import {
  JUDGE0_LANGUAGE_IDS,
  ensureRunnable,
  type ExecuteResponse,
} from "../../../src/lib/remote-execute";
import { parseExecuteRequest } from "../../../src/lib/execute-request";
import { assertServerEnv } from "../../../src/lib/env";
import { captureException } from "../../../src/lib/error-tracking";
import { childLogger } from "../../../src/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const log = childLogger("api/execute");
const JUDGE0_ACCEPTED_STATUS_ID = 3;

type Judge0Status = { id: number; description?: string };
type Judge0Submission = {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status?: Judge0Status | null;
  time?: string | null;
  memory?: number | null;
};

function judge0Headers(token: string | undefined): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["X-Auth-Token"] = token;
  return headers;
}

function mapSubmission(
  language: string,
  submission: Judge0Submission
): ExecuteResponse {
  const statusId = submission.status?.id ?? 0;
  const status = submission.status?.description ?? "Unknown";
  const stdout = submission.stdout ?? "";
  const stderr = submission.stderr ?? "";
  const compileOutput = submission.compile_output ?? "";
  const ok = statusId === JUDGE0_ACCEPTED_STATUS_ID;

  return {
    ok,
    stdout,
    stderr,
    compileOutput,
    message: submission.message ?? status,
    status,
    time: submission.time ?? null,
    memory: submission.memory ?? null,
    language,
    engine: "judge0",
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  let env;
  try {
    env = assertServerEnv();
  } catch (err) {
    captureException(err, { route: "/api/execute" });
    const message = err instanceof Error ? err.message : "Invalid server environment";
    return NextResponse.json(
      { ok: false, error: message, status: "Misconfigured", engine: "judge0" },
      { status: 500 }
    );
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body", status: "Bad Request", engine: "judge0" },
      { status: 400 }
    );
  }

  const parsed = parseExecuteRequest(payload);
  if (!parsed.ok) {
    const statusText = parsed.status === 413 ? "Payload Too Large" : "Bad Request";
    return NextResponse.json(
      { ok: false, error: parsed.error, status: statusText, engine: "judge0" },
      { status: parsed.status }
    );
  }

  const { language, code, stdin } = parsed.value;
  const languageId = JUDGE0_LANGUAGE_IDS[language as keyof typeof JUDGE0_LANGUAGE_IDS];
  if (!languageId) {
    return NextResponse.json(
      {
        ok: false,
        error: `Unsupported language: ${language}`,
        status: "Unsupported Language",
        engine: "judge0",
      },
      { status: 400 }
    );
  }

  const source = ensureRunnable(language, code);
  const url = `${env.JUDGE0_URL.replace(/\/$/, "")}/submissions?base64_encoded=false&wait=true`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: judge0Headers(env.JUDGE0_AUTH_TOKEN),
      body: JSON.stringify({
        language_id: languageId,
        source_code: source,
        stdin,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      log.warn({ status: upstream.status }, "judge0 http error");
      return NextResponse.json(
        {
          ok: false,
          error: `Judge0 error (${upstream.status}): ${text.slice(0, 500)}`,
          stdout: "",
          stderr: text.slice(0, 2000),
          compileOutput: "",
          message: "judge0-http-error",
          status: "Failed",
          language,
          engine: "judge0",
        },
        { status: 502 }
      );
    }

    const submission = (await upstream.json()) as Judge0Submission;
    const payload = mapSubmission(language, submission);
    return NextResponse.json(payload, { status: 200 });
  } catch (err) {
    captureException(err, { route: "/api/execute", language });
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        ok: false,
        error: msg,
        stdout: "",
        stderr: msg,
        compileOutput: "",
        message: "judge0-network-error",
        status: "Failed",
        language,
        engine: "judge0",
      },
      { status: 502 }
    );
  }
}
