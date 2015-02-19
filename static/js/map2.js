
console.log(coordinates);

coordinates = coordinates.obj;
// console.log(coordinates["obj"]["CAM"]["lat"]);

// var lon = (coordinates["obj"]["CAM"]["lon"]);
// var lat = (coordinates["obj"]["CAM"]["lat"]);

// How do I access names in the data structure that I created?!!!!!!!!!!!!!!!!

// var i = 0;
// var names = Object.keys(coordinates["obj"]);



// // for (var key in coordinates["obj"]) {
//     if (coordinates["obj"].hasOwnProperty(key)){
//         var lon = (coordinates["obj"][key]["lon"]);
//         var lat = (coordinates["obj"][key]["lat"]);
//         var docName = (names[i]);

//         var i = i + 1;
var points = {
    // this feature is in the GeoJSON format: see geojson.org
    // for the full specification
    type: 'Feature',
    geometry: {
        type: 'Point',
        // coordinates here are in longitude, latitude order because
        // x, y is the standard for GeoJSON and many formats
        coordinates: [
          coordinates.CAM.lon,
          coordinates.CAM.lat
          
        ]
    },
    properties: {
        title: "name",
        description: '1718 14th St NW, Washington, DC',
        // one can customize markers by adding simplestyle properties
        // https://www.mapbox.com/guides/an-open-platform/#simplestyle
        'marker-size': 'large',
        'marker-color': '#BE9A6B',
        'marker-symbol': 'cafe'
    }
    };

var layer = L.mapbox.featureLayer(points).addTo(map); 

    // }
// }



console.log(coordinates);

var center = L.latLng(37.7493, -122.4555);

console.log(center);

var RADIUS = 6500;       hphy i        
var filterCircle = L.circle(center, RADIUS, {
    opacity: 1,
    weight: 1,
    fillOpacity: 0.4
}).addTo(map);


layer.setFilter(function showdrs(feature){
    return center.distanceTo(L.latLng(
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0])) < RADIUS;
});
