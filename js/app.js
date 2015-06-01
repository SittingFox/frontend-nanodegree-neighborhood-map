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
    // Kanto Pokemon
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
    },
    {
      name: "Pidgey",
      lat: 43.642764,
      lon: -79.386679
    },
    {
      name: "Pikachu",
      lat: 46.230870,
      lon: 6.046052
    },
    {
      name: "Raichu",
      lat: 46.228531,
      lon: 6.043166
    },
    {
      name: "Jigglypuff",
      lat: 42.339573,
      lon: -83.074731
    },
    {
      name: "Meowth",
      lat: 43.070067,
      lon: -89.415611
    },
    {
      name: "Psyduck",
      lat: 47.608634,
      lon: -122.34519
    },
    {
      name: "Gengar",
      lat: 33.407885,
      lon: -104.5590278
    },
    {
      name: "Gyarados",
      lat: 32.081335,
      lon: 34.762340
    },
    {
      name: "Lapras",
      lat: 43.105520,
      lon: -89.421286
    },
    {
      name: "Eevee",
      lat: 40.829956,
      lon: -73.926510
    },
    {
      name: "Vaporeon",
      lat: 25.131382,
      lon: 55.108941
    },
    {
      name: "Jolteon",
      lat: 34.0455507,
      lon: -118.2689838
    },
    {
      name: "Flareon",
      lat: -33.91027,
      lon: 151.207846
    },
    {
      name: "Porygon",
      lat: 37.756119,
      lon: 140.45401
    },
    {
      name: "Snorlax",
      lat: 41.901926,
      lon: 12.455729
    },
    {
      name: "Dragonite",
      lat: 37.4206962,
      lon: -122.0870164
    },
    // Johto Pokemon
    {
      name: "Chikorita",
      lat: 37.492054,
      lon: -122.170873
    },
    {
      name: "Bayleef",
      lat: 29.720045,
      lon: -95.389474
    },
    {
      name: "Meganium",
      lat: 38.899060,
      lon: -77.036730
    },
    {
      name: "Cyndaquil",
      lat: 31.592997,
      lon: 130.667881
    },
    {
      name: "Quilava",
      lat: 43.7286387,
      lon: 7.4125268
    },
    {
      name: "Typhlosion",
      lat: -6.126247,
      lon: 105.381656
    },
    {
      name: "Totodile",
      lat: 36.6183274,
      lon: -121.9017755
    },
    {
      name: "Croconaw",
      lat: 37.422391,
      lon: -122.178099
    },
    {
      name: "Feraligatr",
      lat: -12.190539,
      lon: 96.871683
    },
    {
      name: "Hoothoot",
      lat: 35.6610088,
      lon: 139.7312815
    },
    {
      name: "Pichu",
      lat: 46.241013,
      lon: 6.040882
    },
    {
      name: "Togepi",
      lat: 41.402225,
      lon: 2.169062
    },
    {
      name: "Ampharos",
      lat: 46.234746,
      lon: 6.063245
    },
    {
      name: "Marill",
      lat: 42.945043,
      lon: -122.115616
    },
    {
      name: "Sudowoodo",
      lat: 51.897694,
      lon: -8.47434
    },
    {
      name: "Espeon",
      lat: 36.630152,
      lon: 138.183831
    },
    {
      name: "Umbreon",
      lat: -3.131769,
      lon: -60.0297332
    },
    {
      name: "Unown",
      lat: -34.6004893,
      lon: -58.3638371
    },
    {
      name: "Wobbuffet",
      lat: 55.8514966,
      lon: -4.2944702
    },
    {
      name: "Steelix",
      lat: 42.2759288,
      lon: -83.7454155
    },
    {
      name: "Scizor",
      lat: 30.281196,
      lon: -97.734711
    },
    {
      name: "Heracross",
      lat: 47.9186718,
      lon: 106.8983392
    },
    {
      name: "Donphan",
      lat: -0.747168,
      lon: -90.449293
    },
    {
      name: "Miltank",
      lat: 48.8729989,
      lon: 2.2936676
    },
    {
      name: "Tyranitar",
      lat: -0.700788,
      lon: -90.206741
    },
    // Hoenn Pokemon
    {
      name: "Treecko",
      lat: 47.645396,
      lon: -122.335523
    },
    {
      name: "Grovyle",
      lat: 35.638426,
      lon: 139.719364
    },
    {
      name: "Sceptile",
      lat: -0.684431,
      lon: -90.332513
    },
    {
      name: "Torchic",
      lat: 40.820978,
      lon: 14.424819
    },
    {
      name: "Combusken",
      lat: 46.218597,
      lon: -122.193715
    },
    {
      name: "Blaziken",
      lat: 37.749986,
      lon: 14.998729
    },
    {
      name: "Mudkip",
      lat: 35.680985,
      lon: 139.760967
    },
    {
      name: "Marshtomp",
      lat: -33.808925,
      lon: 151.285066
    },
    {
      name: "Swampert",
      lat: -33.911554,
      lon: 151.189785
    },
    {
      name: "Beautifly",
      lat: 37.43576,
      lon: -122.119743
    },
    {
      name: "Lotad",
      lat: 54.617214,
      lon: -5.899740
    },
    {
      name: "Taillow",
      lat: 49.211180,
      lon: -123.205028
    },
    {
      name: "Kirlia",
      lat: 37.4186206,
      lon: -122.0785253
    },
    {
      name: "Sableye",
      lat: 24.546113,
      lon: -81.799090
    },
    {
      name: "Mawile",
      lat: 3.1287609,
      lon: 101.6903888
    },
    {
      name: "Aggron",
      lat: 14.5848528,
      lon: 120.9927898
    },
    {
      name: "Plusle",
      lat: 39.05071,
      lon: -84.429922
    },
    {
      name: "Minun",
      lat: 46.216623,
      lon: 6.044694
    },
    {
      name: "Wailord",
      lat: 55.692623,
      lon: 12.599990
    },
    {
      name: "Milotic",
      lat: 37.7196835,
      lon: -122.4936721
    },
    {
      name: "Kecleon",
      lat: 41.840593,
      lon: -87.697535
    },
    {
      name: "Banette",
      lat: -0.583031,
      lon: -90.163476
    },
    {
      name: "Absol",
      lat: 39.902905,
      lon: -75.186001
    },
    {
      name: "Salamence",
      lat: 37.4258428,
      lon: -122.0709862
    },
    {
      name: "Metagross",
      lat: 37.4239973,
      lon: -122.0924808
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