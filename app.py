# 1. import Flask
from flask import Flask, jsonify
from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.orm import Session
import sqlalchemy
from sqlalchemy import create_engine, inspect, func
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.ext.declarative import declarative_base
Base = declarative_base()

#################################################
# Database Setup
#################################################

connection_string = "postgres:Postgres@localhost:5433/ufo_sightings"
engine = create_engine(f'postgresql://{connection_string}')

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
national_ufo_reporting_ctr = Base.classes.national_ufo_reporting_ctr

#################################################
# Flask Setup
#################################################

app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/sightings")
def getsightings():
    # Create our session (link) from Python to the DB
    session = Session(engine)

    # Query All Records in the Nurc Database
    sightings = session.query(national_ufo_reporting_ctr.datetime).all()

    # for sighting in ufo_sightings:
    #     print(sighting)
    print("Server received request for 'getsightings' api...")
    return jsonify(sightings)


# 4. Define what to do when a user hits the /about route
@app.route("/militaryBases")
def about():
    print("Server received request for 'About' page...")
    return "Welcome to my 'About' page!"


if __name__ == "__main__":
    app.run(debug=True)
