coordinates = coordinates.obj;
var points = coordinates;
var pinLayer = L.mapbox.featureLayer(points);



//this is an event listener for clicks on the submit button
$(document).ready(function(){

    // $("#docsubmit").on('click', function(evt){
    //     evt.preventDefault();
    //     var doc_info = $("#doc_form").serializeArray();
    //     var doc_address = doc_info[3].value;

    //     //converts address to a url form replacing spaces with +
    //     address = doc_address.replace(/ /g,"+");
    //     //the specific url for the get request
    //     var url = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+address+".json?access_token="+L.mapbox.accessToken;
    //     //we send this url with a get request to the mapbox geocoder api

    //    $.get(url, function (response) {
    //         // we get an object back and pull out lat/lon
    //         var lon = (response.features[0].center[0]);
    //         var lat = (response.features[0].center[1]);
    //         // doc_info.push({"name": "lat", "value": lat});
    //         // doc_info.push({"name": "lon", "value": lon});
    //         // $.post("/adddoc", doc_info);
    //         var lattitude = $('<input>').attr("name","lat").attr("value", lat);
    //         var longitude = $('<input>').attr("name","lon").attr("value", lon);


           
    //         $("#doc_form").prepend(lattitude).prepend(longitude);
    //         $("#doc_form").submit();
        
    //     //if we fail to get a response we'll print error, should do more here
    //     }).fail(function(error){
    //         console.log('ERROR: ',error);
    //     });
        
    // });

    $("#radiussubmit").click(function(evt){
        evt.preventDefault();
        //sends the address value of the addres field to the getGeocode function
        getGeocode($("#address").val());
    });

    pinLayer.on('click', function(e) {
    var name = e.layer.feature.properties.title;
    var address = e.layer.feature.properties.Address;
    var phone = e.layer.feature.properties.phone;
    var id = e.layer.feature.properties.idd;
    console.log(id);
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
