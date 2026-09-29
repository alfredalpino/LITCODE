"""Quadratic string builder used like a buffer. Fix it."""

def report(lines):
    out = ""
    for line in lines:
        out += line + "\n"
    return out


def main():
    print(report(["a", "b", "c"]))


if __name__ == "__main__":
    main()
