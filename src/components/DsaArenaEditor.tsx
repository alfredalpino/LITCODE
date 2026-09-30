"use client";

import Editor from "@monaco-editor/react";
import { Maximize2, RotateCcw } from "lucide-react";
import type { RefObject } from "react";
import {
  starterForLanguage,
  type JudgeLanguageId,
  type JudgeLanguage,
} from "../lib/judge-languages";
import type { DsaProblem } from "../lib/dsa/types";
import { DsaLanguageSelect, type ArenaLayoutId } from "./DsaArenaToolbar";

export function DsaArenaEditor(props: {
  language: JudgeLanguageId;
  langMeta: JudgeLanguage | undefined;
  langOpen: boolean;
  setLangOpen: (open: boolean) => void;
  setLanguage: (id: JudgeLanguageId) => void;
  langRef: RefObject<HTMLDivElement | null>;
  problem: DsaProblem | null;
  code: string;
  setCode: (code: string) => void;
  editorTheme: "vs-dark" | "light";
  setLayout: (layout: ArenaLayoutId) => void;
  savedFlash: boolean;
}) {
  const {
    language,
    langMeta,
    langOpen,
    setLangOpen,
    setLanguage,
    langRef,
    problem,
    code,
    setCode,
    editorTheme,
    setLayout,
    savedFlash,
  } = props;

  return <div className="lc-prob-code">
      <div className="lc-prob-code__bar">
        <div className="lc-prob-code__left">
          <span className="lc-prob-code__label">&lt;/&gt; Code</span>
          <DsaLanguageSelect
            language={language}
            label={langMeta?.label ?? language}
            open={langOpen}
            onOpenChange={setLangOpen}
            onSelect={(id) => {
              setLanguage(id);
              setLangOpen(false);
            }}
            containerRef={langRef}
          />
          {langMeta && !langMeta.runnable && langMeta.availability === "planned" && (
            <span className="lc-prob-code__badge">Runtime soon</span>
          )}
          {langMeta && !langMeta.runnable && langMeta.availability !== "planned" && (
            <span className="lc-prob-code__badge">Coming later</span>
          )}
          {langMeta?.runnable && (
            <span className="lc-prob-code__badge lc-prob-code__badge--ok">In-browser</span>
          )}
        </div>
        <div className="lc-prob-code__right">
          <button
            type="button"
            className="lc-icon-btn"
            title="Reset to starter"
            onClick={() =>
              problem &&
              setCode(starterForLanguage(language, problem.functionName, problem.starter))
            }
          >
            <RotateCcw size={15} />
          </button>
          <button
            type="button"
            className="lc-icon-btn"
            title="Widen editor"
            onClick={() => setLayout("focus")}
          >
            <Maximize2 size={15} />
          </button>
        </div>
      </div>
      <div className="lc-prob-code__editor">
        <Editor
          height="100%"
          language={langMeta?.monaco ?? "javascript"}
          value={code}
          onChange={(v) => setCode(v ?? "")}
          theme={editorTheme}
          options={{
            fontSize: 13.5,
            fontFamily: '"JetBrains Mono", Menlo, monospace',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            automaticLayout: true,
            padding: { top: 12 },
            tabSize: 2,
            wordWrap: "on",
          }}
        />
      </div>
      <div className="lc-prob-code__status">
        <span>{savedFlash ? "Saved" : " "}</span>
        <span className="lc-muted">{langMeta?.label}</span>
      </div>
    </div>;
}
