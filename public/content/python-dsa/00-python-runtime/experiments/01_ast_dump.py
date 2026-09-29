"""Print the AST for a few snippets.

Predict the shape of each tree before you run this file.
LAB.md section 3 tells you what to predict.
"""

import ast

SNIPPETS = [
    "answer = 1 + 2",
    "n = n + 1",
]


def main():
    for source in SNIPPETS:
        print("=" * 60)
        print(source)
        tree = ast.parse(source)
        print(ast.dump(tree, indent=2))


if __name__ == "__main__":
    main()
