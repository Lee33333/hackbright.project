coordinates = coordinates.obj;
var points = coordinates;
var pinLayer = L.mapbox.featureLayer(points);


$(document).ready(function(){

    $("#radiussubmit").click(function(evt){
        evt.preventDefault();
        //sends the address value of the addres field to the getGeocode function
        address = $("#address").val();
        pub_ins = $("#insurance").val();
        getGeocode(address, pub_ins);
    });

    pinLayer.on('click', function(e) {
    var name = e.layer.feature.properties.title;
    var address = e.layer.feature.properties.Address;
    var phone = e.layer.feature.properties.phone;
    var id = e.layer.feature.properties.idd;
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


function mapSearch(lat,lon, pub_ins){

    console.log(pub_ins);
    if (map.hasLayer(pinLayer)){

    map.removeLayer(pinLayer);
    }

    pinLayer.addTo(map);

    // establishes a center variable in the latLng format
    var center = L.latLng(lat, lon);

    // grabs a mile radius from the form and converts it meters, but doesn't reset it for some reason.
    var RADIUS = $("#radiustext").val() * 1609.34;

    pinLayer.setFilter(function showdrs(feature){
        return center.distanceTo(L.latLng(
            feature.geometry.coordinates[1],
            feature.geometry.coordinates[0])) < RADIUS;
    });

    // var filter = $(this).data('filter');
    
    // $(this).addClass('active').siblings().removeClass('active');
    // pinLayer.setFilter(function(f) {
    //     // If the data-filter attribute is set to "all", return
    //     // all (true). Otherwise, filter on markers that have
    //     // a value set to true based on the filter name.
    //     return (filter === 'all') ? true : f.properties[filter] === true;
    // });
    // return false;

}

function getGeocode(address, pub_ins){
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
        mapSearch(lat,lon, pub_ins);
    //if we fail to get a response we'll print error, should do more here
    }).fail(function(error){
        console.log('ERROR: ',error);
    });

}
