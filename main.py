import os
import bs4

__author__ = 'ext'
import SoupParser
import sys
# python -c "import bs4 as bs; print(bs.__version__)"

def main():
    file = "cs398.html"
    # file_name, file_ext = os.path.splitext(file)
    # orig_stdout = sys.stdout
    # new_file = file_name + "_parsed" + ".txt"
    # p = open(new_file, 'w')
    # sys.stdout = p
    scrap = SoupParser.parser(file)
    # sys.stdout = orig_stdout
    # p.close()

    # scrap.get_links()
    # scrap.get_course()
    # scrap.get_text("CS 411")
    # scrap.print_data()
    # scrap.print_text()


if __name__ == "__main__":
    main()