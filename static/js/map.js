
console.log(coordinates);
// console.log(coordinates["obj"]["CAM"]["lat"]);

// var lon = (coordinates["obj"]["CAM"]["lon"]);
// var lat = (coordinates["obj"]["CAM"]["lat"]);

// How do I access names in the data structure that I created?!!!!!!!!!!!!!!!!

var i = 0;
var names = Object.keys(coordinates["obj"]);

for (var key in coordinates["obj"]) {
    if (coordinates["obj"].hasOwnProperty(key)){
        var lon = (coordinates["obj"][key]["lon"]);
        var lat = (coordinates["obj"][key]["lat"]);
        
        var docName = (names[i]);
        console.log(docName);

        var i = i + 1;

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
            title: docName,
            description: '1718 14th St NW, Washington, DC',
            // one can customize markers by adding simplestyle properties
            // https://www.mapbox.com/guides/an-open-platform/#simplestyle
            'marker-size': 'large',
            'marker-color': '#BE9A6B',
            'marker-symbol': 'cafe'
        }
    }).addTo(map);

    }
}





