import eel

def main():
    print("Hello world!")
    eel.init("web")
    eel.start("index.html", size=(1280, 720))


if __name__ == "__main__":
    main()
