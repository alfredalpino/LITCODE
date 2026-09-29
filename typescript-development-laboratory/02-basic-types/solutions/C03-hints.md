# C03 Hints

## Hint 1
`assertNever` takes `never` so calling it with a leftover union member becomes a compile error.

## Hint 2
Put `assertNever(status)` in the `default` of a switch after handling all known literals.

## Hint 3
Throw `new Error(String(value))` so unexpected runtime values still fail loudly.
