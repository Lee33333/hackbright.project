from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import sessionmaker, scoped_session
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship, backref
from geopy.geocoders import Nominatim

#This part connects it to the database? Echo prints sqla calls, autocommit and autoflush will not occur
engine = create_engine("sqlite:///doctors.db", echo=True)
session = scoped_session(sessionmaker(bind=engine, autocommit=False, autoflush=False))

#Base allows you to model your classes, not totally sue what the rest does here
Base = declarative_base()
Base.query = session.query_property()

geolocator = Nominatim()


#Class declarations 


class User(Base):
    __tablename__= "users"

    id = Column(Integer, primary_key=True)
    email = Column(String(64), nullable=False, unique=True)
    password = Column(String(64), nullable=False)
    zipcode = Column(String(15), nullable=True)

    def __repr__(self):
        return "<user id = %r, email = %s>" % (self.id, self.email)

# Do I need to define how big a Float or an Integer is?

class Doctor(Base):
    __tablename__ = 'doctors'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    phone_number = Column(String(25), nullable=False)
    business_name = Column(String (100), nullable=True)
    address = Column(String(250), nullable=True)
    lat = Column(Float(50), nullable=True)
    lon = Column(Float(50), nullable=True)
    specialties = Column(String(200), nullable=True)
    gender = Column(String(15), nullable=True)
    cert = Column(String(50), nullable=True)
    recommended_by = Column(String(50), nullable=False)

    def __repr__(self):
        return "<Doctor name=%s, Doctor id=%d>" % (self.name, self.id)

#What is the best way to structure the review portion or the rating? How big to make it?

class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    rating = Column(Integer, nullable=False)
    review = Column(String(500), nullable=True)

    user = relationship("User",
            backref=backref("ratings", order_by=id))

    doctor = relationship("Doctor",
            backref=backref("ratings", order_by=id))

    def __repr__(self):
        return "<Rating id = %d, doctor id = %d, user_id = %d, Rating = %d>" % (self.id, self.doctor_id, self.user_id, self.rating)


# End class declarations

def addgeo():
    """ Queries all doctors, gets lat/long for their address, adds them to the db entry"""

    all_doctors = session.query(Doctor).all()

    for doctor in all_doctors:
        address = doctor.address
        print address
        location = getgeo(address)
        doctor.lat = location[0]
        doctor.lon = location[1]
        session.add(doctor)

    session.commit()

    return

def getgeo(address):
    """ Return the latitude and longitude in a tuple"""
    location = geolocator.geocode(address, timeout=5)

    return (location.latitude, location.longitude)

def getlonlat():
    """ creates a list of doctors name and their lat/long"""

    all_doctors = session.query(Doctor).all()

    coordinates = {}

    for doctor in all_doctors:
        longitude = doctor.lon
        latitude = doctor.lat
        name = doctor.name
        coordinates[name] = {'lon':longitude, 'lat':latitude}

    
    return coordinates




#Main function because I think we need one here? 
def main():
    pass

if __name__ == "__main__":
    main()