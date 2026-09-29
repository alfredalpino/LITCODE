"""The author claims:

    Equal integers are always the same object, so `is` is a valid
    substitute for `==` when comparing ints.

The checks encode that claim. They do not all pass.
Diagnose the failure in writing before you open solutions/.
Do not "fix" this by caching integers yourself. Decide what the
claim got wrong.
"""


def independently(text):
    """Build an int from digits so it is not the same literal constant."""
    return int(text)


def main():
    pairs = [("0", "0"), ("256", "256"), ("257", "257"), ("-5", "-5"), ("-6", "-6")]
    failures = []
    for left, right in pairs:
        a = independently(left)
        b = independently(right)
        same = a is b
        print(f"{left:>4} is {right:<4} -> {same}   equal={a == b}")
        if not same:
            failures.append(left)

    if failures:
        print("claim failed for:", ", ".join(failures))
        raise SystemExit(1)
    print("claim held for every pair")


if __name__ == "__main__":
    main()
