__author__ = 'hcao7'
import re
from bs4 import BeautifulSoup
import requests
import sys
from itertools import izip


# noinspection PyBroadException
class Parser:
    def __init__(self, src, type, des):
        if type == 0:
            f = open(src, 'r')
            self.soup = BeautifulSoup(f.read())
            f.close()
        elif type == 1:
            r = requests.get(src)
            data = r.text
            self.soup = BeautifulSoup(data)
        else:
            print "type has to be a .html file or a URL"

        self.print_pretty(des)
        self.get_course(des)

    def print_pretty(self, file_name):
        """
        pretty prints the html as (name)_pretty.html
        :param file_name: name
        """
        orig_stdout = sys.stdout
        new_file = file_name + "_pretty.html"
        f = open(new_file, 'w')
        sys.stdout = f
        print(self.soup.prettify().encode('utf-8'))
        sys.stdout = orig_stdout
        f.close()
        f = open(new_file, 'r')
        self.soup = BeautifulSoup(f.read())
        f.close()

    def get_course(self, file_name):
        """
        prases the html and save to file as (name)_parsed.txt
        :param file_name: name
        """
        orig_stdout = sys.stdout
        new_file = file_name + "_parsed.txt"
        f = open(new_file, 'w')
        sys.stdout = f

        root = self.soup.find("div", class_="portlet-content-inner")
        # print root

        # course title, course name, credit hrs, description, same as, prereqs
        try:
            # course title
            title = root.find("p", class_="cis-section-title")
            print title.get_text(strip=True).encode('utf-8')
            # print title[0].contents[0].strip().encode('utf-8')

            # course name
            course = root.find("p", class_="cis-section-course")
            print course.get_text(strip=True).encode('utf-8')
            # print course[0].contents[0].strip().encode('utf-8')

            # hours, description, prereqs, same as,
            subject_infos = root.find_all("div", id=re.compile("^subject-info"))
            descendants = subject_infos[0].find_all("p", class_="portlet-padtop10")
            credit_hr = descendants[0]
            print credit_hr.get_text(strip=True).encode('utf-8')
            # print credit_hr.contents[1].contents[0].strip().encode('utf-8')
            # print credit_hr.contents[2].strip().encode('utf-8')
            description = descendants[1]
            print description.get_text(strip=True).encode('utf-8')
            # print descript.contents[0].strip().encode('utf-8')

            # descendants 2 doesnt exist? template is sort of messed up. 373 vs 125 + 473
            # sometimes prereq is build into description
            # cross list is built into description
            prereq = descendants[2]
            print prereq.get_text(strip=True).encode('utf-8')
            # print prereq.contents[0].strip().encode('utf-8')
        except:
            pass
            # print "Course Not Found"

        # might not need misc
        # cs 373's 'Students must register for one lecture and one discussion section.'
        try:
            misc = subject_infos[0].find_all("p", class_="portlet-padtop10")
            print misc.get_text(strip=True).encode('utf-8')
            # print misc[0].contents[0].strip().encode('utf-8')
        except:
            pass
            # print "Misc Not Found"

        # This course satisfies the General Education Criteria in SPRING 2014 for a
        # UIUC: Quant Reasoning II course
        try:
            extra = subject_infos[0].find_next_sibling("p", class_="portlet-padtop10")
            print extra.get_text(" ", strip=True).encode('utf-8')
            # print extra.contents[1].contents[0].strip().encode('utf-8')
            # print extra.contents[1].contents[1].contents[0].strip().encode('utf-8')
            # print extra.contents[4].strip().encode('utf-8')
        except:
            pass
            # print "Extra Not Found"

        # the schedule
        # only crn is guaranteed to be single
        try:
            table_struct = subject_infos[0].find_next_sibling("div", class_="portlet-container-flex")
            table = table_struct.find("tbody")
            # (table-item[^ ]*) ([^ ]+) (.*)
            # doesnt match on space?
            table_entry = table.find_all("tr", class_=re.compile(r"^table-item$"))
            table_entry_info = table.find_all("tr", class_=re.compile(r"^table-item-detail"))
            assert len(table_entry) == len(table_entry_info)
            # length of the 2 should be the same
            # begin deciphering
            for entry, info in izip(table_entry, table_entry_info):
                w50 = entry.find_all("td", class_="w50")
                w80 = entry.find_all("td", class_="w80")
                w55 = entry.find_all("td", class_="w55")
                w75 = entry.find_all("td", class_="w75")
                w120 = entry.find_all("td", class_="w120")
                ie_table_width = entry.find_all("td", class_=re.compile(r"ie-table-width"))

                icon0 = w50[0]
                crn = w50[1]
                print "CRN: " + crn.get_text(strip=True).encode('utf-8')
                # print "CRN: " + crn.contents[1].contents[0].strip().encode('utf-8')

                types = w80[0]
                section = w55[0]
                time = w75[0]
                days = w55[1]
                location = w120[0]
                instructors = ie_table_width[0]

                # print "Type: " + types.get_text("\n", strip=True).encode('utf-8')
                # print "Section: " + section.get_text("\n", strip=True).encode('utf-8')
                # print "Time: " + time.get_text("\n", strip=True).encode('utf-8')
                # print "Day: " + days.get_text("\n", strip=True).encode('utf-8')
                # print "Location: " + location.get_text("\n", strip=True).encode('utf-8')
                # print "Instructor: " + instructors.get_text("\n", strip=True).encode('utf-8')

                # takes care of paired classes like cs398
                # types, sections, times, days, locations, teachers
                try:
                    for blocks in xrange(len(types)):
                        if blocks % 2 == 0:
                            print "Type: " + types.contents[blocks+1].contents[0].strip().encode('utf-8')
                            print "Section: " + section.contents[blocks+2].strip().encode('utf-8')
                            print "Time: " + time.contents[blocks+1].contents[0].strip().encode('utf-8')
                            print "Day: " + days.contents[blocks+1].contents[0].strip().encode('utf-8')
                            print "Location: " + location.contents[blocks+1].contents[0].strip().encode('utf-8')
                            # takes care of multiple teachers per row
                            for n in xrange(len(instructors.contents[blocks+1].contents)):
                                if n % 2 == 0:
                                    try:
                                        # ignore blank lines
                                        if instructors.contents[1].contents[n].strip() != "":
                                            print "Instructor: " + instructors.contents[1].contents[n].strip().encode('utf-8')
                                    except:
                                        pass
                except:
                    pass

                # details always comes in pairs
                # Availability: Open
                # Section Title: Computer Architecture
                # Part of Term: 1
                # Section Info: Lab sections meets in 0218 Siebel Center
                details_list = info.find_all("div", class_="yui3-g")
                for details in details_list:
                    print details.get_text(" ", strip=True).encode('utf-8')
                    # print details.contents[1].contents[0].strip().encode('utf-8')
                    # print details.contents[3].contents[0].strip().encode('utf-8')
            # deciphering ends here
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