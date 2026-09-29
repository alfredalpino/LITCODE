"""Loop-else runs when the loop does not break.

Predict the prints, including the empty-list call, before you run this.
"""


def search(xs, target):
    for item in xs:
        if item == target:
            print("found", item)
            break
    else:
        print("missing")


def main():
    search([1, 2, 3], 2)
    search([1, 2, 3], 9)
    search([], 1)


if __name__ == "__main__":
    main()
