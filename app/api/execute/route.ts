import { NextRequest, NextResponse } from "next/server";
import {
  JUDGE0_LANGUAGE_IDS,
  MAX_EXECUTE_CODE_BYTES,
  MAX_EXECUTE_STDIN_BYTES,
  ensureRunnable,
  type ExecuteRequest,
  type ExecuteResponse,
} from "../../../src/lib/remote-execute";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function byteLength(text: string): number {
  return new TextEncoder().encode(text).length;
}

function judge0BaseUrl(): string {
  const raw = process.env.JUDGE0_URL?.trim() || "https://ce.judge0.com";
  return raw.replace(/\/$/, "");
}

function judge0Headers(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = process.env.JUDGE0_AUTH_TOKEN?.trim();
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
  let body: ExecuteRequest;
  try {
    body = (await req.json()) as ExecuteRequest;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body", status: "Bad Request", engine: "judge0" },
      { status: 400 }
    );
  }

  const language = typeof body.language === "string" ? body.language.trim() : "";
  const code = typeof body.code === "string" ? body.code : "";
  const stdin = typeof body.stdin === "string" ? body.stdin : "";

  if (!language) {
    return NextResponse.json(
      { ok: false, error: "Missing language", status: "Bad Request", engine: "judge0" },
      { status: 400 }
    );
  }

  if (!code.trim()) {
    return NextResponse.json(
      { ok: false, error: "Missing code", status: "Bad Request", engine: "judge0" },
      { status: 400 }
    );
  }

  if (byteLength(code) > MAX_EXECUTE_CODE_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: `Code exceeds ${MAX_EXECUTE_CODE_BYTES} bytes`,
        status: "Payload Too Large",
        engine: "judge0",
      },
      { status: 413 }
    );
  }

  if (byteLength(stdin) > MAX_EXECUTE_STDIN_BYTES) {
    return NextResponse.json(
      {
        ok: false,
        error: `stdin exceeds ${MAX_EXECUTE_STDIN_BYTES} bytes`,
        status: "Payload Too Large",
        engine: "judge0",
      },
      { status: 413 }
    );
  }

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
  const url = `${judge0BaseUrl()}/submissions?base64_encoded=false&wait=true`;

  try {
    const upstream = await fetch(url, {
      method: "POST",
      headers: judge0Headers(),
      body: JSON.stringify({
        language_id: languageId,
        source_code: source,
        stdin,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
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
