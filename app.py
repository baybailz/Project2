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

engine = create_engine('sqlite:///Fires.sqlite')
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///fires.sqlite"
db = SQLAlchemy(app)

Base = automap_base()

Base.prepare(db.engine, reflect=True)

session = Session(engine)

Fire = Base.classes.fire

Years = Base.classes.years

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route("/years")
def years():
    """Return a list years."""

    # Use Pandas to perform the sql query
    stmt = db.session.query(Years).statement
    df = pd.read_sql_query(stmt, db.session.bind)
    
    return jsonify(list(df['years']))

@app.route("/metadata/<year>")
def fire_metadata(year):
    
    sel = [
    Fire.Fire_name,
    Fire.Fire_year,
    Fire.Fire_Size,
    Fire.Discovery_DOY]
    
    results1 = db.session.query(*sel).filter(Fire.Fire_year == year).all()
    
    df_year = pd.DataFrame(results1)
    
    fire_metadata = []
    
    fire_metadata.append({
        "Acres_Burned": round(sum(df_year["Fire_Size"]),2),
        "Cumulative_Days_of_Burning": sum(df_year["Discovery_DOY"]),
        "Number_of_Fires": len(df_year)
    }) 
        
    
    return jsonify(fire_metadata)

@app.route("/years/<year>")
def year(year):
    """Return fire name, fire_DOY, and acres damaged."""
    sel = [
    Fire.Fire_name,
    Fire.Fire_year,
    Fire.Fire_Size,
    Fire.Discovery_DOY,
    Fire.Cause_Descr]
    
    results = db.session.query(*sel).filter(Fire.Fire_year == year).all()
    df_yearly = pd.DataFrame(results)

    df_yearly = df_yearly.dropna()

    df_grp_fs = df_yearly.groupby("Cause_Descr").mean()["Fire_Size"]
    df_grp_fs = df_grp_fs.reset_index()

    # print(df_yearly)

    # fire_data = []
    # # Format the data to send as json
    # fire_data.append({
        
    # }) = df_yearly['Fire_name']
    # fire_data["Fire_size"] = df_yearly['Fire_Size']
    # fire_data["Discovery_DOY"] = df_yearly['Discovery_DOY']

    df_yearly_dict = df_grp_fs.to_dict(orient="record")

    return jsonify(df_yearly_dict)

@app.route("/bigfires/<year>")
def bigfires(year):

    big = [
        Fire.Fire_Size,
        Fire.Discovery_DOY,
        Fire.Fire_year,
        Fire.Fire_name
    ]

    big_results = db.session.query(*big).filter(Fire.Fire_year == year).all()

    df_big = pd.DataFrame(big_results)

    df_big = df_big.dropna()

    df_big_sort = df_big.sort_values(by="Fire_Size", ascending = False).head(10)

    df_big_sort = df_big_sort.reset_index()

    df_big_dict = df_big_sort.to_dict(orient="record")

    return jsonify(df_big_dict)


if __name__ == "__main__": 
    app.run()