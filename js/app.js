/** 
 * Creates interactive neighborhood map, with list and search box
 * @author SittingFox
 * @required knockout.js
 */

"use strict";

/**
 * The Model
 * Holder of data
 */
var model = {
  initialize: function() {
    var self = this;

    // Location data
    self.locationNames = [
      "American Coney Island",
      "Lafayette Coney Island",
      "Woodward Coney Island"
    ];
    
    self.locationCity = "Detroit, MI";
  },

  /**
   * Pin prototype for markers, their data, and manipulating them
   * @param object placeData - Result from textsearch, holding data to particular place
   * @param google.maps.Map map - Our Google Map
   */
  Pin: function(placeData, map) {
    var self = this;

    self.map = map;
    self.name = placeData.name;
    self.position = placeData.geometry.location;

    self.marker = new google.maps.Marker({
      position: self.position,
      map: self.map,
      title: self.name
    });

    // Makes hidden marker reappear on map
    self.show = function() {
      self.marker.setMap(self.map);
    };

    // Makes marker disappear from map
    self.hide = function() {
      self.marker.setMap(null);
    };
  }

}; // end of model


/**
 * Knockout ViewModel configuration
 * Controlling interactions between the Model and View
 */
var NeighborhoodViewModel = function() {
  var self = this;

  // Observables
  // Sets up pins
  self.pins = ko.observableArray();

  /**
   * Initialize
   * Set up any functions needed, and then get initializing
   */

  function mapInitialize() {
      var mapElement = document.getElementById('map-canvas');
      var mapOptions = { disableDefaultUI: true };

      return ( new google.maps.Map(mapElement, mapOptions) );
  }

  // Create pins, add them to map, and resize and position map accordingly
  function pinsInitialize() {
    var service = new google.maps.places.PlacesService(self.map);
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
        pin = new model.Pin(placeData, self.map);
        self.pins.push(pin);
        
        bounds.extend(pin.position);
        self.map.fitBounds(bounds);
        self.map.setCenter(bounds.getCenter());
      }
    }

    // Create a search request that is a string of the place name plus city location
    model.locationNames.forEach( function(name) {
      request = {
        query: name + ", " + model.locationCity
      };

      service.textSearch(request, callback);
    });

  } // end of pinsInitialize
  
  // Initializing
  model.initialize();
  self.map = mapInitialize();
  pinsInitialize();


  /**
   * View-likes
   * Things more tied to the View
   */

  var drawer = document.querySelector('.drawer');
  var hamburger = document.querySelector('.hamburger');

  // Toggles opening and closing of drawer on button click
  self.toggleDrawer = function() {
    drawer.classList.toggle('open');
  };

  /**
   * Hide drawer, called by certain clicks
   * @param object data - The NeightborhoodViewModel object
   * @param MouseEvent event - Click information
   */
  self.hideDrawer = function (data, event) {  
    if (event.target != drawer) {
      drawer.classList.remove('open');
    }
  };

}; // end of NeighborhoodViewModel

ko.applyBindings(new NeighborhoodViewModel());