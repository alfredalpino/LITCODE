"use client";

import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  body: string;
  action?: ReactNode;
  className?: string;
}

/** Shared empty / filtered-out surface — developer-tool tone, not LMS cheer. */
export function EmptyState({ title, body, action, className }: EmptyStateProps) {
  return (
    <div className={className ? `lc-empty ${className}` : "lc-empty"} role="status">
      <p className="lc-empty__title">{title}</p>
      <p className="lc-empty__body">{body}</p>
      {action ? <div className="lc-empty__action">{action}</div> : null}
    </div>
  );
}
