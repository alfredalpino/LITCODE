import { judgeSolution, runCode } from "../runner";
import { remoteExecutable } from "../remote-execute";
import { appendEvent } from "../events";
import {
  findNodeByChallengeId,
  loadSkillGraph,
  loadSkillState,
  recordChallengeResult,
  saveSkillState,
} from "../skill-graph";
import { splitVisibleHidden } from "../workbench";
import {
  runnableLanguageLabels,
  toRunnerLanguage,
  type JudgeLanguage,
  type JudgeLanguageId,
} from "../judge-languages";
import { getRunnerAvailability } from "../browser-runners";
import type { DsaProblem } from "./types";
import type { ConsoleLine } from "../../types";

export type ArenaCaseResult = { id: string; pass: boolean; error?: string };

export type ArenaRunResult = {
  lines: ConsoleLine[];
  caseResults: ArenaCaseResult[] | null;
  accepted?: boolean;
  appendLines?: ConsoleLine[];
};

function line(
  kind: ConsoleLine["kind"],
  text: string,
  idPrefix: string
): ConsoleLine {
  return { id: `${idPrefix}-${Date.now()}`, kind, text, ts: Date.now() };
}

export async function runArenaAttempt(input: {
  problem: DsaProblem;
  language: JudgeLanguageId;
  langMeta: JudgeLanguage | undefined;
  code: string;
  submit: boolean;
  debug?: boolean;
  interviewMode: boolean;
  hintLevel: number;
}): Promise<ArenaRunResult> {
  const {
    problem,
    language,
    langMeta,
    code,
    submit,
    debug = false,
    interviewMode,
    hintLevel,
  } = input;
  const started = performance.now();
  const runnerLang = toRunnerLanguage(language);
  const execLang = runnerLang ?? language;

  if (!runnerLang && !remoteExecutable(language)) {
    const avail = getRunnerAvailability(language);
    return {
      lines: [
        line(
          avail.status === "planned" ? "info" : "warn",
          avail.status === "planned"
            ? `${langMeta?.label ?? language}: ${avail.engine} runtime is on the ship list (${avail.sizeHint ?? "WASM"}). ${avail.note}`
            : `${langMeta?.label ?? language}: ${avail.note}`,
          "lang"
        ),
        line(
          "info",
          `Run/Submit: ${runnableLanguageLabels()} in-browser, or C++/Rust/Java/Go via Judge0.`,
          "lang-hint"
        ),
      ],
      caseResults: null,
    };
  }

  const debugLines: ConsoleLine[] = debug
    ? [
        line(
          "info",
          "Debug: step-through debugger ships with worker isolation. For now, Run with console.log / print / echo breakpoints.",
          "debug"
        ),
      ]
    : [];

  if (problem.hasJudge && problem.tests?.length) {
    const scored = problem.tests.filter((t) => t.expected !== undefined) as Array<{
      id: string;
      input: unknown[];
      expected: unknown;
    }>;
    const { visible, hidden } = splitVisibleHidden(scored, 2);
    const suite = interviewMode && !submit && visible.length > 0 ? visible : scored;
    const judged = await judgeSolution({
      language: execLang,
      code,
      functionName: problem.functionName,
      tests: suite,
    });
    const elapsed = Math.round(performance.now() - started);
    const lines: ConsoleLine[] = [
      ...debugLines,
      ...judged.lines,
      line(
        "info",
        `Runtime: ${elapsed}ms · ${submit ? "Submit" : "Run"}${
          debug ? " · Debug note attached" : ""
        } · ${langMeta?.label ?? language}`,
        "timing"
      ),
    ];

    if (!submit) {
      return { lines, caseResults: judged.results };
    }

    const allPass = judged.passed === judged.total && judged.total > 0;
    const appendLines = [
      line(
        allPass ? "log" : "error",
        allPass
          ? `Accepted (${judged.passed}/${judged.total}${
              interviewMode && hidden.length ? ` · ${hidden.length} hidden` : ""
            })`
          : `Wrong Answer (${judged.passed}/${judged.total})`,
        "submit"
      ),
    ];
    appendEvent({
      type: allPass ? "challenge_passed" : "challenge_failed",
      challengeId: problem.id,
      meta: { interviewMode, elapsedMs: elapsed, hintsUsed: hintLevel, language },
    });
    void loadSkillGraph()
      .then((graph) => {
        const node = findNodeByChallengeId(graph, problem.id);
        if (!node) return;
        saveSkillState(
          recordChallengeResult(loadSkillState(), node.id, allPass, hintLevel)
        );
      })
      .catch(() => undefined);

    return {
      lines,
      caseResults: judged.results,
      accepted: allPass,
      appendLines,
    };
  }

  const result = await runCode(execLang, code);
  return {
    lines: [
      ...debugLines,
      line(
        "info",
        interviewMode
          ? `No auto-judge on this title — ${langMeta?.label ?? language} console below.`
          : `${langMeta?.label ?? language} console (practice mode).`,
        "info"
      ),
      ...result.lines,
    ],
    caseResults: null,
    accepted: submit && !interviewMode ? true : undefined,
  };
}
