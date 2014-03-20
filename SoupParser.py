import os
import re

__author__ = 'ext'
from bs4 import BeautifulSoup
# import requests
import sys
from itertools import izip
# f = open("/home/ext/cs411/project/cs411.html", 'r').read()


class parser:
    def __init__(self, file):
        f = open(file, 'r')
        # self.r = requests.get(file)
        # self.data = self.r.text
        self.soup = BeautifulSoup(f.read())
        file_name, file_ext = os.path.splitext(file)
        self.print_pretty(file_name, file_ext)
        self.get_course(file_name, file_ext)
        f.close()

    def print_pretty(self, file_name, file_ext):
        """
        pretty prints the html as (name)_pretty.(ext)
        :param file_name: name
        :param file_ext: extention
        """
        orig_stdout = sys.stdout
        new_file = file_name + "_pretty" + file_ext
        f = open(new_file, 'w')
        sys.stdout = f
        print(self.soup.prettify().encode('utf-8'))
        sys.stdout = orig_stdout
        f.close()
        f = open(new_file, 'r')
        self.soup = BeautifulSoup(f.read())
        f.close()

    def get_course(self, file_name, file_ext):
        orig_stdout = sys.stdout
        new_file = file_name + "_parsed" + ".txt"
        f = open(new_file, 'w')
        sys.stdout = f

        root = self.soup.find("div", class_="portlet-content-inner")
        # print root
        # title = root.find_all("p", class_="cis-section-title")
        # print title[0].contents[0].strip()

        # course title, course name, credit hrs, description, same as, prereqs
        try:
            title = root.find_all("p", class_="cis-section-title")
            print title[0].contents[0].strip().encode('utf-8')
            course = root.find_all("p", class_="cis-section-course")
            print course[0].contents[0].strip().encode('utf-8')
            subject_infos = root.find_all("div", id=re.compile("^subject-info"))
            descendants = subject_infos[0].find_all("p", class_="portlet-padtop10")
            credit_hr = descendants[0]
            print credit_hr.contents[1].contents[0].strip().encode('utf-8')
            print credit_hr.contents[2].strip().encode('utf-8')
            descript = descendants[1]
            print descript.contents[0].strip().encode('utf-8')
            # descendants 2 doesnt exist? template is sort of messed up. 373 vs 125 + 473
            # sometimes prereq is build into description
            # cross list is built into description
            prereq = descendants[2]
            print prereq.contents[0].strip().encode('utf-8')
        except:
            pass
            # print "Course Not Found"

        # might not need misc
        # cs 373's 'Students must register for one lecture and one discussion section.'
        try:
            misc = subject_infos[1].find_all("p", class_="portlet-padtop10")
            descendants = subject_infos[1].find_all("p", class_="portlet-padtop10")
            print misc[0].contents[0].strip().encode('utf-8')
        except:
            pass
            # print "Misc Not Found"

        # This course satisfies the General Education Criteria in SPRING 2014 for a
        # UIUC: Quant Reasoning II course
        try:
            extra = subject_infos[1].find_next_sibling("p", class_="portlet-padtop10")
            print extra.contents[1].contents[0].strip().encode('utf-8')
            print extra.contents[1].contents[1].contents[0].strip().encode('utf-8')
            print extra.contents[4].strip().encode('utf-8')
        except:
            pass
            # print "Extra Not Found"

        # the schedule
        try:
            table_struct = subject_infos[1].find_next_sibling("div", class_="portlet-container-flex")
            table = table_struct.find_all("tbody")
            # (table-item[^ ]*) ([^ ]+) (.*)
            # doesnt match on space?
            table_entrys = table[0].find_all("tr", class_=re.compile(r"^table-item$"))
            table_entrys_info = table[0].find_all("tr", class_=re.compile(r"^table-item-detail"))
            assert len(table_entrys) == len(table_entrys_info)
            # print len(table_entrys)
            # print len(table_entrys_info)
            # length of the 2 should be the same
            for entry, info in izip(table_entrys, table_entrys_info):
                icon0 = entry.find_all("td", class_="w50")[0]
                crn = entry.find_all("td", class_="w50")[1]
                print crn.contents[1].contents[0].strip().encode('utf-8')
                type = entry.find_all("td", class_="w80")[0]
                print type.contents[1].contents[0].strip().encode('utf-8')
                section = entry.find_all("td", class_="w55")[0]
                print section.contents[2].strip().encode('utf-8')
                days = entry.find_all("td", class_="w55")[1]
                print days.contents[1].contents[0].strip().encode('utf-8')
                time = entry.find_all("td", class_="w75")[0]
                print time.contents[1].contents[0].strip().encode('utf-8')
                location = entry.find_all("td", class_="w120")[0]
                print location.contents[1].contents[0].strip().encode('utf-8')
        except:
            pass
            # print "Course Details Not Found"

        sys.stdout = orig_stdout
        f.close()

            # def get_links(self):
            #     orig_stdout = sys.stdout
            #     f = open('links.txt', 'w')
            #     sys.stdout = f
            #     for link in self.soup.find_all('a'):
            #         print(link.get('href'))
            #     sys.stdout = orig_stdout
            #     f.close()

            # def get_text(self, find):
            #     orig_stdout = sys.stdout
            #     f = open('text_find.txt', 'w')
            #     sys.stdout = f
            #     print self.soup.find_all(text=find)
            #     sys.stdout = orig_stdout
            #     f.close()

            # def print_data(self):
            #     orig_stdout = sys.stdout
            #     f = open('data.txt', 'w')
            #     sys.stdout = f
            #     print self.data
            #     sys.stdout = orig_stdout
            #     f.close()

            # def print_text(self):
            #     orig_stdout = sys.stdout
            #     f = open('text.txt', 'w')
            #     sys.stdout = f
            #     print self.soup.get_text().encode('utf-8')
            #     sys.stdout = orig_stdout
            #     f.close()
            # <p class="cis-section-title">CS 411</p>