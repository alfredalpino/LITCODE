/**
 * Privacy-conscious analytics hooks — local-only by default.
 * Wire `NEXT_PUBLIC_ANALYTICS_ENDPOINT` later for production telemetry.
 */

export type AnalyticsEvent =
  | "page_view"
  | "module_opened"
  | "challenge_opened"
  | "judged_pass"
  | "search_used"
  | "nav_section";

type Payload = Record<string, string | number | boolean | undefined>;

const ENDPOINT =
  typeof process !== "undefined" ? process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT : undefined;

export function track(event: AnalyticsEvent, payload: Payload = {}): void {
  if (typeof window === "undefined") return;
  const body = {
    event,
    ts: Date.now(),
    path: window.location.pathname,
    ...payload,
  };
  if (!ENDPOINT) {
    if (process.env.NODE_ENV === "development") {
      console.debug("[litcode analytics]", body);
    }
    return;
  }
  try {
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* non-blocking */
  }
}
