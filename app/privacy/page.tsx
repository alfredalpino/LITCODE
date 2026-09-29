import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How LITCODE handles data in the browser-first laboratory.",
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy">
      <p>
        <strong>Last updated:</strong> 30 September 2026. This draft describes how the
        LITCODE studio behaves today. It is <strong>not legal advice</strong> and has not
        been reviewed by counsel. Operators should consult qualified counsel before relying
        on this page for a public commercial launch or regulated jurisdiction.
      </p>

      <h2>Summary</h2>
      <p>
        LITCODE is a browser-first practice laboratory. In the current product, progress and
        learning evidence stay in your browser by default. There are no user accounts and no
        central progress database operated by LITCODE in this release.
      </p>

      <h2>Information stored on your device</h2>
      <p>
        The app may store preferences, progress maps, favorites, notification state, and a
        local learning-event log in your browser (<code>localStorage</code>, keys prefixed{" "}
        <code>sde-lab-*</code>). Clearing site data for this origin removes that evidence.
        LITCODE does not receive a copy of that data unless you later enable a sync or
        analytics feature that you explicitly configure.
      </p>

      <h2>Code execution</h2>
      <p>
        JavaScript, TypeScript (via client transpile), and Python (via Pyodide in the browser)
        run on your device for learning. Untrusted learner code is not executed in the Next.js
        server process. Browser execution still means scripts you run can access the same
        origin&apos;s storage and network capabilities as any page script — treat unknown
        snippets carefully.
      </p>

      <h2>Third-party services loaded in the browser</h2>
      <p>
        Depending on configuration and features you use, the page may load third-party assets
        such as Google Fonts and the Pyodide CDN. Those providers receive standard HTTP
        request metadata (for example IP address and user agent) according to their own
        policies. Prefer self-hosted fonts / pinned runtimes when you need stricter privacy.
      </p>

      <h2>Analytics (optional, operator-controlled)</h2>
      <p>
        If the site operator sets <code>NEXT_PUBLIC_ANALYTICS_ENDPOINT</code>, the client may
        POST optional usage events (for example navigation or search length). When that
        variable is unset, the analytics helper is a no-op and no analytics requests are made.
        Operators should avoid sending personally identifiable information and should document
        the event schema if analytics is enabled.
      </p>

      <h2>Children</h2>
      <p>
        LITCODE is aimed at adult learners and professional interview preparation. It is not
        directed at children under 13 (or the equivalent age of digital consent in your
        region). Do not use the product if you are under the applicable age.
      </p>

      <h2>Changes</h2>
      <p>
        This draft may change as features (accounts, sync, analytics) ship. Material changes
        should bump the &quot;Last updated&quot; date. Counsel review is recommended before
        presenting this as a binding privacy policy.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this draft: open an issue on the LITCODE / laboratory repository
        published with your deployment, or use the contact method listed in that repository
        README. Operators should replace this with a monitored email before commercial launch.
      </p>
    </LegalPage>
  );
}
