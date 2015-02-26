coordinates = coordinates.obj;
var points = coordinates;
var pinLayer = L.mapbox.featureLayer(points);



//this is an event listener for clicks on the submit button
$(document).ready(function(){
    $("#radiussubmit").click(function(evt){
        evt.preventDefault();
        //sends the address value of the addres field to the getGeocode function
        getGeocode($("#address").val());

    });

    pinLayer.on('click', function(e) {
    var name = e.layer.feature.properties.title;
    var address = e.layer.feature.properties.Address;
    var phone = e.layer.feature.properties.phone;
    $(".info").prepend("<p>"+name+" "+address+" "+phone+"</p>");
    });

    // $("#reset").click(function(evt){
    //     evt.preventDefault();
    //     reset();

    // });
});

function mapSearch(lat,lon){

    if (map.hasLayer(pinLayer)){

    map.removeLayer(pinLayer);
    }

    pinLayer.addTo(map);

    // establishes a center variable in the latLng format

    var center = L.latLng(lat, lon);

    // grabs a mile radius from the form and converts it meters, but doesn't reset it for some reason.

    var RADIUS = $("#radiustext").val() * 1609.34;

    // creates a circle which we don't really need, adds it as ab object to the map

    var filterCircle = L.circle(center, RADIUS, {
        opacity: 1,
        weight: 1,
        fillOpacity: 0.05
    });

    filterCircle.addTo(pinLayer);
    // console.log(filterCircle);

    // filters through our points evaluating them with a function that calls on a function calculating
    //distance and compares it to the radius

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

