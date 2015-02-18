var obj = "{{coordinates}}";
console.log(obj);
console.log("!!!!!!!!!!!!'");


// var items = [4, 8, 15, 16, 23, 42];
// for (var i = 0; i < items.length; i++) {
//     console.log("The next winning number is:" + items[i]);
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
          -122.411570,
          37.78876
          
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