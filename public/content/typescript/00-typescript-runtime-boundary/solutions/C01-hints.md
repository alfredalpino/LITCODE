# C01 Hints

## Hint 1 — conceptual

Ask for each snippet: is the checker rejecting a type mismatch, an excess property on a fresh literal, or allowing structural assignability through a variable?

## Hint 2 — directional

A vs B vs C differ because **freshness** changes excess property checking. D separates checker rejection from runtime JS behavior.

## Hint 3 — implementation

Put each snippet alone in a file under `/tmp` or a scratch folder and run `npx tsc --noEmit --strict`.
