import model
import csv

def unicode_csv_reader(unicode_csv_data, dialect=csv.excel, **kwargs):
    # csv.py doesn't do Unicode; encode temporarily as UTF-8:
    csv_reader = csv.reader(utf_8_encoder(unicode_csv_data),
                            dialect=dialect, **kwargs)
    for row in csv_reader:
        # decode UTF-8 back to Unicode, cell by cell:
        # yield [unicode(cell, 'utf-8') for cell in row]
        yield [unicode(cell, 'utf-8') for cell in row]



def utf_8_encoder(unicode_csv_data):
    for line in unicode_csv_data:
    	try:
        	yield line#.decode('utf-8')
        except UnicodeDecodeError, err:
        	import pdb; pdb.set_trace()

def load_doctors(session):
	# use u.user
	with open('seed_data.csv', 'rb') as user_file:
		reader = unicode_csv_reader(user_file, delimiter=',')
		for row in reader:
			if len(row) <10:
				print "{}".format(row)
				continue
			for i in range(0,10):
				row[i]=row[i].strip()
				if row[i] == "NULL":
					row[i]= None

				
			doctor = model.Doctor(name=row[0], cert=row[1],business_name=row[2],address=row[3],phone_number=row[4],
				recommended_by=row[5],gender=row[6],lat=row[7],lon=row[8],specialties=row[9])
			session.add(doctor)
		session.commit()
def main(session):
	# You'll call each of the load_* functions with the session as an argument
	load_doctors(session)

if __name__ == "__main__":
	# s = model.connect()
	
	main(model.session)
