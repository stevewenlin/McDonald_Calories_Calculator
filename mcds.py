#mcds.py transforms Kaggle mcdonalds csv into MongoDB
import csv
import json
import pandas as pd
from pymongo import MongoClient

def mcd(): 
    client = MongoClient() #connecting to the database server via MongoClient library
    db = client.mcdonalds #building "mcdonalds" database
    collection = db.menu 
    collection.drop() #get rid of everything currently collection 
    df = pd.read_csv("mcdonalds.csv")
    records = json.loads(df.T.to_json()).values()
    collection.insert(records)
    
mcd()
    


