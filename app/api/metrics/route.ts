export const dynamic = "force-dynamic";

/** Prometheus-style process metrics. */
export function GET() {
  const uptime = Math.round(process.uptime());
  const body = [
    "# HELP litcode_up 1 if the Node server is serving.",
    "# TYPE litcode_up gauge",
    "litcode_up 1",
    "# HELP litcode_process_uptime_seconds Process uptime.",
    "# TYPE litcode_process_uptime_seconds gauge",
    `litcode_process_uptime_seconds ${uptime}`,
    "",
  ].join("\n");

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; version=0.0.4; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
