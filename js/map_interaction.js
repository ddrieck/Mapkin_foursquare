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
        if($(".sidebar").is(":visible")){
            $(".sidebar").empty().hide();
            $(".top-bar").empty().hide();
        }

        //Popup from leaflet tutorial. Using as a marker for testing
        popup
            .setLatLng(e.latlng)
            .setContent("You clicked the map at " + e.latlng.toString())
            .openOn(leafletMap);

        //Declare an empty variable to use for our object
        var catHash;

        //Call the categories method and pass through the callback
        myFoursquareService.categories(function(category){

            //Hash to flatten and contain the categories. I'm not a big cat fan either. Allergies. dogHash doesn't make much sense though.
            catHash = {};

            //This recursive function loops through all the categories and subcategories and puts them in a flat object. It keeps doing so until no more categories are found. 
            var hashCategories = function(myCat) {
                if (myCat.id)
                    catHash[myCat.id] = myCat;
                if (!myCat.categories) return;
                for (var i = 0; i < myCat.categories.length; i++) {
                    hashCategories(myCat.categories[i])
                };
            };

            //Call the above function. Foursquare has a lot of category heirarchy which we won't necessarily need for this function
            hashCategories(category);

            categoryWrite(catHash);
        });  //End catHash function

        function categoryWrite(catHash){
            //These are the variables for the categories that we actually want to display in our top bar
            var parkingId = "4c38df4de52ce0d596b336e1";
            var foodId = "4d4b7105d754a06374d81259";
            var shopsId = "4d4b7105d754a06378d81259";
            var gasId = "4bf58dd8d48988d113951735";
            var groceryId = "4bf58dd8d48988d118951735";

            var categoryArray = [parkingId, foodId, shopsId, gasId, groceryId];

            //Empty out the topbar to prevent stacking
            $(".topbar").empty();

            //Loop through the categories that we put in our array above and write out the icons on the topbar. Reveal the top bar as well.
            categoryArray.forEach(function(id){
                $(".topbar").show().append('<div class="category_item" data-id="' + catHash[id].id + '"><a href="#"><img src="' + catHash[id].icon.prefix + "bg_44" + catHash[id].icon.suffix + '" alt="' + catHash[id].shortName + '" title="' + catHash[id].shortName + '"></a></div>');
            });       
        } //End of category write function
    }; //End of click function

    function categoryClick(){
        $(".sidebar").empty();
        //Grab coordinates of click and put it in format foursquare understands
        var coordinates = leafletMap.getCenter().lat + "," + leafletMap.getCenter().lng;

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

            venueLayer.clearLayers();

        console.log(distance);
        
        myFoursquareService.query(distance, function(venues){
            $(".sidebar").empty();
            for (var i = 0; i < venues.length; i++) {
                $(".sidebar").show().append('<div class="venue_item" data-id="' + venues[i].id + '">' + venues[i].name + '<br>' + venues[i].address + '</div>');
                };
            }, coordinates, $(this).closest(".category_item").data("id"));
    }; 

    /**/ //End query method

    leafletMap.on('click', onMapClick);

    $(".topbar").on("click", ".category_item", categoryClick);

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