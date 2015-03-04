coordinates = coordinates.obj;
var points = coordinates;
var pinLayer = L.mapbox.featureLayer(points);

pinLayer.addTo(map);


var filters = document.getElementById('filters');

// Wait until the marker layer is loaded in order to build a list of possible
// types. If you are doing this with another featureLayer, you should change
// map.featureLayer to the variable you have assigned to your featureLayer.
pinLayer.once('layeradd', function() {
  // Collect the types of symbols in this layer. you can also just
  // hardcode an array of types if you know what you want to filter on,
  // like var types = ['foo', 'bar'];
  console.log("Hello!");
  var typesObj = {}, types = [];
  var features = pinLayer.getGeoJSON().features;
  for (var i = 0; i < features.length; i++) {
    typesObj[features[i].properties['ins']] = true;
  }

  for (var k in typesObj) types.push(k);

  var checkboxes = [];
  // Create a filter interface.
  for (var i = 0; i < types.length; i++) {
    // Create an an input checkbox and label inside.
    var item = filters.appendChild(document.createElement('div'));
    var checkbox = item.appendChild(document.createElement('input'));
    var label = item.appendChild(document.createElement('label'));
    checkbox.type = 'checkbox';
    checkbox.id = types[i];
    checkbox.checked = true;
    // create a label to the right of the checkbox with explanatory text
    label.innerHTML = types[i];
    label.setAttribute('for', types[i]);
    // Whenever a person clicks on this checkbox, call the update().
    checkbox.addEventListener('change', update);
    checkboxes.push(checkbox);
  }

   // This function is called whenever someone clicks on a checkbox and changes
  // the selection of markers to be displayed.
  function update() {
    var enabled = {};
    // Run through each checkbox and record whether it is checked. If it is,
    // add it to the object of types to display, otherwise do not.
    for (var i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) enabled[checkboxes[i].id] = true;
    }
    pinLayer.setFilter(function(feature) {
      // If this symbol is in the list, return true. if not, return false.
      // The 'in' operator in javascript does exactly that: given a string
      // or number, it says if that is in a object.
      // 2 in { 2: true } // true
      // 2 in { } // false
      return (feature.properties['ins'] in enabled);
    });
  }
});






$(document).ready(function(){

    $("#radiussubmit").click(function(evt){
        evt.preventDefault();
        //sends the address value of the addres field to the getGeocode function
        address = $("#address").val();
        pub_ins = $("#insurance").val();
        getGeocode(address);
    });

    pinLayer.on('click', function(e) {
    var name = e.layer.feature.properties.title;
    var address = e.layer.feature.properties.Address;
    var phone = e.layer.feature.properties.phone;
    var id = e.layer.feature.properties.idd;
    $(".info").prepend("<p><a href='/ratings/"+ id +"'>"+id+" "+name+" "+address+" "+phone+"</a></p>");

    $(".info a").on('click', function(evt) {
        evt.preventDefault();
        var url = encodeURI($(this).attr("href"));
        $("#provider-detail").load(url, function(){
            reviewEvent(id);
        });
    });

    });
});

function reviewEvent(id){

        $("#reviewform").on('submit', function(evt){
            evt.preventDefault();
            var contents = $(this).serializeArray();
            contents.push({"name": "doctor_id", "value": id});
            var url = "/addreview";
            $.post(url, contents);

        });
}


function mapSearch(lat,lon){

    if (map.hasLayer(pinLayer)){

    map.removeLayer(pinLayer);
    }

    pinLayer.addTo(map);

    // establishes a center variable in the latLng format
    var center = L.latLng(lat, lon);

    // grabs a mile radius from the form and converts it meters, but doesn't reset it for some reason.
    var RADIUS = $("#radiustext").val() * 1609.34;

    pinLayer.setFilter(function showdrs(feature){
        return center.distanceTo(L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0])) < RADIUS;
    });

}

function getGeocode(address){
    //converts address to a url form replacing spaces with +
    address = address.replace(/ /g,"+");
    //the specific url for the get request
    var url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+address+".json?access_token="+L.mapbox.accessToken;
    //we send this url with a get request to the mapbox geocoder api
    $.get(url, function (response) {
        // we get an object back and pull out lat/lon
        var lon = (response.features[0].center[0]);
        var lat = (response.features[0].center[1]);
        //and feed these into the mapSearch function
        mapSearch(lat,lon);
    //if we fail to get a response we'll print error, should do more here
    }).fail(function(error){
        console.log('ERROR: ',error);
    });

}
