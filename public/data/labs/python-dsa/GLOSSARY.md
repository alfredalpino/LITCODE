# Glossary

Words used in this laboratory. Later modules add terms; they should be added here when the module is built, not before the definition has been checked.

**Abstract syntax tree (AST).** A tree of the program’s structure after parsing: assignments, calls, operators, names. It is not bytecode and not text.

**Aliasing.** Two or more names bound to the same object. Mutating the object is visible through every alias.

**Amortized complexity.** A bound on the average cost of an operation over a sequence of operations, not on every single call. One `list.append` in CPython can copy the whole buffer; a long run of appends is still linear overall.

**Argument.** The object passed at a call. A parameter is the name in the function definition that receives it.

**Auxiliary space.** Extra memory the algorithm allocates beyond the input itself.

**Big O / Omega / Theta.** Upper bound, lower bound, and tight bound on growth. See `COMPLEXITY_REFERENCE.md`. They describe scaling, not a stopwatch reading.

**Binding.** The association between a name and an object. Assignment creates or replaces a binding. It does not copy the object.

**Bytecode.** The instruction sequence CPython executes. Other implementations may not use this bytecode. It can change between CPython versions.

**Callability.** Whether an object may be called with `()`. Functions are callable. Integers are not. The data model hook is `__call__`.

**Code object.** The compiled result: bytecode plus constants, names, and local-variable tables. `compile` returns one. A function holds one on `__code__`.

**Compile time (in this lab).** The work done to turn source into a code object, before that code object runs. `SyntaxError` is raised here. `NameError` is not, unless the name is used at the top level while that module is executing.

**Deep copy.** A new object whose nested objects are also new copies. `copy.deepcopy`.

**Dynamic typing.** Names do not have a fixed type. The object a name is bound to has a type. A name may be rebound to an object of a different type later.

**Equality (`==`).** Value equality, routed through the data model (`__eq__`), with a language-defined fallback. It does not mean “the same object”.

**Hashable.** An object that provides a hash value and a stable equality relationship suitable for dict keys and set members. Lists are not hashable. A tuple is hashable only when its elements are.

**Identity (`is`).** Whether two names refer to the same object. In CPython, `id(x)` is a number that identifies the object for its lifetime. Identity is not value.

**Immutable.** An object whose visible state cannot be changed after it is created. Rebinding a name is not a mutation of the old object. A tuple is immutable even when it contains a list; the list can still change.

**Implementation characteristic.** Behavior of CPython (or another runtime) that the language reference does not require. The small-integer cache and the GIL are in this category.

**Invariant.** A statement that is true at a well-defined point every time execution passes that point, such as “at the start of each loop, `lo` is the first index still possible”.

**Iterable.** An object that can produce an iterator, typically via `__iter__`. A list is iterable. An iterator is also iterable, and it yields values.

**Iterator.** An object with `__next__` that produces a sequence of values and then ends. In Python, the end is signaled with `StopIteration`.

**Mutability.** Whether an object’s state can change. Mutation is an operation on the object. Assignment is an operation on a name.

**Name.** An identifier in a namespace. `x` in `x = 1` is a name bound to an int object. The name is not the object.

**Namespace.** A mapping from names to objects. A module has one. A function call creates a local namespace. Classes have another. The LEGB search order is module 05.

**None.** The sole object of type `NoneType`, used as the absence of a value. It is not `0`, `False`, or `""`.

**Object.** A value with an identity, a type, and usually some state. In Python, `1`, `None`, a function, and a module are all objects.

**Reference.** The pointer-like link from a name, a list slot, or an attribute to an object. Several references may point at one object. This lab uses “reference” in that sense, not as C++ reference syntax.

**Shallow copy.** A new outer object whose slots still refer to the same inner objects. `list.copy`, slicing a list, and `copy.copy`.

**Strong typing.** Operations check that the objects involved support the operation. `"a" + 1` is a `TypeError`. Dynamic typing does not mean “types are ignored”.

**Truthiness.** The rule used by `if` and `while`. `None`, `False`, numeric zero, and empty containers are false. Almost everything else is true, including `"0"`, `"False"`, and `[0]`.

**Worst case / average case.** The cost on the most expensive input of size n, versus the cost under a stated distribution or hashing assumption. Average O(1) dict lookup is not a worst-case promise.
