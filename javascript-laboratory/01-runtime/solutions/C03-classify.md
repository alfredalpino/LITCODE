# Solution — C03 Classify

1. `===` — **L**
2. `document.querySelector` — **H** (browser)
3. Hidden classes / shapes — **E**
4. `fs.readFile` — **H** (Node)
5. Function call semantics — **L**
6. `setTimeout` — **H** (common host API)
7. JIT tier-up heuristics — **E**
8. `const` binding rules — **L**
9. `process.env` — **H** (Node)
10. Promise Jobs — **L** (specified jobs; host drains queues — often discussed as **M** with nuance)
11. Chrome DevTools Protocol — **H**/tooling (not language)
12. `typeof` — **L**

**Nuance on (10):** The Promise Job queue is an ECMAScript concept; the host’s event loop integrates with it. “Mixed” is acceptable if explained.
