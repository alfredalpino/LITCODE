# Solution sketch — C01

TDZ example: access `x` on the line before `let x = 1` in the same block.

`var` example: `console.log(x); var x = 1;` → `undefined`.

Mechanism: both create bindings early; only `var` initializes to `undefined` immediately.
