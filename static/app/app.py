import os

import pandas as pd
import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine

from sqlalchemy.engine import reflection

from flask import Flask, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

engine = create_engine('sqlite:///Fires.sqlite', echo=True)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fires.sqlite"
db = SQLAlchemy(app)

Base = automap_base()

Base.prepare(db.engine, reflect=True)

session = Session(engine)

Fire = Base.classes.fire

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/years")
def years():
    """Return a list years."""

    # Use Pandas to perform the sql query
    sel_year = [
    Fire.Fire_year]
    results_year = db.session.query(*sel_year).all()
    df_distinct_year = pd.DataFrame(results_year)
    years = df_distinct_year["Fire_year"].unique()
    print(years)

    return jsonify(years)

@app.route("/metadata/<year>")
def fire_metadata(year):
    
    sel = [
    Fire.Fire_name,
    Fire.Fire_year,
    Fire.Fire_Size,
    Fire.Discovery_DOY]
    
    results = db.session.query(*sel).filter(Fire.Fire_year == year).all()
    
    df_year = pd.DataFrame(results)
    
    fire_metadata = {}
    fire_metadata["Area Burned"] = round(sum(df_year['Fire_Size']),2)
    fire_metadata["Number of Fires"] = len(df_year)

    return jsonify(fire_metadata)

@app.route("/years/<year>")
def year(year):
    """Return fire name, fire_DOY, and acres damaged."""
    sel = [
    Fire.Fire_name,
    Fire.Fire_year,
    Fire.Fire_Size,
    Fire.Discovery_DOY]
    
    results = db.session.query(*sel).filter(Fire.Fire_year == year).all()
    df_yearly = pd.DataFrame(results)


    fire_data = {}
    # Format the data to send as json
    fire_data["Fire Name"] = df_yearly['Fire_name']
    fire_data["Fire_size"] = df_yearly['Fire_Size']
    fire_data["Discovery_DOY"] = df_yearly['Discovery_DOY']

    return jsonify(fire_data)


if __name__ == "__main__": 
    app.run()
