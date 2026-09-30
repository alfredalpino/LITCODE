# Annotation guidance (non-dogmatic)

**Exports / public functions:** annotate parameters and usually returns — they are contracts.

**Locals:** let inference work when initialization is clear.

**Fresh config objects:** annotation or `satisfies` catches typos via excess property checks / compatibility checks.

**When inference widens too much:** annotate the binding (`let status: Status`) or use `as const` / const objects.

**Anti-pattern:** Annotating every intermediate `const` with types already obvious from the right-hand side — noise without safety.
