import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Remote Judge0 execution is intentionally disabled.
 * All Run/Submit traffic must stay browser-only (lazy WASM engines in the client).
 */
export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      error:
        "Remote language sandboxes are disabled. Run JavaScript, TypeScript, Python, Ruby, or PHP in the browser.",
      status: "Unavailable",
      engine: "browser-only",
    },
    { status: 410 }
  );
}
