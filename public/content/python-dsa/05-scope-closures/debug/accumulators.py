"""Each button should remember its own n. They do not. Why?"""

def make_buttons():
    buttons = []
    for n in range(3):
        buttons.append(lambda: print("pressed", n))
    return buttons


def main():
    for b in make_buttons():
        b()


if __name__ == "__main__":
    main()
