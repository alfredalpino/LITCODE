"""Parse `answer = 2 + 2`, replace each constant 2, then execute.

The replacement value is REPLACE_WITH. Predict the result before running.
Then change REPLACE_WITH, predict again, and run again.
"""

import ast

REPLACE_WITH = 10
SOURCE = "answer = 2 + 2\n"


class ReplaceTwos(ast.NodeTransformer):
    def visit_Constant(self, node):
        if node.value == 2:
            return ast.Constant(value=REPLACE_WITH)
        return node


def main():
    tree = ReplaceTwos().visit(ast.parse(SOURCE))
    ast.fix_missing_locations(tree)
    namespace = {}
    exec(compile(tree, "<rewrite>", "exec"), namespace)
    print("source:     ", SOURCE.strip())
    print("replaced 2 with", REPLACE_WITH)
    print("answer:     ", namespace["answer"])


if __name__ == "__main__":
    main()
