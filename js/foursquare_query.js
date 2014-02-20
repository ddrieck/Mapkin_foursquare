// Main 'class'
var FoursquareService = function(clientId, clientSecret) {
    this.collection;
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

