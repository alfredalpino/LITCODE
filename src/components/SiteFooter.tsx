import Link from "next/link";

/** Minimal site footer — legal links for launch readiness. */
export function SiteFooter() {
  return (
    <footer className="site-footer" aria-label="Site">
      <span className="site-footer__brand">LITCODE</span>
      <nav className="site-footer__nav" aria-label="Legal">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
    </footer>
  );
}
