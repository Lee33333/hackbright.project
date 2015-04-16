"""This is the script you should run to set up the database from scratch"""

from model import Base, engine, session, addgeo
from seed import load_doctors

# Re-create the database from scratch with blank tables according to the schema
# defined in model.py
Base.metadata.drop_all(engine)
Base.metadata.create_all(engine)

# Load the seed data from seed_data.csv
load_doctors(session)

# Geocode all of the doctor records so that we have lat/lng coordinates for 'em
addgeo()