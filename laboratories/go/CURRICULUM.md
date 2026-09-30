# Go Curriculum

Derived from: roadmap.sh Go developer roadmap (language track only — Tour of Go / Effective Go outline).

| # | Module | Planned focus |
| --- | --- | --- |
| 00 | Environment & the Go Toolchain | go install, GOPATH vs modules, go run/build/test, gofmt, and how the compiler & linker fit together. |
| 01 | Syntax, Values & Types | Variables, constants, iota, basic types, zero values, type inference with :=, and typed vs untyped constants. |
| 02 | Control Flow & Functions | if/for/switch (no while), multiple return values, named returns, variadics, and defer ordering. |
| 03 | Structs, Methods & Interfaces | Struct literals, value vs pointer receivers, interface satisfaction, embedding, and the empty interface / any. |
| 04 | Slices, Maps & Arrays | Arrays vs slices, len/cap, make/append growth, copy semantics, maps, and range gotchas. |
| 05 | Pointers & Memory | Pointers, value vs reference semantics, escape analysis intuition, and when new vs make applies. |
| 06 | Errors, Panic & Recover | The error interface, sentinel errors, errors.Is/As wrapping, panic/recover, and defer cleanup. |
| 07 | Goroutines & Channels | Goroutines, unbuffered vs buffered channels, select, sync.WaitGroup/Mutex, and race conditions. |
| 08 | Packages & Modules | Package layout, exported identifiers, imports, go.mod/go.sum, and semantic import versioning. |
| 09 | Testing & Tooling | testing package, table-driven tests, subtests, benchmarks, go vet, and coverage. |

All modules are currently **scaffold** status. See each module's `STATUS.md`.
