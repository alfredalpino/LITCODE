# Solution sketch — C04 Mini tracer

See Hint 3 in the challenge for a reference implementation.

Self-check script idea:

```js
"use strict";

let depth = 0;
function trace(name, fn) {
  return function traced(...args) {
    console.log(`${"  ".repeat(depth)}→ ${name}`);
    depth += 1;
    try {
      return fn.apply(this, args);
    } finally {
      depth -= 1;
      console.log(`${"  ".repeat(depth)}← ${name}`);
    }
  };
}

const c = trace("c", () => "ok");
const b = trace("b", () => c());
const a = trace("a", () => b());

console.log("result:", a());
```

This is educational — not OpenTelemetry.
