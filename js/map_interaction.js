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

        var myFoursquareService = new FoursquareService('HOM3GU3LXDBNRKWNYCEOXF4EC4SZJZCJBQMMIW1YG3ZADX4S', '2XJKEM3JYIQMJLGAYI4AUIU4ZWYYUUELMOZ2HKJN1M3CIVFH');

        function onMapClick(e) {
            venueLayer.clearLayers();
            //Popup from leaflet tutorial. Using as a marker for testing
            popup
                .setLatLng(e.latlng)
                .setContent("You clicked the map at " + e.latlng.toString())
                .openOn(leafletMap);

            //Grab coordinates of click and put it in format foursquare understands
            var coordinates = e.latlng.lat + "," + e.latlng.lng;

            myFoursquareService.query(null, function(venues){
                console.log(typeof(venues[0].lat + venues[0].lng));
                    venueLayer.addLayer(new L.Marker(
                        new L.LatLng(coordinates), 
                        { icon: new L.Icon({ iconUrl: 'https://dev.mapkin.co/resources/poi/cat-icon-generic.24.24',     iconSize: [24, 24], iconAnchor: [12, 12]}),
                          clickable: true,
                          draggable: false }));
                }, coordinates);
            };

        leafletMap.on('click', onMapClick);

});