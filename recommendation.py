from flask import Flask, render_template, redirect, request, session, flash, url_for
import model
from flask_oauth import OAuth
import os

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

print consumer_keys
print consumer_secrets

app = Flask(__name__)
app.secret_key = '\xf5!\x07!qj\xa4\x08\xc6\xf8\n\x8a\x95m\xe2\x04g\xbb\x98|U\xa2f\x03'

@app.route("/")
def index():


    coordinates = model.getlonlat()
    
    return render_template("input.html", coordinates = coordinates, consumer_secrets = consumer_secrets)

@app.route('/login')
def login():
    return facebook.authorize(callback=url_for('facebook_authorized',
        next=request.args.get('next') or request.referrer or None,
        _external=True))


@app.route('/login/authorized')
@facebook.authorized_handler
def facebook_authorized(resp):
    if resp is None:
        return 'Access denied: reason=%s error=%s' % (
            request.args['error_reason'],
            request.args['error_description']
        )
    session['oauth_token'] = (resp['access_token'], '')
    me = facebook.get('/me')
    return 'Logged in as id=%s name=%s redirect=%s' % \
        (me.data['id'], me.data['name'], request.args.get('next'))


@facebook.tokengetter
def get_facebook_oauth_token():
    return session.get('oauth_token')



if __name__== "__main__":
    app.run(debug = True)