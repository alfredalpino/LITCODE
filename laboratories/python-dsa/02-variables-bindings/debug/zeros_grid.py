"""Intended behavior:

    plant_corner(3, 3) returns
        [[1, 0, 0],
         [0, 0, 0],
         [0, 0, 0]]

    The three rows are independent lists.
    Setting one cell changes one cell.

The function fails that test. Find how the grid was built.
Do not special-case the corner.
"""


def zeros(rows, cols):
    return [[0] * cols] * rows


def plant_corner(rows, cols):
    grid = zeros(rows, cols)
    grid[0][0] = 1
    return grid


def main():
    grid = plant_corner(3, 3)
    expected = [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
    ]
    print("got:")
    for row in grid:
        print(" ", row)
    print("row objects:", len({id(row) for row in grid}))
    if grid != expected:
        print("expected a single corner cell to change")
        raise SystemExit(1)
    print("passed")


if __name__ == "__main__":
    main()
