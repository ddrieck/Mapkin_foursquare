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

            //This mess of code will take the window boundary and pass it to the measure function
            var boundBox = leafletMap.getBounds().toBBoxString();

            //Take the toBBoxString result and separate it
            boundBox = boundBox.split(",");
            var lat1 = parseFloat(boundBox[0]);
            var lon1 = parseFloat(boundBox[1]);
            var lat2 = parseFloat(boundBox[2]);
            var lon2 = parseFloat(boundBox[3]);
            
        var distance = measure(lat1, lon2, lat2, lon2);

        //This function will calculate the distance between two longitude, latitude coordinates
        function measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
            var R = 6378.137; // Radius of earth in KM
            var dLat = (lat2 - lat1) * Math.PI / 180;
            var dLon = (lon2 - lon1) * Math.PI / 180;
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c;
            return (d * 1000); // meters
            }

            console.log(distance);

            myFoursquareService.query(distance, function(venues){
                $(".sidebar").empty();
                for (var i = 0; i < venues.length; i++) {
                        $(".sidebar").append('<div class="venue_item" data-id="' + venues[i].id + '">' + venues[i].name + '<br>' + venues[i].address + '</div>');
                    };

                }, coordinates); //End query method

            }; //End function

        leafletMap.on('click', onMapClick);

        var pin_populate = function(){
           var collection = myFoursquareService.collection.venues;
           var dataTag = $(this).data("id");
           for (var i = 0; i < collection.length; i++) {
                if (collection[i].id === dataTag){         venueLayer.addLayer(new L.Marker(new L.LatLng(collection[i].lat,collection[i].lng), 
                    { icon: new L.Icon({ iconUrl: 'https://dev.mapkin.co/resources/poi/cat-icon-generic.24.24',     iconSize: [24, 24], iconAnchor: [12, 12]}),
                          clickable: true,
                          draggable: false }));
                    };
                };

        };

        $(".sidebar").on("click", ".venue_item", pin_populate);

});