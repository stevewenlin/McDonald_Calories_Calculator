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

@app.route("/inspiration") 
def inspiration():

    return render_template("inspiration.html")
    

@app.route("/menu") #mcd.js retrieves data from /menu api 
def apimenu():

    mcd_menu = list(menu_conn.find())
    return dumps(mcd_menu)

if __name__ == "__main__":
    app.run(debug=True)





  
