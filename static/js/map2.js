//GeoJson of all the doctors passed from / route
coordinates = coordinates.obj;

//creates a featureLayer from GeoJson
var pinLayer = L.mapbox.featureLayer(coordinates);

//populates map with featureLayer
pinLayer.addTo(map);

//gets toggle elements from the html
var showIns = document.getElementById('filter-ins');
var showAll = document.getElementById('filter-all');
var showTrans = document.getElementById('filter-trans');
var showTherapy = document.getElementById('filter-therapy');

//establishes initial variables for the search center and radius
var CENTER = L.latLng(37.8, -122.4);
var RADIUS = 20 * 1609.34;

//waits for all DOM elements to load
$(document).ready(function() {
  pinLayer.on('mouseover', function(e) {
    e.layer.openPopup();
  });

    //event listener on "show ins" changes the value of it's class name and calls mapSearch
  showIns.onclick = function(e) {
    showAll.className = '';
    this.className = 'active';
    mapSearch();
    return false;
  };

    //event listener on "show all" changes the value of it's class name and calls mapSearch
  showAll.onclick = function() {
    showIns.className = '';
    this.className = 'active';
    showTrans.className = '';
    showTherapy.className = '';
    mapSearch();
    return false;
  };

  //event listener on "show trans" changes the value of it's class name and calls mapSearch
  showTrans.onclick = function() {
    showAll.className = '';
    this.className = 'active';
    mapSearch();
    return false;
  };

  //event listener on "show therapy" changes the value of it's class name and calls mapSearch
  showTherapy.onclick = function(e) {
    showAll.className = '';
    this.className = 'active';
    mapSearch();
    return false;
  };

    //when submit is clicked, grab value in address field and send to be geocoded
  $("#radiussubmit").click(function(evt) {
      evt.preventDefault();
      getGeocode($("#address").val());
    });

    //when pin is clicked, grab values from its GeoJSON object, show them, and link them to /ratings
  pinLayer.on('click', function(e) {
    map.panTo(e.layer.getLatLng());
    e.layer.openPopup();
    var name = e.layer.feature.properties.title;
    var address = e.layer.feature.properties.Address;
    var phone = e.layer.feature.properties.phone;
    var id = e.layer.feature.properties.idd;
    var cert = e.layer.feature.properties.cert;
    $("#sendtext").html('<form class="form-inline" id="textmess"><h4>Get a text with this doctors information </h4><div class="form-group"><input id="phone" type="text" class="form-control" placeholder="Your phone number" required/></div><button type="submit" id="submitphone" name="reviewsubmit" class="btn btn-default">Text Me</button></form><br></div><button id="faves" name="faves" class="btn btn-primary"><span class="glyphicon glyphicon-star" aria-hidden="true"></span> Add/Remove</button><br><br>');
    $("#basic-info").html('<div class="list-group"><a href="#" class="list-group-item active">'+ name + ' '+ cert +'</a><a href="#" class="list-group-item">'+phone+'</a><a href="#" class="list-group-item">'+address+'</a>');

    var url = "/ratings/" + id;

    //when faves button is clicked, add or delete doctor from favorites modal
    $("#faves").on('click', function(evt) {
      evt.preventDefault();
      //send post requests to the addfave and returnfaves routes
      $.post("/addfave", {"data" : id}, function(result) {
      });
      $.post("/returnfaves", function(result) {
          $("#modal2text").empty();

          //append the results of the returnfaves route to the favorites modal
          for (var key in result.result) {
            if (result.result.hasOwnProperty(key)) {
              $("#modal2text").append('<div class="list-group"><a href="#" class="list-group-item active">'+key+'</a><a href="#" class="list-group-item">'+result.result[key][0]+'</a><a href="#" class="list-group-item">'+result.result[key][1]+'</a><a href="#" class="list-group-item">'+result.result[key][2]+'</a></div>');
            }
          }

        });
    });

    $("#provider-detail").load(url, function() {
      reviewEvent(id);

    });

  });

// grabs, serializes contents of review form and posts it to /addreview route
  function reviewEvent(id) {
    $("#textmess").on('submit', function(evt) {
      evt.preventDefault();
      $("submitphone").attr("disabled", true);
      var phone = $("#phone").val();
      sendInfo(id, phone);
      $("#textmess").hide();     
    });

    //on submit in the review form, prevent default action
    $("#reviewform").on('submit', function(evt) {
      evt.preventDefault();
            //gets contents of submit review form
      var contents = $(this).serializeArray();
            //appends doctor id
      contents.push({"name": "doctor_id", "value": id});
      var url = "/addreview";
            //sends this info in post to the add review route
      $.post(url, contents, function(result) {
        var url2 = "/ratings/" + id;
        //reload the reviews form to update contents, hide the option to add review
        $("#provider-detail").load(url2, function() {
          $("#reviewform").hide();
          });
      });

    });
  }

});

//serialize the contents of the form, add doctor id and phone number, and send them in a post request to the /sendinfo route for twilio api
function sendInfo(id, phone) {
  var url = "/sendinfo";
  var data = $(this).serializeArray();
  data.push({"name": "doctor_id", "value": id});
  data.push({"name": "phone", "value": phone});
  $.post(url, data, function(result) {
    console.log(result[Object][result][1]);

  });

}

//updates the pins displayed on map
function mapSearch() {

    //remove current pinLayer from map
  if (map.hasLayer(pinLayer)) {
    map.removeLayer(pinLayer);
  }

    //add the new pin layer to map
  pinLayer.addTo(map);

    //setFilter takes GeoJSON object, evaluates it, and returns true to show it and false to hide it
  pinLayer.setFilter(function showDrs(feature) {
        //if show insurance class and show trans classes are active, grab center and radius, and show pub insurance and trans pins within radius
    if (showIns.className === 'active' && showTrans.className === 'active' && showTherapy.className === '') {
      return createLatLng(feature) &&
      (feature.properties['ins'] === "yes") &&
      (feature.properties['trans'] === "yes");
      //if show trans class is active, grab center and radius, and show trans pins within radius
    }else if (showIns.className === '' && showTrans.className === 'active' && showTherapy.className === '') {
      return createLatLng(feature) &&
      (feature.properties['trans'] === "yes");
      //if show insurance class is active, grab center and radius, and show pub insurance pins within radius
    }else if (showIns.className === 'active' && showTrans.className === '' && showTherapy.className === '') {
      return createLatLng(feature) &&
      (feature.properties['ins'] === "yes");
    //if show therapy class is active, grab center and radius, and show therapy pins within radius
    }else if (showIns.className === '' && showTrans.className === '' && showTherapy.className === 'active') {
      return createLatLng(feature) &&
      (feature.properties['therapy'] === "yes");
      //if show insurance class and show therapy classes are active, grab center and radius, and show pub insurance and therapy pins within radius
    }else if (showIns.className === 'active' && showTrans.className === '' && showTherapy.className === 'active') {
      return createLatLng(feature) &&
      (feature.properties['therapy'] === "yes")&&
      (feature.properties['ins'] === "yes");
      //if show therapy class and show trans classes are active, grab center and radius, and show therapy and trans pins within radius
    }else if (showIns.className === '' && showTrans.className === 'active' && showTherapy.className === 'active') {
      return createLatLng(feature) &&
      (feature.properties['therapy'] === "yes")&&
      (feature.properties['trans'] === "yes");
      //if all three classes are active, grab center and radius, and show pub insurance, therapy, and trans pins within radius
    }else if (showIns.className === 'active' && showTrans.className === 'active' && showTherapy.className === 'active') {
      return createLatLng(feature) &&
      (feature.properties['therapy'] === "yes")&&
      (feature.properties['trans'] === "yes")&&
      (feature.properties['ins'] === "yes");
    }else {
      return createLatLng(feature);
    }
  });
}

//displays only the pins (geojson objects) that are less than the radius away from the specified center point
function createLatLng(feature) {
  return (CENTER.distanceTo(L.latLng(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0])) < RADIUS);

}

//gets geocoded information for address with MapBox API
function getGeocode(address) {
    //converts address to a url form replacing spaces with +
  address = address.replace(/ /g, "+");
    //the url for the get request
  var mapBoxUrl = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+address+".json?access_token="+L.mapbox.accessToken;
    // send this url with a get request to the mapbox geocoder api
  $.get(mapBoxUrl, function(response) {
        //  get an object back and pull out lat/lon
    var lon = (response.features[0].center[0]);
    var lat = (response.features[0].center[1]);
        // create a latLng object with the coordinates we got
    CENTER = L.latLng(lat, lon);
        //get radius value from form and convert it to miles
    RADIUS = $("#radiustext").val() * 1609.34;
        //call the mapSearch function
    mapSearch();
    //if we fail to get a response we'll print error, should do more here
  }).fail(function(error) {
  console.log('ERROR: ', error);
});

}


