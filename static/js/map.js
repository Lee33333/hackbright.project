
console.log(coordinates);
console.log(coordinates["obj"]["Kitty Cat"].lon);
var lon = (coordinates["obj"]["Kitty Cat"].lon);
var lat = (coordinates["obj"]["Kitty Cat"].lat);

// for (var i = 0; i <obj.length; i++){
//     console.log(obj[i]);
// }

// for (var key in obj) {
//     if (obj.hasOwnProperty(key)){
//         console.log(obj[key]);
//     }
// }


    L.mapbox.featureLayer({
        // this feature is in the GeoJSON format: see geojson.org
        // for the full specification
        type: 'Feature',
        geometry: {
            type: 'Point',
            // coordinates here are in longitude, latitude order because
            // x, y is the standard for GeoJSON and many formats
            coordinates: [
              lon,
              lat
              
            ]
        },
        properties: {
            title: 'Peregrine Espresso',
            description: '1718 14th St NW, Washington, DC',
            // one can customize markers by adding simplestyle properties
            // https://www.mapbox.com/guides/an-open-platform/#simplestyle
            'marker-size': 'large',
            'marker-color': '#BE9A6B',
            'marker-symbol': 'cafe'
        }
    }).addTo(map);



// L.mapbox.featureLayer({
//     // this feature is in the GeoJSON format: see geojson.org
//     // for the full specification
//     type: 'Feature',
//     geometry: {
//         type: 'Point',
//         // coordinates here are in longitude, latitude order because
//         // x, y is the standard for GeoJSON and many formats
//         coordinates: [
//           -122.411570,
//           37.78876
          
//         ]
//     },
//     properties: {
//         title: 'Peregrine Espresso',
//         description: '1718 14th St NW, Washington, DC',
//         // one can customize markers by adding simplestyle properties
//         // https://www.mapbox.com/guides/an-open-platform/#simplestyle
//         'marker-size': 'large',
//         'marker-color': '#BE9A6B',
//         'marker-symbol': 'cafe'
//     }
// }).addTo(map);