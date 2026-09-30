# Solutions — broken challenges

## 01-silent-order.js

Swap the mismatched strings so `printBeta` logs `"beta"` and `printGamma` logs `"gamma"`.

## 02-not-a-function.js

Remove `answer();` — numbers are not callable. Keep `console.log(answer)`.

### Deeper

Calling a non-callable value throws **TypeError** at runtime after earlier statements have run (`ready` still prints).
