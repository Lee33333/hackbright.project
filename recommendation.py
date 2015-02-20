from flask import Flask, render_template, redirect, request, session, flash
import model
import json

app = Flask(__name__)
app.secret_key = '\xf5!\x07!qj\xa4\x08\xc6\xf8\n\x8a\x95m\xe2\x04g\xbb\x98|U\xa2f\x03'

@app.route("/")
def index():

    coordinates = model.getlonlat()
    
    return render_template("input.html", coordinates = coordinates)

# @app.route("/sub", methods=["POST"])
# def showradius():
#     radius = request.form.get("radius")

#     return render_template("base.html", radius = radius)

if __name__== "__main__":
    app.run(debug = True)