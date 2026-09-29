"""Disassemble a few functions.

Opcode names depend on the CPython version. Read them as evidence of
loads, an operation, and a return. Do not memorize the names.
"""

import dis


def add_one(n):
    return n + 1


def add_missing(a):
    return a + missing


def main():
    print("--- add_one ---")
    dis.dis(add_one)
    print("--- add_missing (defined, not called) ---")
    dis.dis(add_missing)


if __name__ == "__main__":
    main()
