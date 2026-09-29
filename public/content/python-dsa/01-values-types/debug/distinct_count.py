"""Intended behavior:

    distinct_count([True, 1, 2]) == 3
    distinct_count([1, 1, 2]) == 2
    distinct_count([]) == 0

The implementation fails at least one of these.
Decide whether `set` is wrong, or the implementation chose a tool
that does not match the spec. Write that down before you change code.
"""


def distinct_count(values):
    return len(set(values))


def main():
    checks = [
        ([True, 1, 2], 3),
        ([1, 1, 2], 2),
        ([], 0),
    ]
    failed = False
    for values, expected in checks:
        got = distinct_count(values)
        status = "ok" if got == expected else "FAIL"
        if status == "FAIL":
            failed = True
        print(f"{status} distinct_count({values!r}) -> {got}, expected {expected}")
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
