coordinates = coordinates.obj;
var points = coordinates;
var layer = L.mapbox.featureLayer(points);



//this is an event listener for clicks on the submit button
$(document).ready(function(){
    $("#radiussubmit").click(function(evt){
        evt.preventDefault();
        //sends the address value of the addres field to the getGeocode function
        getGeocode($("#address").val());

    });

    $("#reset").click(function(evt){
        evt.preventDefault();
        reset();

    });
});

function reset(){
    if (map.hasLayer(layer)){

        map.removeLayer(layer);
    }
}

function mapSearch(lat,lon){

    // creates a geojson object called points, containing objects about all the doctors

    //creates a feature layer using our geojson points variable and adds it to map

    layer.addTo(map);

    // var layer = L.mapbox.featureLayer(points).addTo(map);

    // establishes a center variable in the latLng format

    // var lat = parseFloat($("#lattext").val());
    // var lon = parseFloat($("#lontext").val());

    var center = L.latLng(lat, lon);

    // grabs a mile radius from the form and converts it meters, but doesn't reset it for some reason.

    var RADIUS = $("#radiustext").val() * 1609.34;

    // creates a circle which we don't really need, adds it as ab object to the map

    // var filterCircle = L.circle(center, RADIUS, {
    //     opacity: 1,
    //     weight: 1,
    //     fillOpacity: 0.05
    // });

    // filterCircle.addTo(map);

    // filters through our points evaluating them with a function that calls on a function calculating
    //distance and compares it to the radius

    layer.setFilter(function showdrs(feature){
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

// {
//     // this feature is in the GeoJSON format: see geojson.org
//     // for the full specification
//     type: 'Feature',
//     geometry: {
//         type: 'Point',
//         // coordinates here are in longitude, latitude order because
//         // x, y is the standard for GeoJSON and many formats
//         coordinates: [
//           coordinates.CAM.lon,
//           coordinates.CAM.lat
          
//         ]
//     },
//     properties: {
//         title: "name",
//         description: '1718 14th St NW, Washington, DC',
//         // one can customize markers by adding simplestyle properties
//         // https://www.mapbox.com/guides/an-open-platform/#simplestyle
//         'marker-size': 'large',
//         'marker-color': '#BE9A6B',
//         'marker-symbol': 'cafe'
//     }
//     };