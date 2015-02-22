import model
import csv

def load_doctors(session):
    # use u.user
    with open('seed_data.csv', 'rb') as user_file:
        reader = csv.reader(user_file, delimiter=',')
        for row in reader:
            doctor = model.Doctor(name=row[0], cert=row[1],business_name=row[2],address=row[3],phone_number=row[4],recommended_by=row[5],gender=row[6],lat=row[7],lon=row[8],specialties=row[9])
            session.add(doctor)
        session.commit()

def main(session):
    # You'll call each of the load_* functions with the session as an argument
    load_doctors(session)

if __name__ == "__main__":
    s = model.add("doctors.db")
    main(s)
