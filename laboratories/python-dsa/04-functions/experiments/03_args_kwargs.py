"""*args packs extras; **kwargs packs named extras."""

def show(a, b, *args, **kwargs):
    print("a,b:", a, b)
    print("args:", args)
    print("kwargs:", kwargs)


def main():
    show(1, 2, 3, 4, x=5, y=6)


if __name__ == "__main__":
    main()
