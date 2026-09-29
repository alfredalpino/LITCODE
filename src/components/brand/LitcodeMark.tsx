"use client";

/**
 * LITCODE brand mark — an animated "spark → ignite → campfire" glyph.
 *
 * Narrative (~3s, then a gentle infinite flicker):
 *   1. A signal-blue code spark twinkles in and darts down to the hearth.
 *   2. It ignites in a warm flash.
 *   3. A small premium campfire settles in and flickers forever.
 *
 * Colors come straight from the Omarchy / Tokyo Night tokens in App.css
 * (`--lf-signal`, `--lf-warn`, `--lf-danger`, `--lf-steel`, `--lf-bright`)
 * so the mark adapts to light/dark themes automatically. No neon.
 *
 * Honors `prefers-reduced-motion`: renders a calm, steady campfire with no
 * spark, flash, or flicker.
 */

import { motion, useReducedMotion } from "framer-motion";

export type LitcodeMarkSize = "sm" | "md" | "lg";

const SIZE_PX: Record<LitcodeMarkSize, number> = {
  sm: 24,
  md: 31,
  lg: 70,
};

const EASE = [0.22, 1, 0.36, 1] as const;

/** Four-point sparkle, centered on (0,0) so it can be freely transformed. */
const SPARK_PATH =
  "M0 -7 C 1 -2 2 -1 7 0 C 2 1 1 2 0 7 C -1 2 -2 1 -7 0 C -2 -1 -1 -2 0 -7 Z";

/** Outer flame teardrop (gold). Base ~y47, tip ~y15, with a subtle inner curl. */
const FLAME_OUTER =
  "M32 15 C 27 23 24 28 24 35 C 24 42 27.6 47 32 47 C 36.4 47 40 42 40 35 C 40 30 37.6 26 35.2 22.4 C 34.6 27 32.6 27 32.6 23.2 C 32.6 20 33 17 32 15 Z";

/** Inner flame (lighter, warmer core body). */
const FLAME_INNER =
  "M32 27 C 29.2 31 28.2 33.8 28.2 37 C 28.2 41.4 30 44.6 32 44.6 C 34 44.6 35.8 41.4 35.8 37 C 35.8 34 34.8 32 33.4 30 C 33.1 32.4 31.8 32.4 31.8 30.6 C 31.8 29 32 28 32 27 Z";

export interface LitcodeMarkProps {
  /** Preset size token, or pass `size` as a number for a custom pixel size. */
  size?: LitcodeMarkSize | number;
  className?: string;
  /**
   * Accessible label. When provided the SVG is exposed as an image with this
   * name; otherwise the mark is decorative (`aria-hidden`).
   */
  title?: string;
}

export function LitcodeMark({ size = "md", className, title }: LitcodeMarkProps) {
  const reduce = useReducedMotion();
  const px = typeof size === "number" ? size : SIZE_PX[size];
  const labelled = Boolean(title);

  // Origin at the hearth so the flame scales/flickers from its base.
  const flameOrigin = {
    transformBox: "view-box" as const,
    transformOrigin: "32px 47px",
  };

  return (
    <svg
      className={className}
      width={px}
      height={px}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role={labelled ? "img" : undefined}
      aria-label={labelled ? title : undefined}
      aria-hidden={labelled ? undefined : true}
    >
      {title ? <title>{title}</title> : null}

      {/* ——— Campfire (fades/rises in after ignition) ——— */}
      <motion.g
        style={flameOrigin}
        initial={reduce ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.55 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={
          reduce
            ? { duration: 0 }
            : { duration: 0.5, ease: EASE, delay: 0.95 }
        }
      >
        {/* Ember glow at the hearth */}
        <motion.ellipse
          cx="32"
          cy="49"
          rx="13"
          ry="6"
          fill="var(--lf-danger)"
          initial={{ opacity: reduce ? 0.24 : 0 }}
          animate={
            reduce
              ? { opacity: 0.24 }
              : { opacity: [0, 0.34, 0.24, 0.32, 0.24] }
          }
          transition={
            reduce
              ? { duration: 0 }
              : {
                  duration: 2.4,
                  times: [0, 0.15, 0.45, 0.75, 1],
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 1.15,
                }
          }
        />

        {/* Crossed logs */}
        <g fill="var(--lf-steel)">
          <rect
            x="19"
            y="48.5"
            width="26"
            height="4.2"
            rx="2.1"
            transform="rotate(-14 32 50.6)"
          />
          <rect
            x="19"
            y="48.5"
            width="26"
            height="4.2"
            rx="2.1"
            transform="rotate(14 32 50.6)"
            opacity="0.82"
          />
        </g>

        {/* Flame — infinite gentle flicker */}
        <motion.g
          style={flameOrigin}
          animate={
            reduce
              ? undefined
              : {
                  scaleY: [1, 1.08, 0.96, 1.05, 1],
                  scaleX: [1, 0.98, 1.03, 0.99, 1],
                  x: [0, -0.6, 0.5, -0.3, 0],
                }
          }
          transition={
            reduce
              ? undefined
              : {
                  duration: 1.9,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: 1.15,
                }
          }
        >
          <path d={FLAME_OUTER} fill="var(--lf-warn)" />
          <path
            d={FLAME_INNER}
            fill="color-mix(in srgb, var(--lf-warn) 45%, var(--lf-bright))"
          />
          {/* Hot core */}
          <motion.circle
            cx="32"
            cy="39.5"
            r="2.6"
            fill="var(--lf-bright)"
            animate={reduce ? undefined : { opacity: [0.85, 1, 0.8, 0.95, 0.85] }}
            transition={
              reduce
                ? undefined
                : {
                    duration: 1.9,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 1.15,
                  }
            }
          />
        </motion.g>
      </motion.g>

      {/* ——— Ignition flash (skipped when reduced) ——— */}
      {reduce ? null : (
        <motion.circle
          cx="32"
          cy="41"
          r="9"
          fill="var(--lf-warn)"
          style={{ transformBox: "view-box", transformOrigin: "32px 41px" }}
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: [0, 0.9, 0], scale: [0.3, 1.7, 2.3] }}
          transition={{ duration: 0.5, times: [0, 0.3, 1], ease: EASE, delay: 0.9 }}
        />
      )}

      {/* ——— Code spark (skipped when reduced) ——— */}
      {reduce ? null : (
        <motion.g
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          initial={{ opacity: 0, x: 47, y: 10, scale: 0, rotate: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            x: [47, 42, 36, 33],
            y: [10, 20, 34, 43],
            scale: [0, 1, 1.25, 0.2],
            rotate: [0, 90, 160, 210],
          }}
          transition={{ duration: 0.95, times: [0, 0.35, 0.7, 1], ease: EASE, delay: 0.15 }}
        >
          <path d={SPARK_PATH} fill="var(--lf-signal)" />
        </motion.g>
      )}
    </svg>
  );
}

export default LitcodeMark;
