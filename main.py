import bs4

__author__ = 'ext'
import SoupParser
import sys
# python -c "import bs4 as bs; print(bs.__version__)"

def main():
    file = "cs411.html"
    scrap = SoupParser.parser(file)

    # scrap.get_links()
    scrap.get_course()
    # scrap.get_text("CS 411")
    # scrap.print_data()
    # scrap.print_text()


if __name__ == "__main__":
    main()