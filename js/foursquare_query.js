// Main 'class'
var FoursquareService = function(clientId, clientSecret) {
    this.collection;
    this.catCollection;
    //set this scope for inside the getJSON function
    var self = this;

    // 'class' representing a single venue
    var Venue = function(rawVenue) {
        var location = rawVenue.location;
        this.id = rawVenue.id; // Unique ID, comes from Foursquare
        this.name = rawVenue.name;
        this.address = location.address + " " + location.city + ", " + location.state + " " + location.postalCode;
        this.lat = location.lat;
        this.lng = location.lng;/*
        this.category = rawVenue.categories[0].name; // restaurant, airport, cafe, grocery store, etc*/
    };


    // 'class' that will be returned
    var VenueCollection = function(venues) {

       // The venues in this collection
        this.venues = venues;
        this.filter = function(filter) {
            return filter; // Returns VenueCollection that is filtered by the criteria
        };

    };

    // category 'class' for processing class data
    var Category = function(rawCategory){
        //Loop through the subcategories (they are arrays) and process the information we need into objects
        for (var i = 0; i < rawCategory.categories.length; i++) {
            var subCategories = rawCategory.categories[i]; //Every parent category has a subcategory which we assign to here
            this.icon = subCategories.icon.prefix + "bg_44" + subCategories.icon.suffix; //create the URL to access the image. Going with a standard 44px square image. Size can be changed.
            this.id = subCategories.id;
            this.name = subCategories.name;
        };

    };

    //categories in the class. Still not sure if this will be useful for future filtering. Figure it out during review. Can probably remove
    var CategoryCollection = function(categories){
        for (var i = 0; i < categories.length; i++) {
            this.categories += categories[i]
            };
        this.categories = categories;
        return categories;
    };

    //Query to process the categories and map the results to the Category class above
    this.categories = function(callback){
        //The foursquare query to access the categories API
        var foursquareCatURL = "https://api.foursquare.com/v2/venues/categories?v=20140221&client_id=" + clientId + "&client_secret=" + clientSecret;

        //Process the json results to a new collection instance and map the categories array to our categories class.
        $.getJSON(foursquareCatURL, function(result) {
                    self.catCollection =  new CategoryCollection(result.response);
                    self.catCollection.categories = $.map(
                        result.response.categories,
                        function(categories) {
                        //This is my hacknied way of getting the categories to be processed asynchronously. Probably a better way to right this. 
                            callback(categories);
                            //Even with async hack above you need to run this Category class processor
                            return new Category(categories);
                        }
                    ); 

            });
    };

    // API of the Foursquare class
    this.query = function(radius, callback, coordinates) {
        var foursquareURL = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates + "&intent=browse&radius=" + radius + "&sortByDistance=1&limit=100&v=20132805&client_id=" + clientId + "&client_secret=" + clientSecret;

        // Query foursquare using the filter, call callback with the VenueCollection
        // The filter should specify bounding box, search string, and/or categories
        // Optionally, this function could
        $.getJSON(foursquareURL, function(result) {
            self.collection =  new VenueCollection(result.response.venues);
            self.collection.venues = $.map(
                result.response.venues,
                function(venue) { 
                    return new Venue(venue);
                }
            );  

            callback(self.collection.venues);
        });
    };
};

