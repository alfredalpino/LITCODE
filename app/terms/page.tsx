import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for the LITCODE developer laboratory.",
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <p>
        <strong>Last updated:</strong> 30 September 2026. This is an honest, counsel-ready{" "}
        <strong>draft</strong> describing intended use of LITCODE. It is{" "}
        <strong>not a substitute for legal advice</strong> and has not been signed off by
        counsel. Operators should obtain review before treating these terms as binding for a
        public commercial launch.
      </p>

      <h2>Agreement</h2>
      <p>
        By accessing or using LITCODE (the browser laboratory and related static content), you
        agree to use it under these draft terms and applicable law. If you do not agree, do not
        use the service.
      </p>

      <h2>What LITCODE is</h2>
      <p>
        LITCODE is a practice-first developer laboratory for self-study and interview
        preparation (language labs, judged challenges, and related tooling). Content, auto-judges,
        and progress features are provided for learning — not as certified assessments,
        employment decisions, or production engineering guarantees.
      </p>

      <h2>License to use</h2>
      <p>
        Subject to these terms, you may use the deployed studio for personal, educational, and
        non-abusive professional practice. You do not acquire ownership of LITCODE branding,
        curricula authorship, or software except as granted by open-source licenses that apply
        to specific files in the repository.
      </p>

      <h2>No warranty</h2>
      <p>
        THE STUDIO, CURRICULA, JUDGES, AND RELATED MATERIALS ARE PROVIDED &quot;AS IS&quot; AND
        &quot;AS AVAILABLE,&quot; WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING
        MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT, TO THE MAXIMUM
        EXTENT PERMITTED BY LAW. Lab solutions and judges may contain errors; verify critical
        claims independently.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, LITCODE operators and contributors are not
        liable for indirect, incidental, special, consequential, or punitive damages, or for
        loss of data, progress, profits, or opportunity arising from use of the laboratory —
        including localStorage loss, CDN/runtime failures, or incorrect judge results. Some
        jurisdictions do not allow certain limitations; in those places, liability is limited to
        the fullest extent allowed.
      </p>

      <h2>Acceptable use</h2>
      <p>
        You must not: disrupt or overload the service; scrape at abusive rates; attempt to bypass
        security or isolation boundaries; use the in-browser runtime to attack third parties;
        upload or run malware; or violate applicable law or third-party licenses in lab
        materials and linked problem statements. Live contests, rankings, and multi-tenant
        shared execution are deferred and must not be assumed from the Contest navigation entry.
      </p>

      <h2>Third-party content</h2>
      <p>
        The DSA index and company tags may reference or link to external problem statements
        (for example on LeetCode). Those sites have their own terms. LITCODE does not claim
        ownership of third-party problem text or trademarks.
      </p>

      <h2>Privacy</h2>
      <p>
        Data handling is described in the <a href="/privacy">Privacy</a> draft. Local-first
        storage is the default in this release.
      </p>

      <h2>Changes</h2>
      <p>
        Features and these terms may change as the product evolves. Continued use after a
        posted update constitutes acceptance of the revised draft on the deployed site, except
        where prohibited by law. Counsel should refine acceptance mechanics before commercial
        launch.
      </p>

      <h2>Contact</h2>
      <p>
        Questions: open an issue on the repository published with your deployment, or use the
        contact method in that README. Replace with a monitored operator contact before launch.
      </p>
    </LegalPage>
  );
}
