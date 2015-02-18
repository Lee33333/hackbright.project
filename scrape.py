import requests
from BeautifulSoup import BeautifulSoup


GLMADIR = "https://glmaimpak.networkats.com/members_online_new/members/dir_provider.asp?action=search&address_zip_radius=25&address_state_code=CA&address_city=san+Francisco&location_type=S&pn=4"

def download():
    response = requests.get(GLMADIR)

    soup = BeautifulSoup(response.text)

    print(soup.prettify())

def parse():

    page1 = open("page1.html")
    soup = BeautifulSoup(page1)

    found = soup.findAll("td", {"class" : "top", "colspan" : "2"})
    import pdb; pdb.set_trace()

    return found

def order(found):
    ourlist = []

    for obj in found:
        i = 0
        for child in obj:
            if i == 1:
                # name in <b> tag
                print child.text
            elif i == 4:
                # affiliate
                print child.strip()
            i += 1



#    for 
parsed = parse()

order(parsed)
