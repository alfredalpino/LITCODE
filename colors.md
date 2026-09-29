# LITCODE — Colors

## Principle

Editor-grade neutrals. One calm accent. Flat surfaces. No neon teal, no decorative gradients.

Palette inspired by **Omarchy**’s default `colors.toml` (Tokyo Night Night family): soft blue accent, muted lavender text, deep ink backgrounds.

## Core palette (dark)

| Token | Hex | Role |
|---|---|---|
| `--lf-void` | `#0E0E14` | Deepest / editor canvas |
| `--lf-slate` | `#1A1B26` | App chrome |
| `--lf-panel` | `#1F2335` | Panels, nav, cards |
| `--lf-elevated` | `#24283B` | Raised surfaces |
| `--lf-line` | `#292E42` | Borders |
| `--lf-steel` | `#565F89` | Secondary text / icons |
| `--lf-chalk` | `#A9B1D6` | Body text |
| `--lf-bright` | `#C0CAF5` | Headings / primary text |
| `--lf-signal` | `#7AA2F7` | Accent (soft blue — not neon) |
| `--lf-signal-dim` | `#5D7DC7` | Pressed / strong accent |
| `--lf-warn` | `#E0AF68` | Caution / scaffold |
| `--lf-danger` | `#F7768E` | Errors |
| `--lf-pass` | `#9ECE6A` | Success / easy |

## Light mode

Cool gray surfaces (`#F5F6F8` / `#FFFFFF`) with deeper blue accent `#3D59A1` for WCAG on light.

## Usage rules

1. **Accent scarcity** — signal blue for focus, primary CTA, active nav — not every chip.
2. **Flat first** — solid fills; avoid linear/radial gradients in chrome.
3. **Honesty** — warn gold for scaffolds; never paint incomplete as success green.
4. **Shadows** — prefer 1px borders over soft glow / multi-layer shadows.
