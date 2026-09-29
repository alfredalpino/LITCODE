import type { Config } from "@netlify/functions";

/**
 * Return any HTTP status the client asks for (default 200).
 * Query: ?code=404  Body JSON: { "code": 503, "message": "..." }
 * Use this to practice error handling in fetch without a flaky third-party API.
 */
export default async (req: Request) => {
  const url = new URL(req.url);
  let code = Number(url.searchParams.get("code") ?? "200");
  let message = url.searchParams.get("message") ?? "lab status response";

  if (req.method === "POST") {
    try {
      const json = (await req.json()) as { code?: number; message?: string };
      if (typeof json.code === "number") code = json.code;
      if (typeof json.message === "string") message = json.message;
    } catch {
      // keep query/defaults
    }
  }

  if (!Number.isInteger(code) || code < 100 || code > 599) {
    return Response.json(
      { ok: false, error: "code must be an integer 100–599" },
      { status: 400 },
    );
  }

  return Response.json(
    {
      ok: code >= 200 && code < 300,
      lab: "status",
      code,
      message,
    },
    {
      status: code,
      headers: {
        "Cache-Control": "no-store",
        "X-Lab-Function": "status",
      },
    },
  );
};

export const config: Config = {
  path: "/api/status",
  method: ["GET", "POST"],
};
