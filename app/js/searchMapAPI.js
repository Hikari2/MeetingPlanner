/**
 * Created by Jiansun on 4/24/16.
 */
var geocoder;
var map, popup;
function initialize() {
    geocoder = new google.maps.Geocoder();
    popup = new google.maps.InfoWindow();

    var latlng = new google.maps.LatLng(59.3004, 18.0722);		// map center
    var mapOptions = {
        zoom: 12,
        center: latlng
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);
}
function codeAddress() {
    var address = document.getElementById("address").value;
    geocoder.geocode({'address': address}, function (results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);

            document.getElementById("lat").value = results[0].geometry.location.lat();
            document.getElementById("lng").value = results[0].geometry.location.lng();
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location,

            });
            showAddress(results[0], marker);
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}
// put the marker on map
function showAddress(result, marker) {
    var popupContent = result.formatted_address;
    popup.setContent(popupContent);
    popup.open(map, marker);
}
function getAddress() {
    var xPosition = new google.maps.LatLng(document.getElementById("lat").value, document.getElementById("lng").value)

    // We can use Google map Geocoder API to find the location from lat and lng
    geocoder.geocode({
        'latLng': xPosition
    }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
            if (results) {
                document.getElementById("address1").value = results[0].formatted_address;
//                        codeAddress(results[0].formatted_address);
                document.getElementById('address').value = results[0].formatted_address;
                codeAddress()
            }
        } else {
            alert("Reverse Geocoding failed because: " + status);
        }
    });
}