coordinates = coordinates.obj;

// $(document).ready(function(){
//         $("#radiussubmit").click(function(evt){
//             evt.preventDefault();
//             mapSearch(coordinates);
//            });
// });
$(document).ready(function(){
function changeaddy(evt) {
    evt.preventDefault();
    $.post("/geocode", {addy:$("#addytext").val()},function (result) {
        mapSearch(coordinates, result);
        console.log(coordinates);
        console.log(result);
    } );
    // $("#addytext").load('/geocode');

}

$("#radiussubmit").on('submit', changeaddy);
});

function mapSearch(coordinates, result){

    // creates a geojson object called points, in the future it needs to take it in from somewhere

    var points = coordinates;

    //creates a feature layer using our geojson points variable and adds it to map

    var layer = L.mapbox.featureLayer(points).addTo(map);

    // establishes a center variable in the latLng format

    // var lat = parseFloat($("#lattext").val());
    // var lon = parseFloat($("#lontext").val());

    var center = L.latLng(result);

    // grabs a radius from the form, but doesn't reset it for some reason.

    // var RADIUS = $("#radiustext").val();
    var RADIUS = 5;

    // creates a circle which we don't really need, adds it as ab object to the map

    var filterCircle = L.circle(center, RADIUS, {
        opacity: 1,
        weight: 1,
        fillOpacity: 0.05
    }).addTo(map);

    // filters through our points evaluating them with a function that calls on a function calculating
    //distance and compares it to the radius

    layer.setFilter(function showdrs(feature){
        return center.distanceTo(L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0])) < RADIUS;
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