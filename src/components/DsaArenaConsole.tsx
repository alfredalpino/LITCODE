"use client";

import clsx from "clsx";
import { splitVisibleHidden } from "../lib/workbench";
import type { DsaProblem } from "../lib/dsa/types";
import type { ConsoleLine } from "../types";

type ConsoleTab = "testcase" | "result";

export function DsaArenaConsole(props: {
  problem: DsaProblem | null;
  interviewMode: boolean;
  consoleTab: ConsoleTab;
  setConsoleTab: (tab: ConsoleTab) => void;
  activeCase: number;
  setActiveCase: (n: number) => void;
  caseResults: Array<{ id: string; pass: boolean; error?: string }> | null;
  lines: ConsoleLine[];
}) {
  const {
    problem,
    interviewMode,
    consoleTab,
    setConsoleTab,
    activeCase,
    setActiveCase,
    caseResults,
    lines,
  } = props;

  return <div className="lc-prob-console">
      <div className="lc-prob-console__tabs">
        <button
          type="button"
          className={clsx(consoleTab === "testcase" && "is-active")}
          onClick={() => setConsoleTab("testcase")}
        >
          Testcase
        </button>
        <button
          type="button"
          className={clsx(consoleTab === "result" && "is-active")}
          onClick={() => setConsoleTab("result")}
        >
          Test Result
        </button>
      </div>
      {consoleTab === "testcase" && problem && (
        <div className="dsa-cases">
          <div className="dsa-cases__pills">
            {(interviewMode
              ? splitVisibleHidden(
                  (problem.tests ?? []).filter((t) => t.expected !== undefined),
                  2
                ).visible
              : problem.tests ?? []
            ).map((t, i) => (
              <button
                key={t.id}
                type="button"
                className={clsx(
                  "case-pill",
                  activeCase === i && "is-active",
                  caseResults?.[i] && (caseResults[i].pass ? "is-pass" : "is-fail")
                )}
                onClick={() => setActiveCase(i)}
              >
                Case {i + 1}
              </button>
            ))}
          </div>
          {(() => {
            const shown = interviewMode
              ? splitVisibleHidden(
                  (problem.tests ?? []).filter((t) => t.expected !== undefined),
                  2
                ).visible
              : problem.tests ?? [];
            const active = shown[activeCase];
            if (!active) {
              return (
                <p className="console__empty">No testcases on this problem.</p>
              );
            }
            return (
              <pre className="dsa-cases__preview">
                {JSON.stringify(
                  {
                    input: active.input,
                    expected: active.expected ?? "(manual)",
                  },
                  null,
                  2
                )}
              </pre>
            );
          })()}
        </div>
      )}
      {consoleTab === "result" && (
        <div className="console__output" role="log">
          {caseResults && (
            <p
              className={clsx(
                "dsa-summary",
                caseResults.every((r) => r.pass) ? "is-ok" : "is-bad"
              )}
            >
              Passed: {caseResults.filter((r) => r.pass).length} / {caseResults.length}
            </p>
          )}
          {lines.length === 0 ? (
            <p className="console__empty">You must run your code first</p>
          ) : (
            lines.map((l) => (
              <pre key={l.id} className={clsx("console__line", `is-${l.kind}`)}>
                {l.text}
              </pre>
            ))
          )}
        </div>
      )}
    </div>;
}
