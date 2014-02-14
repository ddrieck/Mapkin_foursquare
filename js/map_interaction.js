$(document).ready(function() {
        // Set up the map
        var leafletMap = new L.Map("themap", {maxZoom: 18});
        var venueLayer = new L.LayerGroup();
        var bgLayer = L.mapbox.tileLayer('mapkin.h8d8ccmd', { detectRetina: true });
        leafletMap.addLayer(bgLayer);
        leafletMap.addLayer(venueLayer);
        //Center the map on Boston
        leafletMap.setView([42.350463, -71.058983], 13);

        var popup = L.popup();

        function onMapClick(e) {
            venueLayer.clearLayers();
            //Popup from leaflet tutorial. Using as a marker for testing
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(leafletMap);

            //Grab coordinates of click and put it in format foursquare understands
            var coordinates = e.latlng.lat + "," + e.latlng.lng;
            
            //Query foursquare API. Find all locations within 100000 meters
            var foursquareURL = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates + "&intent=browse&radius=100000&v=20132805&client_id=HOM3GU3LXDBNRKWNYCEOXF4EC4SZJZCJBQMMIW1YG3ZADX4S&client_secret=2XJKEM3JYIQMJLGAYI4AUIU4ZWYYUUELMOZ2HKJN1M3CIVFH";
            

            $.getJSON(foursquareURL, function(data){
                console.log(data);
                for (var i=0; i < data.response.venues.length; i++){
                    var name = data.response.venues[i].name;
                    var locationLat = data.response.venues[i].location.lat;
                    var locationLng = data.response.venues[i].location.lng;
                    /*console.log(name + ": " + locationLng + ", " + locationLat);*/
                venueLayer.addLayer(new L.Marker(
                    new L.LatLng(locationLat, locationLng), 
                    { icon: new L.Icon({ iconUrl: 'https://dev.mapkin.co/resources/poi/cat-icon-generic.24.24',     iconSize: [24, 24], iconAnchor: [12, 12]}),
                          clickable: true,
                          draggable: false }));
                };

            });

            


        };

        leafletMap.on('click', onMapClick);

});