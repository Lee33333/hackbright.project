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
    return facebook.authorize(callback=url_for('facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True))


@app.route('/ratings/<name>')
def show_ratings(name):

    # rating = model.session.query(model.Rating).filter(model.Doctor.name == name).first()
    return render_template("name.html", name= name)


@app.route('/login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
    #when would this ever happen?
    if resp is None:
        flash("Facebook authentication error.")
        return redirect('/')

    session['logged_in'] = True
    session['oauth_token'] = (resp['access_token'], '')

    me = facebook.get('/me')

    flash("You are logged in %s." % (me.data['first_name']))

    user = add_new_user()

    session['user'] = user.id

    print session['user']

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
    clear_session()
    flash("Successfully logged out.")
    return redirect('/')

#but this doesn't log you out of facebook, how do you do that?
@app.route('/clearsession')
def clear_session():
    session['logged_in'] = False
    session['oauth_token'] = None
    # session['user'] = None
    return 


if __name__== "__main__":
    app.run(debug = True)