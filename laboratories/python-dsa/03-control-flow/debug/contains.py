"""Intended behavior:

    contains([1, 2, 3], 3) is True
    contains([1, 2, 3], 1) is True
    contains([1, 2, 3], 9) is False
    contains([], 1) is False

At least one check fails. Find the control-flow bug.
Do not change the examples so that only the first element is tested.
"""


def contains(xs, target):
    for x in xs:
        if x == target:
            return True
        else:
            return False
    return False


def main():
    checks = [
        ([1, 2, 3], 3, True),
        ([1, 2, 3], 1, True),
        ([1, 2, 3], 9, False),
        ([], 1, False),
    ]
    failed = False
    for xs, target, expected in checks:
        got = contains(xs, target)
        status = "ok" if got is expected else "FAIL"
        if status == "FAIL":
            failed = True
        print(f"{status} contains({xs}, {target}) -> {got}, expected {expected}")
    if failed:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
