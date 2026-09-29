"use client";

import dynamic from "next/dynamic";

const StudioShell = dynamic(
  () => import("@/components/StudioShell").then((m) => m.StudioShell),
  {
    ssr: false,
    loading: () => (
      <div className="boot-loading">
        <div className="boot-loading__brand">
          <span className="boot-mark" aria-hidden />
          LITCODE
        </div>
        <div className="boot-spinner" aria-hidden />
        <p>Loading studio…</p>
      </div>
    ),
  }
);

/** Shared client entry for all studio routes — SSR-off keeps first paint light. */
export function StudioPage() {
  return <StudioShell />;
}
