# C01 — Result alias

Define `type Result<T, E = string> = { ok: true; value: T } | { ok: false; error: E }` and a `mapResult` helper.
