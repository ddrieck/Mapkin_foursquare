$(document).ready(function() {
    // Set up the map
    var leafletMap = new L.Map("themap", {maxZoom: 18});
    var venueLayer = new L.LayerGroup();
    var markerLayer = new L.LayerGroup();
    var bgLayer = L.mapbox.tileLayer('mapkin.h8d8ccmd', { detectRetina: true });
    leafletMap.addLayer(bgLayer);
    leafletMap.addLayer(venueLayer);
    leafletMap.addLayer(markerLayer);

    //Center the map on Boston
    leafletMap.setView([42.350463, -71.058983], 13);

    var popup = L.popup();

    var myFoursquareService = new FoursquareService('HOM3GU3LXDBNRKWNYCEOXF4EC4SZJZCJBQMMIW1YG3ZADX4S', '2XJKEM3JYIQMJLGAYI4AUIU4ZWYYUUELMOZ2HKJN1M3CIVFH');

    function onMapClick(e) {
        if($(".sidebar").is(":visible")){
            $(".sidebar").empty().hide();
            $(".top-bar").empty().hide();
        }


        $(".topbar-modified").removeClass("topbar-modified").addClass("topbar");

        markerLayer.clearLayers();
        venueLayer.clearLayers();

        markerLayer.addLayer(new L.Marker(new L.LatLng(e.latlng.lat,e.latlng.lng), 
                { icon: new L.Icon({ iconUrl: 'https://dev.mapkin.co/static/images/RouteMarkerEnd.png'}),
                      clickable: false,
                      draggable: false }));
                

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
            }  //End measure function

            venueLayer.clearLayers();

        myFoursquareService.query(distance, function(venues){
            $(".sidebar").empty();
            for (var i = 0; i < venues.length; i++) {
                $(".sidebar").show().append('<div class="venue_item venue_item_' + (i+1) + '" data-id="' + venues[i].id + '">' + venues[i].name + '<br>' + venues[i].address + '<br><a href="#" class="pin_click">Add to Map</a></div>');
                    };
            //Write pagination controls at bottom of sidebar
            $(".sidebar").append('<div id="pagination"><a href="#" class="first" data-action="first">&laquo;</a><a href="#" class="previous" data-action="previous">&lsaquo;</a><input type="text" readonly="readonly" data-max-page="40" /><a href="#" class="next" data-action="next">&rsaquo;</a><a href="#" class="last" data-action="last">&raquo;</a></div>');

            //Function to create pagination functionality
            function pagination(recordsPerPage, totalNumRecords){
                //loop through all of the divs and hide them by default.
                for (var i=1; i <= totalNumRecords; i++) {
                        $(".sidebar").find(".venue_item_" + i).hide();
                    }

                //then only display the number of divs the user dictated
                for (var i = 1; i <= recordsPerPage; i++) {
                    $(".sidebar").find(".venue_item_" + i).show();
                }

                //maxPages is the maximum amount of pages needed for pagination. (round up) 
                var maxPages = Math.ceil(totalNumRecords/recordsPerPage);   

                $('#pagination').jqPagination({
                    link_string : '/?page={page_number}',
                    max_page     : maxPages,
                    paged        : function(page) { 

                        //a new page has been requested

                        //loop through all of the divs and hide them all.
                        for (var i=1; i <= totalNumRecords; i++) {
                            $(".sidebar").find(".venue_item_" + i).hide();
                        }

                        //Find the range of the records for the page: 
                        var recordsFrom = recordsPerPage * (page-1) + 1;
                        var recordsTo = recordsPerPage * (page);

                        //then display only the records on the specified page
                        for (var i = recordsFrom; i <= recordsTo; i++) {
                            $(".sidebar").find(".venue_item_" + i).show();
                        }      

                        //scroll to the top of the page if the page is changed
                        $("html, body").animate({ scrollTop: 0 }, "slow");
                            }
                        }); //End of jqpagination call
                    } //End of pagination function

                pagination(10, venues.length);
        }, coordinates, $(this).closest(".category_item").data("id")); //End of 4sq query
    
    $(".topbar").removeClass("topbar").addClass("topbar-modified");
    }; //End categoryClick method

    leafletMap.on('click', onMapClick);

    $(".topbar").on("click", ".category_item", categoryClick);

    var pin_populate = function(){
       var collection = myFoursquareService.collection.venues;
       var dataTag = $(this).parent().data("id");
       for (var i = 0; i < collection.length; i++) {
            if (collection[i].id === dataTag){         venueLayer.addLayer(new L.Marker(new L.LatLng(collection[i].lat,collection[i].lng), 
                { icon: new L.Icon({ iconUrl: /*collection[i].icon*/'https://dev.mapkin.co/resources/poi/cat-icon-generic.24.24',     iconSize: [24, 24], iconAnchor: [12, 12]}),
                      clickable: true,
                      draggable: false }));
                };
            };

    };

    $(".sidebar").on("click", ".pin_click", pin_populate);

});