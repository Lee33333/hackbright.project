from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import create_engine, ForeignKey, Column, Integer, String, Float, Unicode
from geopy.geocoders import Nominatim
from geojson import Feature, Point, FeatureCollection
from sqlalchemy.orm import sessionmaker, scoped_session, relationship, backref
import os


# Creates engine,session, echo prints sqla calls, commits are not auto
engine = create_engine(os.environ.get("DATABASE_URL"), echo=True)
session = scoped_session(
    sessionmaker(bind=engine, autocommit=False, autoflush=False))

# Base is a class in sqla that my tables are instantiated from
Base = declarative_base()
Base.query = session.query_property()

# Renaming a function inmported from geopy library
geolocator = Nominatim()

# Class declarations

# The User class


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True)
    facebook_id = Column(String(30), unique=True)
    first_name = Column(String(64))
    email = Column(String(64), nullable=False, unique=True)
    zipcode = Column(String(15), nullable=True)

    def __repr__(self):
        return "<user id = %r, email = %s>" % (self.id, self.email)

# The Doctor class


class Doctor(Base):
    __tablename__ = 'doctors'

    id = Column(Integer, primary_key=True)
    name = Column(Unicode(100), nullable=False)
    cert = Column(Unicode(50), nullable=True)
    business_name = Column(Unicode(100), nullable=True)
    address = Column(Unicode(500), nullable=False)
    suite = Column(Unicode(500), nullable=True)
    phone_number = Column(Unicode(25), nullable=True)
    recommended_by = Column(Unicode(50), nullable=False)
    gender = Column(Unicode(15), nullable=True)
    lat = Column(Float(50), nullable=True)
    lon = Column(Float(50), nullable=True)
    medical = Column(Unicode(5), nullable=True)
    therapy = Column(Unicode(5), nullable=True)
    repro = Column(Unicode(5), nullable=True)
    trans = Column(Unicode(5), nullable=True)
    pub_insurance = Column(String(5), nullable=True)
    specialties = Column(Unicode(500), nullable=True)

    def __repr__(self):
        return "<Doctor name=%s, Doctor id=%d>" % (self.name, self.id)

# The Rating class. User and Doctor have a two way relationship through
# Ratings.


class Rating(Base):
    __tablename__ = "ratings"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    rating = Column(Integer, nullable=False)
    review = Column(String(500), nullable=True)

# User has many ratings, and a rating has one user, rating references user id
    user = relationship("User",
                        backref=backref("ratings", order_by=id))

# Doctor has many ratings and a rating has one doctor, rating references
# doctor id
    doctor = relationship("Doctor",
                          backref=backref("ratings", order_by=id))

    def __repr__(self):
        return "<Rating id = %d, doctor id = %d, user_id = %d, Rating = %d>" % (self.id, self.doctor_id, self.user_id, self.rating)


class Favorites(Base):
    __tablename__ = "favorites"

    id = Column(Integer, primary_key=True)
    doctor_id = Column(Integer, ForeignKey('doctors.id'))
    user_id = Column(Integer, ForeignKey('users.id'))

    user = relationship("User",
                        backref=backref("favorites", order_by=id))

    doctor = relationship("Doctor",
                          backref=backref("favorites", order_by=id))

    def __repr__(self):
        return "<Rating id = %d, doctor id = %d, user_id = %d>" % (self.id, self.doctor_id, self.user_id)

# End class declarations


def addgeo():
    """ Queries all doctors, gets lat/long for their address through getgeo(), adds them to the db entry"""

    all_doctors = session.query(Doctor).all()

    for doctor in all_doctors:
        address = doctor.address
        location = getgeo(str(address))
        doctor.lat = location[0]
        doctor.lon = location[1]
        session.add(doctor)

    session.commit()
    return


def getgeo(address):
    """ Return the latitude and longitude in a tuple"""
    location = geolocator.geocode(address, timeout=5000)

    return (location.latitude, location.longitude)


def getlonlat():
    """ Queries all doctors in db and creates GeoJson about them """

    all_doctors = session.query(Doctor).all()

    coordinates = []

    for doctor in all_doctors:

        longitude = doctor.lon
        latitude = doctor.lat
        name = doctor.name
        address = doctor.address
        idd = doctor.id
        trans = doctor.trans
        medical = doctor.medical
        therapy = doctor.therapy
        cert = doctor.cert

        if doctor.pub_insurance == "yes":
            ins = "yes"
        else:
            ins = "no"

        if doctor.phone_number is None:
            phone = "Not Available"
        else:
            phone = doctor.phone_number

        # Functions from the geojson library create geoson objects with the
        # details specified
        my_feature = Feature(geometry=Point((longitude, latitude)), properties={
                             "title": name, "Address": address, "phone": phone, "idd": idd, "ins": ins, "marker-color": "#D95929", "trans": trans, "therapy": therapy, "medical": medical, "cert": cert})
        coordinates.append(my_feature)

    # We return all this geojson as a feature collection
    new_coords = FeatureCollection(coordinates)
    return new_coords


def main():
    pass


if __name__ == "__main__":
    main()
