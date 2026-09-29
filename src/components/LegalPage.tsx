import Link from "next/link";
import type { ReactNode } from "react";
import { SiteFooter } from "@/components/SiteFooter";

type LegalPageProps = {
  title: string;
  children: ReactNode;
};

export function LegalPage({ title, children }: LegalPageProps) {
  return (
    <div className="legal-page">
      <header className="legal-page__header">
        <Link href="/labs" className="legal-page__home">
          ← Back to LITCODE
        </Link>
        <h1>{title}</h1>
      </header>
      <article className="legal-page__body">{children}</article>
      <SiteFooter />
    </div>
  );
}
