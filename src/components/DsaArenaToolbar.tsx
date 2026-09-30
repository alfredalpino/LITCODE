"use client";

import { Check, ChevronDown, LayoutGrid } from "lucide-react";
import { useMemo, type RefObject } from "react";
import clsx from "clsx";
import {
  JUDGE_LANGUAGES,
  runnableLanguageLabels,
  type JudgeLanguageId,
} from "../lib/judge-languages";

export type ArenaLayoutId = "default" | "stack" | "focus";

type LanguageOption = (typeof JUDGE_LANGUAGES)[number];

export function DsaLanguageSelect({
  language,
  label,
  open,
  onOpenChange,
  onSelect,
  containerRef,
}: {
  language: JudgeLanguageId;
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: JudgeLanguageId) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const columns = useMemo(
    () => [1, 2, 3].map((col) => JUDGE_LANGUAGES.filter((lang) => lang.column === col)),
    []
  );

  return (
    <div className="lc-prob-lang" ref={containerRef}>
      <button
        type="button"
        className="lc-prob-lang__btn"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        {label}
        <ChevronDown size={14} />
      </button>
      {open && (
        <div className="lc-prob-lang__menu" role="listbox">
          {columns.map((col, i) => (
            <div key={i} className="lc-prob-lang__col">
              {col.map((lang) => (
                <LanguageOptionButton
                  key={lang.id}
                  lang={lang}
                  selected={language === lang.id}
                  onSelect={onSelect}
                />
              ))}
            </div>
          ))}
          <p className="lc-prob-lang__note">
            Run/Submit in-browser: {runnableLanguageLabels()}. WASM engines download on
            first Run. Go / C / C++ / Java next — no remote sandboxes.
          </p>
        </div>
      )}
    </div>
  );
}

function LanguageOptionButton({
  lang,
  selected,
  onSelect,
}: {
  lang: LanguageOption;
  selected: boolean;
  onSelect: (id: JudgeLanguageId) => void;
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={selected}
      className={clsx(selected && "is-active")}
      onClick={() => onSelect(lang.id)}
    >
      {selected ? <Check size={14} /> : <span />}
      {lang.label}
      {!lang.runnable && <em>{lang.availability === "planned" ? "soon" : "soon*"}</em>}
    </button>
  );
}

const LAYOUTS = [
  ["default", "Default", "Equal description / code"],
  ["stack", "Stack", "Code + tests stacked (recommended)"],
  ["focus", "Focus", "Narrow statement, wide editor"],
] as const;

export function DsaLayoutSelect({
  layout,
  open,
  onOpenChange,
  onSelect,
  containerRef,
}: {
  layout: ArenaLayoutId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: ArenaLayoutId) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="lc-prob-top__right" ref={containerRef}>
      <button
        type="button"
        className={clsx("lc-icon-btn", open && "is-active")}
        aria-label="Layouts"
        aria-expanded={open}
        onClick={() => onOpenChange(!open)}
      >
        <LayoutGrid size={16} />
      </button>
      {open && (
        <div className="lc-prob-layouts">
          <div className="lc-prob-layouts__head">
            <strong>Layouts</strong>
          </div>
          <div className="lc-prob-layouts__grid">
            {LAYOUTS.map(([id, title, sub]) => (
              <button
                key={id}
                type="button"
                className={clsx(layout === id && "is-active")}
                onClick={() => onSelect(id)}
              >
                <span className={`lc-prob-layouts__thumb is-${id}`} aria-hidden />
                <strong>{title}</strong>
                <span>{sub}</span>
              </button>
            ))}
          </div>
          <p className="lc-prob-layouts__note">Pick a workspace layout — all options free.</p>
        </div>
      )}
    </div>
  );
}

/** Language and layout dropdowns for the DSA arena toolbar. */
export function DsaArenaToolbar({
  language,
  label,
  langOpen,
  onLangOpenChange,
  onSelectLanguage,
  langRef,
  layout,
  layoutOpen,
  onLayoutOpenChange,
  onSelectLayout,
  layoutRef,
}: {
  language: JudgeLanguageId;
  label: string;
  langOpen: boolean;
  onLangOpenChange: (open: boolean) => void;
  onSelectLanguage: (id: JudgeLanguageId) => void;
  langRef: RefObject<HTMLDivElement | null>;
  layout: ArenaLayoutId;
  layoutOpen: boolean;
  onLayoutOpenChange: (open: boolean) => void;
  onSelectLayout: (id: ArenaLayoutId) => void;
  layoutRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <>
      <DsaLanguageSelect
        language={language}
        label={label}
        open={langOpen}
        onOpenChange={onLangOpenChange}
        onSelect={onSelectLanguage}
        containerRef={langRef}
      />
      <DsaLayoutSelect
        layout={layout}
        open={layoutOpen}
        onOpenChange={onLayoutOpenChange}
        onSelect={onSelectLayout}
        containerRef={layoutRef}
      />
    </>
  );
}
