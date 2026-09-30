# Ruby Curriculum

Derived from: Community Ruby learning outline (rubymonstas / coders.sh Ruby track — language track only, not Rails).

| # | Module | Planned focus |
| --- | --- | --- |
| 00 | Environment & the Ruby Runtime | rbenv/ruby install, irb/pry REPL, how MRI parses and evaluates a script, everything-is-an-object mental model. |
| 01 | Syntax, Values & Types | Integers, floats, booleans, nil, symbols vs strings, truthiness (only nil/false are falsey), object_id. (after environment-runtime) |
| 02 | Control Flow & Methods | if/unless/case, while/until, method definition, implicit return, default & keyword args, splat args. |
| 03 | Collections: Arrays, Hashes & Enumerable | Array/Hash literals, the Enumerable module (map/select/reduce/each_with_object), lazy enumerators. |
| 04 | Strings & Symbols | String mutability, interpolation, format, frozen string literals, symbol interning and when to use each. |
| 05 | Objects & Classes | Defining classes, initialize, instance vs class variables, attr_accessor, self, the method lookup chain. |
| 06 | Modules & Mixins | Namespacing, include vs extend vs prepend, Comparable/Enumerable mixins, ancestors chain. |
| 07 | Blocks, Procs & Lambdas | yield & block_given?, &block conversion, Proc vs lambda arity/return semantics, closures over scope. |
| 08 | Error Handling & Exceptions | begin/rescue/ensure/retry, exception hierarchy, raising and defining custom errors, ensure vs return. |
| 09 | Metaprogramming | define_method, method_missing/respond_to_missing?, send, open classes, instance_variable_get/set. |
| 10 | Testing (Minitest & RSpec basics) | Minitest assertions vs RSpec expectations, arrange/act/assert, red-green loop, test doubles overview. |

All modules are currently **scaffold** status. See each module's `STATUS.md`.
