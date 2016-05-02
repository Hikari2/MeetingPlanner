/**
 * Created by Jiansun on 4/24/16.
 */

    function init()
    {
//            timedMsg();
        // get the current location
        navigator.geolocation.getCurrentPosition(function(position)
        {
            var coords = position.coords;
            // set the lat and lng
            var latlng = new google.maps.LatLng(coords.latitude,coords.longitude);
            var myOptions =
            {
                // zoom in
                zoom:14,
                // lat and lng
                center:latlng,
                // map type
                mapTypeId:google.maps.MapTypeId.ROADMAP
            };
            var map1;
            // show map
            map1 = new google.maps.Map(document.getElementById('map'),myOptions);
            // build marker
            var marker = new google.maps.Marker(
                {
                    position:latlng,
                    map:map1
                });
            var infowindow = new google.maps.InfoWindow(
                {
                    content:"Your Location!"
                });
            // pop up
            infowindow.open(map1,marker);
        });
    }
