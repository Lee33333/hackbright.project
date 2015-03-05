coordinates = coordinates.obj;
var pinLayer = L.mapbox.featureLayer(coordinates);

pinLayer.addTo(map);


var ins = document.getElementById('filter-ins');
var all = document.getElementById('filter-all');

var CENTER;
var RADIUS;

$(document).ready(function(){

    ins.onclick = function(e) {
        all.className = '';
        this.className = 'active';
        // The setFilter function takes a GeoJSON feature object
        // and returns true to show it or false to hide it.
        mapSearch();
        return false;
    };

    all.onclick = function() {
        ins.className = '';
        this.className = 'active';
        mapSearch();
        return false;
    };


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
    $(".info").prepend("<p><a href='/ratings/"+ id +"'>"+id+" "+name+" "+address+" "+phone+"</a></p>");

    $(".info a").on('click', function(evt) {
        evt.preventDefault();
        var url = encodeURI($(this).attr("href"));
        $("#provider-detail").load(url, function(){
            reviewEvent(id);
        });
    });

});

    // function updateProviderReviews(prov_id) {}
});



function mapSearch(){

    if (map.hasLayer(pinLayer)){
        map.removeLayer(pinLayer);
    }

    pinLayer.addTo(map);


    // filters through our points evaluating them with a function that calls on a function calculating
    //distance and compares it to the radius
    pinLayer.setFilter(function showdrs(feature){
        if (ins.className === 'active') {
            return (CENTER.distanceTo(L.latLng(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0])) < RADIUS) &&
                (feature.properties['ins'] === "yes");
        } else {
            return (CENTER.distanceTo(L.latLng(
                feature.geometry.coordinates[1],
                feature.geometry.coordinates[0])) < RADIUS);
        }
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
        CENTER = L.latLng(lat, lon);
        RADIUS = $("#radiustext").val() * 1609.34;

        mapSearch();
    //if we fail to get a response we'll print error, should do more here
    }).fail(function(error){
        console.log('ERROR: ',error);
    });

}

function reviewEvent(id) {

        $("#reviewform").on('submit', function(evt){
            evt.preventDefault();
            var contents = $(this).serializeArray();
            contents.push({"name": "doctor_id", "value": id});
            var url = "/addreview";
            $.post(url, contents, function (result) {
               // Your Flask has addded that review
               // return the list of comments for the doctor
            var url2 = encodeURI($(".info a").attr("href"));
            $("#provider-detail").load(url2);
            });

        });
}
