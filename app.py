from flask import Flask, render_template
from pymongo import MongoClient
from bson.json_util import dumps
 
app = Flask(__name__)

client = MongoClient() #connecting to the database server via MongoClient library
db = client.mcdonalds #building "mcds" database
menu_conn = db.menu 

@app.route("/")
def home():

    return render_template("index.html")

@app.route("/api")
def api():

    return "welcome to the API, the available routes are \n/api/menu"
    

@app.route("/api/menu")
def apimenu():

    poop = list(menu_conn.find())
    return dumps(poop)

if __name__ == "__main__":
    app.run()





  
