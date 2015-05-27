/** 
 * Creates 
 * @author SittingFox
 * @required knockout.js
 */

"use strict";

/**
 * Map configuration
 */
var map;
var mapOptions = {
    zoom: 8,
    center: new google.maps.LatLng(-34.397, 150.644)
 };


/**
 * Sets up map on page
 */
function mapInitialize() {
    var mapElement = document.getElementById('map-canvas');
    map = new google.maps.Map(mapElement, mapOptions);
}


/**
 * Knockout ViewModel configuration
 */
var NeighborhoodViewModel = function() {
  var self = this;
  
  mapInitialize();

};

ko.applyBindings(new NeighborhoodViewModel());