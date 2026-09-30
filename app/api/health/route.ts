import { NextResponse } from "next/server";
import { assertServerEnv } from "../../../src/lib/env";
import { captureException } from "../../../src/lib/error-tracking";

export const dynamic = "force-dynamic";

export function GET() {
  try {
    const env = assertServerEnv();
    return NextResponse.json({
      status: "ok",
      service: "litcode",
      checks: {
        env: "ok",
        judge0: env.JUDGE0_URL ? "configured" : "missing",
      },
    });
  } catch (err) {
    captureException(err, { route: "/api/health" });
    return NextResponse.json(
      { status: "error", service: "litcode", checks: { env: "failed" } },
      { status: 503 }
    );
  }
}
