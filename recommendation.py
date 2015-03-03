from flask import Flask, render_template, redirect, request, session, flash, url_for
import model
from flask_oauth import OAuth
import os

#This section is necessary to connect with facebook
oauth = OAuth()

consumer_keys = os.environ.get("app_id")
consumer_secrets = os.environ.get("app_secret")

facebook = oauth.remote_app('facebook',
    base_url='https://graph.facebook.com/',
    request_token_url=None,
    access_token_url='/oauth/access_token',
    authorize_url='https://www.facebook.com/dialog/oauth',
    consumer_key=consumer_keys,
    consumer_secret=consumer_secrets,
    request_token_params={'scope': 'email'}
)

app = Flask(__name__)
app.secret_key = '\xf5!\x07!qj\xa4\x08\xc6\xf8\n\x8a\x95m\xe2\x04g\xbb\x98|U\xa2f\x03'

#This route maps doctors
@app.route("/")
def index():

    coordinates = model.getlonlat()
    
    return render_template("input.html", coordinates = coordinates, consumer_secrets = consumer_secrets)


#Takes you to the facebook authentication page, send you and response on to next route
@app.route('/login')
def login():
    print "in login!!!"
    return facebook.authorize(callback=url_for('facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True))
    

#how do you get it to print the doctors name?
@app.route('/ratings/<idd>')
def show_ratings(idd):

    this_doc = model.session.query(model.Doctor).filter(model.Doctor.id == idd).one()
    all_ratings = this_doc.ratings
    print all_ratings

    if all_ratings != []:

        total = 0
        i = 0
        all_reviews = []

        for item in all_ratings:
            total = int(item.rating) + total
            i = i + 1
            all_reviews.append(item.review)

        avg_rating = float(total)/i

        rating = avg_rating
        review = all_reviews
    
        return render_template("name.html", rating=rating, review=review, idd=idd)

    else:
        rating = "There are no ratings yet!"
        no_review = "There are no reviews yet!"
        return render_template("name.html",rating=rating, no_review=no_review, idd=idd)


@app.route('/login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
    print "in authorized"
    #when would this ever happen?
    if resp is None:
        flash("Facebook authentication error.")
        print "no data!"
        return redirect('/')

    session['logged_in'] = True
    session['oauth_token'] = (resp['access_token'], '')
    me = facebook.get('/me')
    user = add_new_user()
    session['user'] = user.id
    session['user_name'] = me.data['first_name']

    flash("You are logged in %s." % (me.data['first_name']))

    return redirect('/')

def add_new_user():
    """ Uses FB id to check for exisiting user in db. If none, adds new user."""

    #names facebook me object as fb_user
    fb_user = facebook.get('/me').data

    #queries database comparing user id with the ids in users table
    existing_user = model.session.query(model.User).filter(model.User.facebook_id == fb_user['id']).first()

    if existing_user is None:
        new_user = model.User()
        new_user.facebook_id = fb_user['id']
        new_user.first_name = fb_user['first_name']
        new_user.email = fb_user['email']

        # commit new user to database
        model.session.add(new_user)
        model.session.commit()
        # Go get that new user
        new_user = model.session.query(model.User).filter(model.User.facebook_id == fb_user['id']).first()
        return new_user
    
    else:
        return existing_user

@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')

@app.route("/logout")
def logout():
    session.clear()
    flash("Successfully logged out.")
    return redirect('/')

#but this doesn't log you out of facebook, how do you do that?
# @app.route('/clearsession')
# def clear_session():

    # session['logged_in'] = False
    # session['oauth_token'] = None
    # session['user'] = None
    # return 

@app.route('/addreview', methods=["POST"])
def add_review():
    new_rating = model.Rating()

    review = request.form.get("review")
    rating = request.form.get("rating")
    doctor_id = request.form.get("doctor_id")

    new_rating.doctor_id = doctor_id
    new_rating.user_id = session['user']
    new_rating.review = review
    new_rating.rating = rating


    # commit new user to database
    model.session.add(new_rating)
    model.session.commit()

    #flash not working!
    flash("Rating submitted!")
    return redirect("/")

@app.route('/todocform')
def todocform():

    return render_template("add_doc.html")

@app.route('/adddoc', methods=["POST"])
def add_doc():
    new_doc = model.Doctor()

    doc_name = request.form.get("doc_name")
    cert = request.form.get("cert")
    biz_name = request.form.get("biz_name")
    address = request.form.get("address")
    suite = request.form.get("suite")
    phone = request.form.get("phone")
    anon = request.form.get("anon")
    gender = request.form.get("gender")
    trans_health = request.form.get("trans_health")
    womens_health = request.form.get("womens_health")
    pub_ins= request.form.get("pub_ins")

    new_doc.name = doc_name
    new_doc.cert = cert
    new_doc.business_name = biz_name
    new_doc.address = address
    new_doc.suite = suite
    new_doc.phone_number = phone
    new_doc.gender = gender
    new_doc.pub_insurance = pub_ins
    new_doc.lon = -122.464824
    new_doc.lat = 37.785972

    if anon == "yes":
        new_doc.recommended_by = "Anonymous"
    if anon == "no":
        new_doc.recommended_by = session['user_name']

    new_doc.specialties = ""

    if trans_health == "yes":
        new_doc.specialties = "Transgender Health " + new_doc.specialties
    if womens_health == "yes":
        new_doc.specialties = "Women's Health " + new_doc.specialties


    ##FIGURE OUT SPECIALTIES!!

    print new_doc.name
    print new_doc.cert
    print new_doc.business_name
    print new_doc.address
    print new_doc.suite
    print new_doc.phone_number
    print new_doc.gender
    print new_doc.pub_insurance
    print new_doc.recommended_by
    print new_doc.specialties

    model.session.add(new_doc)
    model.session.commit()

    #flash not working!
    flash("Doctor submitted!")
    return redirect("/")


if __name__== "__main__":
    app.run(debug = True)