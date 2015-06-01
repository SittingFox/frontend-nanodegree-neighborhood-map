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
  Pokemon: function(pokemon, map) {
    var self = this;

    self.map = map;
    self.name = pokemon.name;
    self.position = new google.maps.LatLng(pokemon.lat, pokemon.lon);

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
  },

  pokemonData: [
    {
      name: "Bulbasaur",
      lat: 37.4236667,
      lon: -122.0906058
    },
    {
      name: "Ivysaur",
      lat: 37.770204,
      lon: -122.470158
    },
    {
      name: "Venusaur",
      lat: 53.532199,
      lon: -113.505583
    },
    {
      name: "Charmander",
      lat: 34.3797645,
      lon: 132.4504207
    },
    {
      name: "Charmeleon",
      lat: -0.364455,
      lon: -91.561621
    },
    {
      name: "Charizard",
      lat: -19.528127,
      lon: 169.447793
    },
    {
      name: "Squirtle",
      lat: 35.659158,
      lon: 139.729254
    },
    {
      name: "Wartortle",
      lat: 51.5052317,
      lon: -0.1664071
    },
    {
      name: "Blastoise",
      lat: -0.607383,
      lon: -90.178757
    }
  ] // end of pokemonData

}; // end of model


/**
 * Knockout ViewModel configuration
 * Controlling interactions between the Model and View
 */
var NeighborhoodViewModel = function() {
  var self = this;

  // Observables
  // Sets up pins
  self.allPokemon = ko.observableArray();

  /**
   * Initialize
   * Set up any functions needed, and then get initializing
   */

  function mapInitialize() {
      var mapElement = document.getElementById('map-canvas');
      var home = new google.maps.LatLng(model.pokemonData[0].lat, model.pokemonData[0].lon);
      var mapOptions = {
        disableDefaultUI: true,
        zoom: 8,
        center: home
      };

      return ( new google.maps.Map(mapElement, mapOptions) );
  }

  // Create pins, add them to map, and resize and position map accordingly
  function pokemonInitialize() {
    var pokemon;
    model.pokemonData.forEach( function(data) {
      pokemon = new model.Pokemon(data, self.map);   
      self.allPokemon.push(pokemon);
    } );

  } // end of pinsInitialize
  
  // Initializing
  model.initialize();
  self.map = mapInitialize();
  pokemonInitialize();


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