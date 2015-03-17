import requests
from BeautifulSoup import BeautifulSoup
import csv

# create a global variable of the page you are scraping

GLMADIR = "https://glmaimpak.networkats.com/members_online_new/members/dir_provider.asp?action=search&address_zip_radius=25&address_state_code=CA&address_city=san+Francisco&location_type=S&pn=4"

def parse():
    """Gets URL html and selects appropriate areas"""

    response = requests.get(GLMADIR)

    soup = BeautifulSoup(response.text)

    # these are teh details of the tag we are searching for

    found = soup.findAll("td", {"class": "top", "colspan": "2"}, )

    # if you want to test your code you can import pdb; pdb.set_trace()

    return found


def order(found):
    """Sorts selected info and writes it to file"""

    csvf = open("test.csv", "wb")
    writer = csv.writer(csvf)

    for obj in found:
        i = 0

        for child in obj:

            # text= str(child.text)
            # print text

            if i == 1:

                text = child.text
                print text

            #     # name in <b> tag
                writer.writerow([child.text])
            #     print child.text

            # if i == 4:
            #     if child[14].isnumeric() == False:
            #         print child.strip()

    #         #     else:
    #         #         print child.strip()

    #         # if i == 6 AND child[14].isnumeric() == False:
    #         #     print child.strip()

            i += 1


parsed = parse()

order(parsed)
