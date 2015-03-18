<img src="/img/Logo.png">
<h4>Everyone deserves a trustworthy doctor. Find Yours.</h4>

Driven to solve a longstanding problem in my community, I created LGBT MD to connect lesbian, gay, bisexual, and transgender people to trustworthy medical providers. I'm excited to deploy a full, live version and offer this resource to LGBT people in the San Francisco Bay Area.

Discover providers near you by searching by both location and type. Bookmark your favorites and text yourself their contact info. Contribute reviews and new providers to help others find the care they need.

[Screencast Demo of LGBT MD](http://youtu.be/j_h-nyEkpcI)

<h4>Technology Stack</h4>
--------
<b>Application: </b>Python, Flask, Jinja, SQLAlchemy, SQLite, Beautiful Soup <br>

<b>APIs:</b> Twilio API, Facebook OAuth, Mapbox.js, Mapbox GeoCoding API<br>

<b>Front-End:</b> HTML/CSS, Bootstrap, JQuery, JavaScript, AJAX<br><br>

<h4>Why LGBT MD?</h4>
--------
Finding the right doctor can be a challenge. LGBT people face additional obstacles:

<i>33.3% of medical schools dedicate <b>zero</b> hours of their curriculum to LGBT health. On average, medical schools dedicate five hours to LGBT health education, and the quality of this education is widely variable.</i>- Findings from “Lesbian, gay, bisexual, and transgender-related content in undergraduate medical education” Journal of the American Medical Association (2011)

There is no centralized, interactive resource to address this problem in the San Francisco Bay Area. I set out to create it.

<h4>Front Page</h4>
--------
<img src="/img/Front.png"><br><br>
Login through with Facebook to create an account. Search within a customized radius of your home. <br>
<h4>Map</h4>
--------
<img src="/img/map2.png"><br>
Toggle catagories to find providers of mental health services, providers who accept public health insurance, and trans-friendly services. Map created using the MapBox.JS API.

<h4>Interactivity</h4>
--------
<img src="/img/docs.png"><br>
Click on the map for details about your provider. Check out their reviews and add your own. Text yourself a provider's contact information using the Twilio API. Bookmark providers as favorites and add new providers directly to the directory.

<h4>The Story</h4>
--------

I began this project by contacting the Gay and Lesbian Medical Association (GLMA), a non-profit organization of LGBT medical providers. GLMA was excited about my idea and agreed to let me use their data. However, they were unable to provide me with formatted csv files. I used BeautifulSoup and regular expressions to create a scraper to scrape the data I needed from their site. 

On the backend, I am using the Flask web framework. It calls my SQLite database using SQLAlchemy. I used the Python GeoPy library to geocode every provider's address and created GeoJSON objects for each person using the Python GeoJSON library. 

I created a customized map using the MapBox.JS API. My GeoJSON objects are available in the DOM on load, allowing for fast user iteractivity using JavaScript, AJAX, and JQuery. Users are able to search providers by radius and location, toggle by catagory, and inspect detailed information for each provider, including contact information and user reviews.

When logged in through Facebook Oauth, users are able to access additional features such as saving favorites, contributing new doctors to the directory, adding reviews, and texting provider contact info using the Twilio API.

<h4>Thank you to</h4>
--------
- my irreplaceable mentors: Eric, Kyla, and Kate<br>
- my family and my partner, Cam<br>
- my classmates and the teaching team at Hackbright<br>
- the Gay and Lesbian Medical Association


<h4>License</h4>
--------

The MIT License (MIT)

Copyright (c) <year> <copyright holders>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
