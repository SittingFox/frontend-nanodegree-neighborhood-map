/** 
 * Creates interactive neighborhood map, with list and search box
 * @author SittingFox
 * @required knockout.js
 */

"use strict";

/**
 * Map configuration
 */
var map;
var mapOptions = {
    disableDefaultUI: true
 };


 /**
  * Locations
  */
var locationNames = [
  "American Coney Island",
  "Lafayette Coney Island",
  "Woodward Coney Island"
];
var locationCity = "Detroit, MI";


/**
 * Pin class for markers, their data, and manipulating them
 * @param object placeData - Result from textsearch, holding data to particular place
 * @param google.maps.Map map - Our Google Map
 */
var Pin = function(placeData, map) {  
  this.map = map;
  this.name = placeData.name;
  this.position = placeData.geometry.location;

  this.marker = new google.maps.Marker({
    position: this.position,
    map: this.map,
    title: this.name
  });
};

Pin.prototype.show = function() {
  marker.map = this.map;
};

Pin.prototype.hide = function() {
  marker.map = null;
};


/**
 * Initializers
 */

 // Sets up map on page
function mapInitialize() {
    var mapElement = document.getElementById('map-canvas');
    map = new google.maps.Map(mapElement, mapOptions);
}

// Sets up pins
var pins = [];

/**
 * Create pins, add them to map, and resize and position map accordingly
 * @param array places - List of names (strings) of different places
 * @param string city - City the places are located in
 * @param google.maps.Map map - Our Google Map
 */
function pinsInitialize(places, city, map) {
  var service = new google.maps.places.PlacesService(map);
  var placeData, pin, request;

  var bounds = new google.maps.LatLngBounds();

  /**
   * Callback function for textSearch for locations based on name and city
   * @param array results - All results found by search
   * @param string status - String representation of if search succeeded
   */
  function callback(results, status) {
    // Check if status is "OK"
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      placeData = results[0];
      pin = new Pin(placeData, map);
      pins.push(pin);
      
      bounds.extend(pin.position);
      map.fitBounds(bounds);
      map.setCenter(bounds.getCenter());
    }
  }

  // Create a search request that is a string of the place name plus city location
  places.forEach( function(place) {
    request = {
      query: place + ", " + city
    };

    service.textSearch(request, callback);
  });

}


/**
 * Knockout ViewModel configuration
 */
var NeighborhoodViewModel = function() {
  var self = this;
  
  mapInitialize();
  pinsInitialize(locationNames, locationCity, map);
};

ko.applyBindings(new NeighborhoodViewModel());