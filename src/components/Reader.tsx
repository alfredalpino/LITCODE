import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { loadText } from "../lib/content";
import type { ContentDoc, LabModule } from "../types";
import "highlight.js/styles/github-dark.css";

interface ReaderProps {
  module: LabModule | null;
  referencePath: string | null;
  referenceTitle?: string;
  prevModule?: LabModule | null;
  nextModule?: LabModule | null;
  onPrev?: () => void;
  onNext?: () => void;
}

export function Reader({
  module,
  referencePath,
  referenceTitle,
  prevModule,
  nextModule,
  onPrev,
  onNext,
}: ReaderProps) {
  const docs: ContentDoc[] = module
    ? module.docs.filter((d) => d.category !== "solutions")
    : [];

  const [activeDocPath, setActiveDocPath] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (referencePath) {
      setActiveDocPath(referencePath);
      return;
    }
    if (module) {
      const primary =
        docs.find((d) => d.name === "README.md") ||
        docs.find((d) => d.name === "LAB.md") ||
        docs[0];
      setActiveDocPath(primary?.path ?? null);
    } else {
      setActiveDocPath(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [module?.id, referencePath]);

  useEffect(() => {
    if (!activeDocPath) {
      setMarkdown("");
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    loadText(activeDocPath)
      .then((text) => {
        if (!cancelled) setMarkdown(text);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeDocPath]);

  const heading =
    referencePath && referenceTitle
      ? referenceTitle
      : module
        ? `${String(module.order).padStart(2, "0")} · ${module.title}`
        : "Select a module";

  return (
    <section className="reader" aria-label="Reading material">
      <div className="reader__toolbar">
        <h1 className="reader__heading">{heading}</h1>
        {docs.length > 1 && !referencePath && (
          <div className="reader__tabs" role="tablist">
            {docs.map((doc) => (
              <button
                key={doc.id}
                type="button"
                role="tab"
                className={clsx(
                  "reader__tab",
                  activeDocPath === doc.path && "is-active"
                )}
                onClick={() => setActiveDocPath(doc.path)}
              >
                {doc.title}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="reader__body">
        {loading && <div className="reader__state">Loading…</div>}
        {error && <div className="reader__state is-error">{error}</div>}
        {!loading && !error && markdown && (
          <article className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {markdown}
            </ReactMarkdown>
          </article>
        )}
        {!loading && !error && !markdown && (
          <div className="reader__state">
            Pick a module from the curriculum to start reading.
          </div>
        )}
      </div>

      {(onPrev || onNext) && (
        <footer className="reader__nav">
          <button
            type="button"
            className="reader__nav-btn"
            disabled={!prevModule || !onPrev}
            onClick={onPrev}
          >
            <ChevronLeft size={16} />
            <span>
              <small>Previous</small>
              <strong>{prevModule?.title ?? "—"}</strong>
            </span>
          </button>
          <button
            type="button"
            className="reader__nav-btn reader__nav-btn--next"
            disabled={!nextModule || !onNext}
            onClick={onNext}
          >
            <span>
              <small>Next</small>
              <strong>{nextModule?.title ?? "—"}</strong>
            </span>
            <ChevronRight size={16} />
          </button>
        </footer>
      )}
    </section>
  );
}
