//GeoJson of all the doctors passed from / route
coordinates = coordinates.obj;

//creates a featureLayer from out GeoJson
var pinLayer = L.mapbox.featureLayer(coordinates);

//populates map with out featureLayer
pinLayer.addTo(map);

//gets toggle elements from the html
var showIns = document.getElementById('filter-ins');
var showAll = document.getElementById('filter-all');
var showTrans = document.getElementById('filter-trans');
var showTherapy = document.getElementById('filter-therapy');

//establishes variables for the search center and radius
var CENTER = L.latLng(37.8, -122.4);
var RADIUS = 20 * 1609.34;


//waits for all DOM elements to load
$(document).ready(function(){

    pinLayer.on('mouseover', function(e) {
    e.layer.openPopup();
    });
    pinLayer.on('mouseout', function(e) {
    e.layer.closePopup();
    });

    //events listener on "show all" changes the value of it's class name and calls mapSearch
    showIns.onclick = function(e) {
        showAll.className = '';
        this.className = 'active';
        mapSearch();
        //why is this this way?
        return false;
    };

    //events listener on "show all" changes the value of it's class name and calls mapSearch
    showAll.onclick = function() {
        showIns.className = '';
        this.className = 'active';
        showTrans.className='';
        showTherapy.className='';
        mapSearch();
        return false;
    };

    showTrans.onclick = function() {
        showAll.className = '';
        this.className = 'active';
        mapSearch();
        return false;
    };

    showTherapy.onclick = function(e) {
        showAll.className = '';
        this.className = 'active';
        mapSearch();
        //why is this this way?
        return false;
    };



    //when submit is clicked, grab value in address field and send to be geocoded
    $("#radiussubmit").click(function(evt){
        evt.preventDefault();
        getGeocode($("#address").val());
    });

    //when pin is clicked, grab values from its GeoJSON object, show them, and link them to /ratings
    pinLayer.on('click', function(e) {
        var name = e.layer.feature.properties.title;
        var address = e.layer.feature.properties.Address;
        var phone = e.layer.feature.properties.phone;
        var id = e.layer.feature.properties.idd;
        $("#basic-info").replaceWith(name+ " " + address + " " + phone);

        var url = "/ratings/" + id;
        $("#provider-detail").load(url, function(){
            reviewEvent(id);

        // $(".info").prepend("<p><a href='/ratings/"+ id +"'>"+id+" "+name+" "+address+" "+phone+"</a></p>");

        // // FIXME what is this doing?
        // $(".info a").on('click', function(evt) {
        //         evt.preventDefault();
        //         var url = encodeURI($(this).attr("href"));
        //         $("#provider-detail").load(url, function(){
        //             reviewEvent(id);


        // });

    });

});


function sendInfo(id, phone){
    console.log("in send info");
    console.log(phone);
    var url = "/sendinfo";
    var data = $(this).serializeArray();
    data.push({"name": "doctor_id", "value": id});
    data.push({"name": "phone", "value": phone});
    console.log(data);
    $.post(url, data, function (result) {
        console.log(result);
    } );

}

// FIXME rename!!! grabs, serializes contents of review form and posts it to /addreview route
function reviewEvent(id) {
        
        $("#textmess").on('submit', function(evt) {
            evt.preventDefault();
            $("submitphone").attr("disabled",true);
            var phone = $("#phone").val();
            console.log("in event listender");
            console.log(phone);
            sendInfo(id, phone);
        });



        $("#reviewform").on('submit', function(evt){
            evt.preventDefault();
            //gets contents of submit review form
            var contents = $(this).serializeArray();
            //appends doctor id
            contents.push({"name": "doctor_id", "value": id});
            var url = "/addreview";
            //sends this info in post to the add review route
            $.post(url, contents, function (result) {
               // Your Flask has addded that review
               // return the list of comments for the doctor

               // FIXME here we're loading another url in an attempt to refresh review but only works once
            var url2 = "/ratings/" + id;
            $("#provider-detail").load(url2, function(){
                $("#reviewform").hide();
            });
            });

        });
}

});


//updates the pins displayed on map
function mapSearch(){

    //remove current pinLayer from map
    if (map.hasLayer(pinLayer)){
        map.removeLayer(pinLayer);
    }

    //add the pin layer to map
    pinLayer.addTo(map);

    //setFilter takes GeoJSON object, evaluates it, and returns true to show it and false to hide it
    pinLayer.setFilter(function showDrs(feature){
        //if show insurance class is active, grab center and radius, and show pub insurance pins within radius
        if (showIns.className === 'active' && showTrans.className === 'active' && showTherapy.className === '') {
            return createLatLng(feature) &&
                (feature.properties['ins'] === "yes") &&
                (feature.properties['trans'] === "yes");
        }
        else if (showIns.className === '' && showTrans.className === 'active' && showTherapy.className === '') {
            return createLatLng(feature) &&
                (feature.properties['trans'] === "yes");
        }
        else if (showIns.className === 'active' && showTrans.className === '' && showTherapy.className === '') {
            return createLatLng(feature) &&
                (feature.properties['ins'] === "yes");
        }
        else if (showIns.className === '' && showTrans.className === '' && showTherapy.className === 'active') {
            return createLatLng(feature) &&
                (feature.properties['therapy'] === "yes");
        }
        else if (showIns.className === 'active' && showTrans.className === '' && showTherapy.className === 'active') {
            return createLatLng(feature) &&
                (feature.properties['therapy'] === "yes")&&
                (feature.properties['ins'] === "yes");
        }
        else if (showIns.className === '' && showTrans.className === 'active' && showTherapy.className === 'active') {
            return createLatLng(feature) &&
                (feature.properties['therapy'] === "yes")&&
                (feature.properties['trans'] === "yes");
        }
        else if (showIns.className === 'active' && showTrans.className === 'active' && showTherapy.className === 'active') {
            return createLatLng(feature) &&
                (feature.properties['therapy'] === "yes")&&
                (feature.properties['trans'] === "yes")&&
                (feature.properties['ins'] === "yes");
        }
        else {
            return createLatLng(feature);
        }
    });
}


function createLatLng(feature){
    return(CENTER.distanceTo(L.latLng(
    feature.geometry.coordinates[1],
    feature.geometry.coordinates[0])) < RADIUS);

}

//gets geocoded information for address with MapBox API
function getGeocode(address){
    //converts address to a url form replacing spaces with +
    address = address.replace(/ /g,"+");
    //the url for the get request
    var mapBoxUrl = "http://api.tiles.mapbox.com/v4/geocode/mapbox.places/"+address+".json?access_token="+L.mapbox.accessToken;
    // send this url with a get request to the mapbox geocoder api
    $.get(mapBoxUrl, function (response) {
        //  get an object back and pull out lat/lon
        var lon = (response.features[0].center[0]);
        var lat = (response.features[0].center[1]);
        // create a latLng object with the coordinates we got
        CENTER = L.latLng(lat, lon);
        //get radius value from form and convert it to miles
        RADIUS = $("#radiustext").val() * 1609.34;
        //call the mapSearch function
        mapSearch();
    //if we fail to get a response we'll print error, should do more here
    }).fail(function(error){
        console.log('ERROR: ',error);
    });

}

