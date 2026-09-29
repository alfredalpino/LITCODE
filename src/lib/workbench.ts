/**
 * Shared workbench helpers — keep Monaco/runners in place; share small pure utils.
 */

import type { ConsoleLine, ConsoleLineKind } from "../types";

export function makeConsoleLine(
  kind: ConsoleLineKind,
  text: string,
  idPrefix = "line"
): ConsoleLine {
  return {
    id: `${idPrefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    kind,
    text,
    ts: Date.now(),
  };
}

/** Split DSA tests into visible (first N) vs hidden for interview Run vs Submit. */
export function splitVisibleHidden<T>(tests: T[], visibleCount = 2): {
  visible: T[];
  hidden: T[];
} {
  if (tests.length <= visibleCount) {
    return { visible: tests, hidden: [] };
  }
  return {
    visible: tests.slice(0, visibleCount),
    hidden: tests.slice(visibleCount),
  };
}
