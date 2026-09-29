"use client";

export default function StudioError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="boot-error">
      <div className="boot-error__brand">
        <span className="boot-mark" aria-hidden />
        LITCODE
      </div>
      <h1>Studio hit an error</h1>
      <p>{error.message || "Something went wrong loading this view."}</p>
      <button type="button" className="lf-btn lf-btn--primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
