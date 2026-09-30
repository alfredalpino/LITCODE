"""Shallow copy versus deep copy of a nested list.

Predict the three structures and the two identity checks before you run this.
"""

import copy


def main():
    nested = [[1], [2]]
    shallow = copy.copy(nested)
    deep = copy.deepcopy(nested)
    nested[0].append(9)

    print("nested ", nested)
    print("shallow", shallow)
    print("deep   ", deep)
    print("nested[0] is shallow[0]", nested[0] is shallow[0])
    print("nested[0] is deep[0]   ", nested[0] is deep[0])
    print("nested is shallow", nested is shallow)


if __name__ == "__main__":
    main()
