import requests
from BeautifulSoup import BeautifulSoup
import csv

# creates a global variable of the page you are scraping

GLMADIR = "https://glmaimpak.networkats.com/members_online_new/members/dir_provider.asp?action=search&address_zip_radius=25&address_state_code=CA&address_city=san+Francisco&location_type=S&pn=4"

def parse():
    """Gets URL html and selects appropriate areas"""

    response = requests.get(GLMADIR)

    soup = BeautifulSoup(response.text)

    # details of the tag we are searching for

    found = soup.findAll("td", {"class": "top", "colspan": "2"}, )

    return found


def order(found):
    """Sorts selected info and writes it to file"""

    #opens test file to write into
    csvf = open("test.csv", "wb")
    writer = csv.writer(csvf)
    items = [3,5,7,9,11,13,15,17]

    #navigates each object and prints key lines
    for obj in found:
        i = 0
        entry = []

        for child in obj: 

            if i == 1:
                entry.append(child.text)

            if i in items:
                entry.append(child)

            i += 1
        writer.writerow(entry)


parsed = parse()

order(parsed)
