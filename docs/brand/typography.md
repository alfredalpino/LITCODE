# LITCODE — Typography

## Stack (product + brand)

| Role | Family | Why |
|---|---|---|
| **UI / brand** | [Instrument Sans](https://fonts.google.com/specimen/Instrument+Sans) | Already in the studio; geometric, modern, non-Inter default |
| **Code / data** | [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) | Engineer-native; clear at small sizes in Monaco-adjacent UI |
| **Fallback UI** | `ui-sans-serif, system-ui, sans-serif` | Resilience only |
| **Fallback mono** | `ui-monospace, SFMono-Regular, Menlo, monospace` | Resilience only |

Do **not** default brand comps to Inter, Roboto, Arial, or system-only stacks for marketing surfaces.

## Scale (recommended)

| Token | Size / weight | Use |
|---|---|---|
| `display` | 40–56px / 600 | Landing hero brand moments only |
| `title` | 24–32px / 600 | Section titles |
| `headline` | 18–20px / 600 | Card/panel titles (when cards exist for interaction) |
| `body` | 14–16px / 400–500 | Reading lessons, settings |
| `label` | 12–13px / 500–600 | Nav, chips, meta |
| `code` | 13–14px / 400–500 | Editor chrome, console, inline code |

Tracking: slightly open on display wordmarks (`0.01–0.04em`); neutral on body.

## Brand wordmark typesetting

- Spell **LITCODE** as one word, capital L only  
- Do not letterspace aggressively into “luxury fashion” territory  
- Mark + wordmark gap ≈ 0.6× mark height  

## Pairing with Monaco

Instrument Sans owns chrome; JetBrains Mono owns code and numeric evidence (streaks, timings labeled as browser timing). Never set long lessons in mono.
