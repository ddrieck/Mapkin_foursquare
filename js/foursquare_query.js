// Main 'class'
var FoursquareService = function(clientId, clientSecret) {

    // 'class' representing a single venue
    var Venue = function(rawVenue) {
        this.id = ...; // Unique ID, comes from Foursquare
        this.name = ...;
        this.location = ...;
        this.category = ...; // restaurant, airport, cafe, grocery store, etc
    };


    // 'class' that will be returned
    var VenueCollection = function(venues) {

        // The venues in this collection
        this.venues = ...;

        this.filter = function(filter) {
            return ... // Returns VenueCollection that is filtered by the criteria
        };
    };


    // API of the Foursquare class
    this.query = function(filter, callback) {
        // Query foursquare using the filter, call callback with the VenueCollection
        // The filter should specify bounding box, search string, and/or categories
        // Optionally, this function could
        jQuery.ajax(..., function(result) {
            callback(new VenueCollection(...));
        });
    };
};

