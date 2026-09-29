"use client";

import type { ReactNode } from "react";

interface ShellBodyProps {
  showRight: boolean;
  main: ReactNode;
  right: ReactNode;
}

/** Main workspace + optional right insights panel (no left sidebar). */
export function ShellBody({ showRight, main, right }: ShellBodyProps) {
  return (
    <div className={showRight ? "lc-body has-right" : "lc-body"}>
      <div className="lc-main">{main}</div>
      {showRight && (
        <div className="lc-right-wrap lc-right-wrap--fixed" style={{ width: 300 }}>
          {right}
        </div>
      )}
    </div>
  );
}
