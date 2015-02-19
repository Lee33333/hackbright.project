import requests
from BeautifulSoup import BeautifulSoup
import csv

#create a global variable of the page you are scraping

GLMADIR = "https://glmaimpak.networkats.com/members_online_new/members/dir_provider.asp?action=search&address_zip_radius=25&address_state_code=CA&address_city=san+Francisco&location_type=S&pn=4"

#this function gets the text from your url

def download():
    response = requests.get(GLMADIR)

    soup = BeautifulSoup(response.text)

    print(soup.prettify())

# here beautiful soup traverses through the text, identifying the areas you want to select by attribute

def parse():

    page1 = open("page1.html")
    soup = BeautifulSoup(page1)

    #these are teh details of the tag we are searching for

    found = soup.findAll("td", {"class" : "top", "colspan" : "2"})

    # if you want to test your code you can import pdb; pdb.set_trace()

    return found

# this function creates logic to sort the items in what we found

def order(found):
    ourlist = []

    for obj in found:
        i = 0
        for child in obj:
            if i == 1:
                # name in <b> tag
                names=child.text
                ourlist.append(names)

            elif i == 4:
                # affiliate
                print child.strip()
               
            i += 1

    # print ourlist

    # with open("test.csv", "wb") as csvfile:
    #     writer = csv.writer(csvfile, delimeter=" ", quotechar=",")
    #     for row in obj:
    #         writer.writerow(row)
        



#  next we have to output this to a scv using the csv module, in a way that acocunts for divergent formatting

parsed = parse()

order(parsed)
