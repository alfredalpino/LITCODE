# C/C++ Curriculum

Derived from: roadmap.sh/cpp (C++ Developer roadmap) + algomaster/CppBetterExplained sequencing — fundamentals, OOP, pointers/memory, STL, templates, modern C++, concurrency.

| # | Module | Planned focus |
| --- | --- | --- |
| 00 | Introduction & Toolchain | C vs C++ history, GCC/Clang/MSVC, preprocess → compile → assemble → link, translation units, headers. |
| 01 | Syntax, Variables & Data Types | Fundamental types & sizes, const/constexpr, integer promotion & narrowing, cin/cout, auto. (after introduction-toolchain) |
| 02 | Control Flow & Functions | if/switch/loops, function declaration vs definition, pass-by-value vs reference, overloading, default args. |
| 03 | Arrays, Strings & Vectors | C arrays & decay, char* vs std::string, std::vector basics, range-based for, bounds & buffer safety. |
| 04 | Pointers, References & Memory | Address-of/deref, pointer arithmetic, references, new/delete, stack vs heap, dangling pointers & leaks. (after syntax-variables-types) |
| 05 | Object-Oriented C++ (Classes) | class vs struct, constructors/destructors, encapsulation, member init lists, the rule of three/five. |
| 06 | Inheritance & Polymorphism | Public inheritance, virtual functions & the vtable, abstract classes, override/final, slicing. (after oop-classes) |
| 07 | Templates & Generic Programming | Function & class templates, template argument deduction, specialization, an intro to concepts (C++20). |
| 08 | The Standard Template Library (STL) | Containers (vector/map/set/unordered_map), iterators, algorithms (sort/find/transform), functors & lambdas. |
| 09 | Resource Management & RAII | RAII idiom, unique_ptr/shared_ptr/weak_ptr, move semantics & rvalue references, ownership transfer. (after pointers-references-memory) |
| 10 | Modern C++ (C++11/17/20) | auto/decltype, structured bindings, optional/variant, ranges overview, constexpr, when to prefer them. |
| 11 | Concurrency & Multithreading | std::thread, mutex & lock_guard, condition_variable, atomics, data races & the memory model overview. |

All modules are currently **scaffold** status. See each module's `STATUS.md`.
