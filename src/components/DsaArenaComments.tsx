"use client";

import { MessageSquare } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { LocalComment } from "../lib/dsa/comments";
import { saveComment } from "../lib/dsa/comments";

export function DsaArenaComments(props: {
  problemId: string;
  commentDraft: string;
  setCommentDraft: Dispatch<SetStateAction<string>>;
  comments: LocalComment[];
  setComments: Dispatch<SetStateAction<LocalComment[]>>;
  loadComments: (problemId: string) => LocalComment[];
}) {
  const { problemId, commentDraft, setCommentDraft, comments, setComments, loadComments } = props;
  return (
    <div className="lc-prob-comments">
      <header className="lc-prob-comments__head">
        <h2>
          <MessageSquare size={16} /> Comments
        </h2>
        <span className="lc-prob-comments__count">{comments.length}</span>
      </header>
      <p className="lc-muted">
        Private notes on this device — not a public forum yet.
      </p>
      <textarea
        value={commentDraft}
        onChange={(e) => setCommentDraft(e.target.value)}
        placeholder="Leave a note for yourself…"
        rows={3}
      />
      <div className="lc-prob-comments__actions">
        <button
          type="button"
          className="run-btn"
          disabled={!commentDraft.trim()}
          onClick={() => {
            saveComment(problemId, commentDraft.trim());
            setCommentDraft("");
            setComments(loadComments(problemId));
          }}
        >
          Post locally
        </button>
      </div>
      <ul className="lc-prob-comments__list">
        {comments.map((c) => (
          <li key={c.id}>
            <time>{new Date(c.ts).toLocaleString()}</time>
            <p>{c.body}</p>
          </li>
        ))}
        {comments.length === 0 && (
          <li className="lc-muted">No comments yet — be the first note here.</li>
        )}
      </ul>
    </div>
  );
}
