
# Dependencies
import pandas as pd
import numpy as np
import os
import psycopg2

# 1. import Flask
from flask import Flask, jsonify
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
import sqlalchemy
from sqlalchemy import create_engine, inspect, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

import datetime as dt
from scipy import stats

#################################################
# Database Setup
#################################################

connection_string = "postgres:Postgres@localhost:5433/ufo_sightings"
engine = create_engine(f'postgresql://{connection_string}')

# Create the inspector and connect it to the engine
inspector = inspect(engine)

# Using the inspector to print the column names within the 'Salaries' table and its types
columns = inspector.get_columns('national_ufo_reporting_ctr')
for column in columns:
    print(column["name"], column["type"])

# Reflect Database into ORM classes
Base = automap_base()
Base.prepare(engine, reflect=True)
Base.classes.keys()

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to each table
nuforc_reports = Base.classes.nuforc_reports
military_bases = Base.classes.military_bases
nat_ufo_rep_ctr = Base.classes.national_ufo_reporting_ctr

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return (
        f"Welcome to the UFO Sightings vs US Military Bases APIs!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/sightings"
    )

@app.route("/api/v1.0/sightings")
def getsightings():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query All Records in the national_ufo_reporting_ctr Database
    from_date = "04/01/2020"

    to_date = "04/30/2020"

    sightings = session.query(nat_ufo_rep_ctr.datetime, nat_ufo_rep_ctr.city, nat_ufo_rep_ctr.state, nat_ufo_rep_ctr.shape, nat_ufo_rep_ctr.duration, nat_ufo_rep_ctr.summary).all()
        # .filter(nat_ufo_rep_ctr.datetime.between(f"{from_date}", f"{to_date}")).order_by(nat_ufo_rep_ctr.datetime).all()
    
    for sighting in sightings:
        print(sighting)
        print(f"Date: {sighting.datetime}, State: {sighting.state}")

    print("Server received request for 'getsightings' api...")
    return jsonify(sightings)

# @app.route("/api/v1.0/nuforcReports")
# def getsightings():
#     # Create our session (link) from Python to the DB
#     session = Session(engine)

#     # Query All Records in the Nurc Database
#     sightings = session.query(nuforc_reports.datetime, nat_ufo_rep_ctr.city, nat_ufo_rep_ctr.state, nat_ufo_rep_ctr.shape, nat_ufo_rep_ctr.duration, nat_ufo_rep_ctr.summary).all()

#     for sighting in sightings:
#         print(sighting)
#         print(f"Date: {sighting.datetime}, State: {sighting.state}")

#     print("Server received request for 'getsightings' api...")
#     return jsonify(sightings)


# 4. Define what to do when a user hits the /about route
@app.route("/militaryBases")
def about():
    print("Server received request for 'About' page...")
    return "Welcome to my 'About' page!"


if __name__ == "__main__":
    app.run(debug=True)
