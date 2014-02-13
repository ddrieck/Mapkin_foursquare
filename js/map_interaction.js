$(document).ready(function() {
        // Set up the map
        var leafletMap = new L.Map("themap", {maxZoom: 18});
        var bgLayer = L.mapbox.tileLayer('mapkin.h8d8ccmd', { detectRetina: true });
        leafletMap.addLayer(bgLayer);
        leafletMap.setView([42.350463, -71.058983], 13);

        var popup = L.popup();

        function onMapClick(e) {
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(leafletMap);

            var coordinates = e.latlng.lat + "," + e.latlng.lng;

            console.log(coordinates);
            
            var foursquareURL = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates + "&intent=browse&radius=100000&v=20132805&client_id=HOM3GU3LXDBNRKWNYCEOXF4EC4SZJZCJBQMMIW1YG3ZADX4S&client_secret=2XJKEM3JYIQMJLGAYI4AUIU4ZWYYUUELMOZ2HKJN1M3CIVFH";
            
            var foursquareData = $.getJSON(foursquareURL, function(data){
                console.log(data);
            });

        };

        leafletMap.on('click', onMapClick);

});