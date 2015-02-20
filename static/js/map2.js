
coordinates = coordinates.obj;

// creates a geojson object called points, in the future it needs to take it in from somewhere

var points = coordinates;

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

//creates a feature layer using our geojson points variable and adds it to map

var layer = L.mapbox.featureLayer(points).addTo(map); 

// establishes a center variable in the latLng format

var center = L.latLng(37.7493, -122.4555);

// creates a radius, this needs to be imputed in the future

var RADIUS = 6500;   

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

