import twilio
from twilio.rest import TwilioRestClient
import os

consumer_key = os.environ.get("ACCOUNT_SID")
consumer_token = os.environ.get("AUTH_TOKEN")

account_sid = consumer_key
auth_token = consumer_token
client = TwilioRestClient(account_sid, auth_token)

message = client.messages.create(to="+15104157519", from_="+14159916333",
                                     body="Hello there!")