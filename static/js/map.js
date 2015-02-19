
// console.log(coordinates);
// console.log(coordinates["obj"]["CAM"]["lat"]);

// var lon = (coordinates["obj"]["CAM"]["lon"]);
// var lat = (coordinates["obj"]["CAM"]["lat"]);




for (var key in coordinates["obj"]) {
    if (coordinates["obj"].hasOwnProperty(key)){
        var lon = (coordinates["obj"][key]["lon"]);
        var lat = (coordinates["obj"][key]["lat"]);
        var name = (coordinates["obj"][key]["lat"]);
        console.log(lon);
        console.log(lat);


        // console.log(coordinates["obj"][key]);

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
            title: coordinates["obj"],
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





