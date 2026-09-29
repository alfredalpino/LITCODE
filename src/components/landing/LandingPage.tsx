"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { LitMark } from "./LitMark";
import { ProductPreview } from "./ProductPreview";
import "./landing.css";

const ease = [0.22, 1, 0.36, 1] as const;

const surfaces = [
  {
    href: "/problems",
    title: "Judged problem arena",
    body: "LeetCode-class problem chrome — topics, difficulty, company tags, stopwatch, and run/submit — without a paywall.",
  },
  {
    href: "/companies",
    title: "Company packs",
    body: "Browse by company the way curated lists do. Packs stay on their own pages. Nothing locked behind Premium.",
  },
  {
    href: "/labs",
    title: "Language laboratories",
    body: "JavaScript, TypeScript, and Python experiments. Predict before you run. Break until the runtime makes sense.",
  },
  {
    href: "/progress",
    title: "Honest progress",
    body: "Skill graph and evidence from labs and judged sets — not fake acceptance rates or inventory theater.",
  },
] as const;

const loopSteps = [
  {
    n: "01",
    title: "Predict",
    body: "Write what you think will happen before the runtime tells you.",
  },
  {
    n: "02",
    title: "Run",
    body: "Execute in the browser studio. See the host, not a slide deck.",
  },
  {
    n: "03",
    title: "Break",
    body: "Change inputs. Force edge cases. Deliberate breakage is the method.",
  },
  {
    n: "04",
    title: "Prove",
    body: "Transfer the concept to a judged challenge. Keep only what holds.",
  },
] as const;

const freePoints = [
  {
    title: "No premium tier",
    body: "Problems, company packs, labs, and progress are available without unlocking.",
  },
  {
    title: "Open source direction",
    body: "Curriculum and studio ship as an open product — inspect it, fork it, improve it.",
  },
  {
    title: "Same surfaces. Different thesis.",
    body: "Arena, companies, contest mode, interview practice — without grinding as the brand identity.",
  },
] as const;

export function LandingPage() {
  const reduce = useReducedMotion();
  const enter = reduce
    ? { opacity: 1, y: 0 }
    : { opacity: 0, y: 18 };
  const shown = { opacity: 1, y: 0 };

  return (
    <div className="lf-landing">
      <header className="lf-nav">
        <Link href="/" className="lf-nav__brand" aria-label="LITCODE home">
          <LitMark size={26} className="lf-nav__mark" />
          <span>LITCODE</span>
        </Link>
        <nav className="lf-nav__links" aria-label="Primary">
          <Link href="/labs">Labs</Link>
          <Link href="/problems">Problems</Link>
          <Link href="/companies">Companies</Link>
          <Link href="/interview">Interview</Link>
        </nav>
        <div className="lf-nav__actions">
          <span className="lf-nav__badge">Free · Open source</span>
          <Link href="/labs" className="lf-btn lf-btn--primary lf-btn--sm">
            Open studio
          </Link>
        </div>
      </header>

      <main>
        {/* Hero — one composition: brand, one line, one sub, CTAs, product plane */}
        <section className="lf-hero" aria-labelledby="lf-brand">
          <div className="lf-hero__grid" aria-hidden />
          <div className="lf-hero__copy">
            <motion.p
              className="lf-hero__tag"
              initial={enter}
              animate={shown}
              transition={{ duration: 0.55, ease }}
            >
              Predict. Run. Break. Prove.
            </motion.p>
            <motion.h1
              id="lf-brand"
              className="lf-hero__brand"
              initial={enter}
              animate={shown}
              transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.04 }}
            >
              LITCODE
            </motion.h1>
            <motion.p
              className="lf-hero__headline"
              initial={enter}
              animate={shown}
              transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.1 }}
            >
              Everything the paid grind platforms ship — free, open, and built to teach.
            </motion.p>
            <motion.p
              className="lf-hero__sub"
              initial={enter}
              animate={shown}
              transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.16 }}
            >
              Language labs, judged problems, company packs, and interview practice in one
              studio. No paywall. No premium lock. Open source.
            </motion.p>
            <motion.div
              className="lf-hero__cta"
              initial={enter}
              animate={shown}
              transition={{ duration: 0.6, ease, delay: reduce ? 0 : 0.22 }}
            >
              <Link href="/labs" className="lf-btn lf-btn--primary">
                Start in the lab
              </Link>
              <Link href="/problems" className="lf-btn lf-btn--ghost">
                Browse problems
              </Link>
            </motion.div>
          </div>
          <motion.div
            className="lf-hero__stage"
            initial={reduce ? { opacity: 1 } : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease, delay: reduce ? 0 : 0.28 }}
          >
            <ProductPreview />
          </motion.div>
        </section>

        {/* Free / open source — one job */}
        <section className="lf-band lf-band--free" aria-labelledby="lf-free-title">
          <div className="lf-band__inner">
            <p className="lf-kicker">Access</p>
            <h2 id="lf-free-title">Paid catalogs charge for depth. We open it.</h2>
            <p className="lf-lead">
              LITCODE gives you the practice surfaces engineers already expect — problems,
              companies, contests, progress — without a subscription gate. The product is free.
              The codebase and curriculum are open source.
            </p>
            <ul className="lf-free-list">
              {freePoints.map((item) => (
                <li key={item.title}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Surfaces — one job: what ships */}
        <section className="lf-band" aria-labelledby="lf-surfaces-title">
          <div className="lf-band__inner">
            <p className="lf-kicker">Studio</p>
            <h2 id="lf-surfaces-title">The surfaces. Without the meter.</h2>
            <p className="lf-lead">
              Same jobs as the big grind apps and curated lists — arena, companies, labs —
              with laboratory pedagogy underneath.
            </p>
            <ul className="lf-surface-list">
              {surfaces.map((s, i) => (
                <motion.li
                  key={s.href}
                  initial={reduce ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.45, ease, delay: reduce ? 0 : i * 0.06 }}
                >
                  <Link href={s.href} className="lf-surface-row">
                    <span className="lf-surface-row__index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="lf-surface-row__text">
                      <span className="lf-surface-row__title">{s.title}</span>
                      <span className="lf-surface-row__body">{s.body}</span>
                    </span>
                    <span className="lf-surface-row__go" aria-hidden>
                      →
                    </span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>
        </section>

        {/* Pedagogy loop — one job */}
        <section className="lf-band lf-band--loop" aria-labelledby="lf-loop-title">
          <div className="lf-band__inner">
            <p className="lf-kicker">Method</p>
            <h2 id="lf-loop-title">The loop is the product.</h2>
            <p className="lf-lead">
              Volume platforms optimize for catalog size. LITCODE optimizes for experiments
              that stick — then transfer to judged challenges.
            </p>
            <ol className="lf-loop">
              {loopSteps.map((step, i) => (
                <motion.li
                  key={step.n}
                  initial={reduce ? false : { opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.4, ease, delay: reduce ? 0 : i * 0.07 }}
                >
                  <span className="lf-loop__n">{step.n}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </motion.li>
              ))}
            </ol>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="lf-band lf-band--close" aria-labelledby="lf-close-title">
          <div className="lf-band__inner lf-close">
            <h2 id="lf-close-title">Prove what you think you know.</h2>
            <p>
              Open the studio. Run an experiment. Or start on a judged problem — same shell,
              free either way.
            </p>
            <div className="lf-hero__cta">
              <Link href="/labs" className="lf-btn lf-btn--primary">
                Open studio
              </Link>
              <Link href="/companies" className="lf-btn lf-btn--ghost">
                Company packs
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="lf-footer">
        <div className="lf-footer__brand">
          <LitMark size={22} />
          <span>LITCODE</span>
        </div>
        <p className="lf-footer__tag">Predict. Run. Break. Prove.</p>
        <nav className="lf-footer__nav" aria-label="Footer">
          <Link href="/labs">Labs</Link>
          <Link href="/problems">Problems</Link>
          <Link href="/companies">Companies</Link>
          <Link href="/privacy">Privacy</Link>
          <Link href="/terms">Terms</Link>
        </nav>
      </footer>
    </div>
  );
}
