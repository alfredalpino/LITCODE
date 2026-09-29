# Rust Curriculum

Derived from: roadmap.sh/rust (Rust Developer roadmap) — Introduction, Language Basics, Data Structures, Ownership, Error Handling, Concurrency, Modules/Crates, Macros, Traits/Generics.

| # | Module | Planned focus |
| --- | --- | --- |
| 00 | Introduction & Toolchain | What/why Rust, rustup, cargo new/run/build, the Rust Playground, edition model, rustfmt/clippy. |
| 01 | Variables, Data Types & Constants | let/let mut, shadowing, scalar (i32/f64/bool/char) & compound (tuple/array) types, const vs static. (after introduction-toolchain) |
| 02 | Control Flow & Constructs | if as expression, loop/while/for, loop labels & break values, ranges, match basics. |
| 03 | Functions & Method Syntax | fn signatures, expressions vs statements, return, impl methods, associated functions. |
| 04 | Ownership & Borrowing | Move semantics, &T vs &mut T, the borrow checker rules, slices, stack vs heap, Copy vs Clone. (after variables-types-constants) |
| 05 | Structs, Enums & Pattern Matching | struct/tuple/unit structs, enums with data, match exhaustiveness, if let/while let, Option destructuring. |
| 06 | Error Handling (Option, Result, ?) | Option vs Result, the ? operator, propagating errors, custom error types, panic! vs recoverable errors. (after structs-enums-matching) |
| 07 | Traits & Generics | Trait definitions & impls, trait bounds, associated types, generic functions/structs, trait objects (dyn). |
| 08 | Collections & Data Structures | Vec, String, HashMap/HashSet, BTreeMap, iterators & adaptors, ownership interplay with collections. |
| 09 | Modules, Crates & Cargo | mod/use/pub visibility, crate layout, dependency management, workspaces, publishing to crates.io. |
| 10 | Concurrency & Parallelism | threads, move closures, channels (mpsc), Arc<Mutex<T>>, Send/Sync marker traits, data-race freedom. |
| 11 | Macros & Metaprogramming | declarative macro_rules!, an overview of procedural macros & custom derive, when macros beat functions. |

All modules are currently **scaffold** status. See each module's `STATUS.md`.
