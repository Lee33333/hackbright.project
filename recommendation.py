from flask import Flask, render_template, redirect, request, session, flash, url_for, jsonify
import model
from flask_oauth import OAuth
import os
from sqlalchemy import and_
import twilio.twiml
import twilioapi


oauth = OAuth()
app = Flask(__name__)

# PORT=int(os.environ.get("PORT" ,5000))

# app.run(debug=True,host="127.0.0.1" ,port=PORT)

# Retrieve secret keys from secrets file
consumer_keys = os.environ.get("app_id")
consumer_secrets = os.environ.get("app_secret")
app.secret_key = os.environ.get("app_secret_key")

# Connect with facebook oauth using the secret keys
facebook = oauth.remote_app('facebook',
                            base_url='https://graph.facebook.com/',
                            request_token_url=None,
                            access_token_url='/oauth/access_token',
                            authorize_url='https://www.facebook.com/dialog/oauth',
                            consumer_key=consumer_keys,
                            consumer_secret=consumer_secrets,
                            request_token_params={'scope': 'email'}
                            )


@app.route("/")
def index():
    ''' generates geojson data from the db and passes keys to facebook Oauth '''

    coordinates = model.getlonlat()

    return render_template("input.html", coordinates=coordinates, consumer_secrets=consumer_secrets)


@app.route('/login')
def login():
    ''' connects to facebook Oauth with our secret keys'''

    print "in login!!!"
    return facebook.authorize(callback=url_for('facebook_authorized',
                                               next=request.args.get(
                                                   'next') or request.referrer or None,
                                               _external=True))


@app.route('/login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
    '''Processed facebook oauth response, gets "me" object from facebook, adds to user to session, '''

    print "in authorized"

    #error handling
    if resp is None:
        flash("Facebook authentication error.")
        print "no data!"
        return redirect('/')

    #adds information about our user to the session
    session['logged_in'] = True
    session['oauth_token'] = (resp['access_token'], '')
    me = facebook.get('/me')
    #calls function to create or retrieve user object, adds additional info to the session
    user = add_new_user()
    session['user'] = user.id
    session['user_name'] = me.data['first_name']
    session['favorites'] = [""]

    return redirect('/')


def add_new_user():
    """ Uses FB id to check for exisiting user in db. If none, adds new user."""

    # names facebook me object as fb_user
    fb_user = facebook.get('/me').data

    # queries database comparing user id with the ids in users table
    existing_user = model.session.query(model.User).filter(
        model.User.facebook_id == fb_user['id']).first()

    # if user not present, instantiates new user object
    if existing_user is None:
        new_user = model.User()
        new_user.facebook_id = fb_user['id']
        new_user.first_name = fb_user['first_name']
        new_user.email = fb_user['email']
        new_user.faves = None

        # commit new user to database
        model.session.add(new_user)
        model.session.commit()

        # Go get that new user
        new_user = model.session.query(model.User).filter(
            model.User.facebook_id == fb_user['id']).first()
        return new_user

    #work with queried user
    else:
        return existing_user


@facebook.tokengetter
def get_facebook_oauth_token():

    return session.get('oauth_token')


@app.route("/logout")
def logout():
    '''Clears out the session'''
    session.clear()
    flash("Successfully logged out.")
    return redirect('/')


@app.route('/addreview', methods=["POST"])
def add_review():
    '''Recieves data @ new review through post, adds to db'''

    #create new rating object
    new_rating = model.Rating()

    review = request.form.get("review")
    rating = request.form.get("rating")
    doctor_id = request.form.get("doctor_id")

    #add attributes to new object
    new_rating.doctor_id = doctor_id
    new_rating.user_id = session['user']
    new_rating.review = review
    new_rating.rating = rating

    # commit new rating to database
    model.session.add(new_rating)
    model.session.commit()

    return redirect("/")


@app.route('/todocform')
def todocform():
    '''Routes to add doctor form.'''

    coordinates = model.getlonlat()

    return render_template("add_doc.html", coordinates=coordinates,)


@app.route('/adddoc', methods=["POST"])
def add_doc():
    '''Recieves post data @ new dr submission and adds to db '''

    doc_name = request.form.get("doc_name")
    address = request.form.get("address")
    latlon = model.getgeo(address)
    lat = latlon[0]

    # First we check to see if dr name AND address match already exists
    this_doc = model.session.query(model.Doctor).filter(
        and_(model.Doctor.name == doc_name, model.Doctor.lat == lat)).first()

    # If name and address match doesn't already exist, we add it
    if this_doc == None:

        cert = request.form.get("cert")
        biz_name = request.form.get("biz_name")
        suite = request.form.get("suite")
        phone = request.form.get("phone2")
        anon = request.form.get("anon")
        gender = request.form.get("gender")
        trans_health = request.form.get("trans")
        repro_health = request.form.get("repro")
        pub_ins = request.form.get("pub_ins")

        # We have to geocode the address
        coords = model.getgeo(address)

        new_doc = model.Doctor()

        new_doc.name = doc_name
        new_doc.cert = cert
        new_doc.business_name = biz_name
        new_doc.address = address
        new_doc.suite = suite
        new_doc.phone_number = phone
        new_doc.gender = gender
        new_doc.pub_insurance = pub_ins
        new_doc.lat = coords[0]
        new_doc.lon = coords[1]

        # processes anonymous entries
        if anon == "yes":
            new_doc.recommended_by = "Anonymous"
        if anon == "no":
            new_doc.recommended_by = session['user_name']

        # processes specialties
        new_doc.specialties = ""

        if trans_health == "yes":
            new_doc.specialties = "Transgender Health " + new_doc.specialties
            new_doc.trans = "yes"
        if repro_health == "yes":
            new_doc.specialties = "Reproductive Health " + new_doc.specialties
            new_doc.repro = "yes"

        # adds and commits to database
        model.session.add(new_doc)
        model.session.commit()

        flash("Doctor submitted!")

        return redirect("/")

    #communicates to user that we have found a matching entry
    else:

        flash("Doctor already exists!")
        print "exists!"

        return redirect("/")


@app.route('/ratings/<idd>')
def show_ratings(idd):
    '''Generates reviews, rating average to display on page'''

    # gets doctor by unique id
    this_doc = model.session.query(model.Doctor).filter(
        model.Doctor.id == idd).one()

    # gets the ratings objects attached to this doctor object
    all_ratings = this_doc.ratings

    # generates rating average and creates a list of reviews
    if all_ratings != []:

        total = 0
        i = 0
        all_reviews = []

        for item in all_ratings:
            total = int(item.rating) + total
            i = i + 1
            all_reviews.append(item.review)

        avg_rating = float(total) / i

        rating = avg_rating
        review = all_reviews

        return render_template("name.html", rating=rating, review=review, idd=idd)

    else:
        rating = "There are no ratings yet!"
        no_review = "There are no reviews yet!"
        return render_template("name.html", rating=rating, no_review=no_review, idd=idd)


# @app.route("/twil", methods=['GET', 'POST'])
# def hello_monkey():
#     """Respond to incoming calls with a simple text message."""

#     resp = twilio.twiml.Response()
#     resp.message("Hello, Mobile Monkey")
#     return str(resp)


@app.route("/sendinfo", methods=['POST'])
def sendinfo():
    """Sends data to twilio function"""

    #get info sent from the page form
    phone = request.form.get("phone")
    idd = request.form.get("doctor_id")

    #query to see which drs info we need to text
    this_doc = model.session.query(model.Doctor).filter(
        model.Doctor.id == idd).one()

    #get the info we need to construct the text message and format it
    doc_name = this_doc.name
    doc_address = this_doc.address
    doc_phone = this_doc.phone_number
    doc_cert = this_doc.cert

    data = " " + doc_name + " " + doc_cert + \
        " " + doc_phone + " " + doc_address

    # send the dr, message, and phone,
    # then check to see if it returns true or false
    if twilioapi.send_message(phone, data) == True:

        return "something else"

    return "something"


@app.route("/addfave", methods=['POST'])
def addfave():
    """Adds favorite doctor"""

    favorite = request.form.get("data")
    user_id = session['user']

    #check if a favorite match for this dr and suer already exists
    this_favorite = model.session.query(model.Favorites).filter(and_(
        model.Favorites.user_id == user_id, model.Favorites.doctor_id == favorite)).first()

    #if no match exists, and new favorite
    if this_favorite == None:

        new_favorite = model.Favorites()

        new_favorite.user_id = user_id
        new_favorite.doctor_id = favorite

        model.session.add(new_favorite)
        model.session.commit()

    #if match does exist, remove dr from favorites
    else:

        model.session.delete(this_favorite)
        model.session.commit()

    return "yes"


@app.route("/returnfaves", methods=['Post'])
def getfaces():
    """Retrieves favorite doctors"""

    user_id = session['user']

    #get all the favorite objects assosciated with this user
    all_faves = model.session.query(model.Favorites).filter(
        model.Favorites.user_id == user_id).all()

    fave_docs = {}

    #fetch the data we need to display off the object, and add it to the dictionary with the key being the name of the dr
    for item in all_faves:
        name = item.doctor.name
        if item.doctor.phone_number is None:
            phone = "Not Available"
        else:
            phone = item.doctor.phone_number
        address = item.doctor.address
        cert = item.doctor.cert
        fave_docs[name] = [cert, phone, address]

        #jsonify the dictionary
    return jsonify(result=fave_docs)


if __name__ == "__main__":
    app.run(debug=True)
