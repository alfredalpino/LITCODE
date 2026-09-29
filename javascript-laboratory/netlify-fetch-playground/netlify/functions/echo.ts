import type { Config, Context } from "@netlify/functions";

/**
 * Echo whatever the client sent — method, headers, query, body.
 * Use this from module 25 (fetch) to prove request/response shape.
 */
export default async (req: Request, context: Context) => {
  const url = new URL(req.url);
  const headers: Record<string, string> = {};
  req.headers.forEach((value, key) => {
    headers[key] = value;
  });

  let body: unknown = null;
  const raw = await req.text();
  if (raw) {
    try {
      body = JSON.parse(raw);
    } catch {
      body = raw;
    }
  }

  const payload = {
    ok: true,
    lab: "echo",
    method: req.method,
    path: url.pathname,
    query: Object.fromEntries(url.searchParams),
    headers,
    body,
    geo: context.geo
      ? {
          city: context.geo.city,
          country: context.geo.country?.code,
          timezone: context.geo.timezone,
        }
      : null,
    requestId: context.requestId,
  };

  return Response.json(payload, {
    headers: {
      "Cache-Control": "no-store",
      "X-Lab-Function": "echo",
    },
  });
};

export const config: Config = {
  path: "/api/echo",
  method: ["GET", "POST", "PUT", "PATCH", "DELETE"],
};
