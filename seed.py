import model
import csv


def load_doctors(session):
    ''' Opens csv file and reads it into database '''

    with open('seed_data_simple.csv', 'rb') as user_file:
        reader = unicode_csv_reader(user_file, delimiter=',')

        # prints a row that is too short
        for row in reader:
            if len(row) < 16:
                print "{}".format(row)
                continue

            for i in range(0, 16):
                row[i] = row[i].strip()
                if not row[i]:
                    row[i] = None

            # establishes connection between item and it's place in the db
            doctor = model.Doctor(name=row[0], cert=row[1], business_name=row[2], address=row[3], suite=row[4], phone_number=row[5], recommended_by=row[
                                  6], gender=row[7], lat=row[8], lon=row[9], medical=row[10], therapy=row[11], repro=row[12], trans=row[13], pub_insurance=row[14], specialties=row[15],)
            session.add(doctor)
        session.commit()


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
            yield line  # .decode('utf-8')
        except UnicodeDecodeError, err:
            import pdb
            pdb.set_trace()


def main(session):
    load_doctors(session)

if __name__ == "__main__":

    main(model.session)
