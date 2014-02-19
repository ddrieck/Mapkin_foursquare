// Main 'class'
var FoursquareService = function(clientId, clientSecret) {

    // 'class' representing a single venue
    var Venue = function(rawVenue) {
        this.id = rawVenue.id; // Unique ID, comes from Foursquare
        this.name = rawVenue.name;
        this.location = rawVenue.location.lat + ", " + rawVenue.location.lng;
        this.lat = rawVenue.location.lat;
        this.lng = rawVenue.location.lng;
        this.category = rawVenue.categories[0].name; // restaurant, airport, cafe, grocery store, etc
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
    this.query = function(filter, callback, coordinates) {
        var foursquareURL = "https://api.foursquare.com/v2/venues/search?ll=" + coordinates + "&intent=browse&radius=8047&limit=50&v=20132805&client_id=" + clientId + "&client_secret=" + clientSecret;

        // Query foursquare using the filter, call callback with the VenueCollection
        // The filter should specify bounding box, search string, and/or categories
        // Optionally, this function could
        $.getJSON(foursquareURL, function(result) {
            var collection = new VenueCollection(result.response.venues);

            collection.venues = $.map(
                result.response.venues,
                function(venue) { 
                    return new Venue(venue);
                }
            );  

            callback(collection.venues);
        });
    };
};

