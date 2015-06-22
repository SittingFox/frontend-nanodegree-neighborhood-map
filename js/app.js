/**
 * Creates interactive Google PokeMap, with list and search box, using data
 * collected by Reddit users during Google's 2014 April Fools' Day challenge.
 * @author SittingFox
 * @required knockout.js
 */

(function() {

  "use strict";


  /**
   * The Model is the holder of data
   * @type {Object}
   */
  var Model = {
    // Making URLs easy to access
    apiBaseURL: "http://pokeapi.co",
    apiPokemonSearchURL: "http://pokeapi.co/api/v1/pokemon/",
    markerImage: "img/PokeMarker.png",
    streetViewURL: "http://maps.googleapis.com/maps/api/streetview?size=200x201&location=",

    // Knockout can know when allPokemon is updated
    allPokemon: ko.observableArray(),

    /**
     * Filling allPokemon with an array of objects carrying map markers.
     */
    init: function () {
      var self = this;

      var pokemon;

      /**
       * Create Pokemon object from each data item and add it to allPokemon
       * array.
       * @param {Object} data - Object containing Pokemon name, latitude, and
       *                        longitude
       * @param {Number} index - Index of data in array, used to calculate each
       *                         Pokemon's Google PokeDex number
       */
      self.pokemonData.forEach( function(data, index) {
        pokemon = new self.Pokemon(data,
                                   index+1,
                                   PokeMapViewModel.map,
                                   self.streetViewURL,
                                   self.markerImage,
                                   function(thisPokemon) {
          self.onMarkerClick(thisPokemon);
        });

        self.allPokemon.push(pokemon);
      });

    },

    /**
     * Pokemon prototype that carries markers and other data for each Pokemon.
     * It makes it easier to interact and manipulate markers.
     * @param {Object} pokemon - Pokemon data, holding a name and map
     *                           coordinates
     * @param {Number} number - Number ascribed to the particular Pokemon
     * @param {google.maps.Map} map - The Google Map in use
     * @param {String} streetViewURL - URL used for getting street view image
     * @param {String} markerImage - URL for setting marker image
     * @param {Function} onClick - Handling what happens on click of marker
     */
    Pokemon: function( pokemon,
                       number,
                       map,
                       streetViewURL,
                       markerImage,
                       onClick) {

      var self = this;

      self.map = map;
      self.name = pokemon.name;
      self.number = number;
      self.position = new google.maps.LatLng(pokemon.lat, pokemon.lon);
      self.streetView = streetViewURL + pokemon.lat + "," + pokemon.lon;
      self.isVisible = ko.observable(true);

      self.stats = ko.observableArray();
      self.image = ko.observable("");
      self.description = ko.observable("");
      self.hasData = ko.pureComputed(function() {
        return self.stats().length !== 0 &&
               self.image() !== "";
      });

      // Create marker
      self.marker = new google.maps.Marker({
        icon: markerImage,
        map: self.map,
        position: self.position,
        title: self.name
      });

      // Show marker on map and let Knockout know to show it, too.
      self.show = function() {
        self.marker.setVisible(true);
        self.isVisible(true);
      };

      // Hide marker on map and let Knockout know to hide it, too.
      self.hide = function() {
        self.marker.setVisible(false);
        self.isVisible(false);
      };

      // Make marker bounce once
      self.bounce = function() {
        self.marker.setAnimation(google.maps.Animation.BOUNCE);

        // Limit bounce to one time (750ms)
        setTimeout(function() {
          self.marker.setAnimation(null);
        }, 750);
      };

      // Listen for marker clicks, calling onClick when it happens
      google.maps.event.addListener(self.marker, 'click', function() {
        onClick(self);
      });

    }, // end of Pokemon

    /**
     * What happens when the marker is clicked.
     * @param {Pokemon} pokemon - Pokemon object that was clicked on.
     */
    onMarkerClick: function(pokemon) {
      PokeMapViewModel.onMarkerClick(pokemon);
      pokemon.bounce();
      PokeMapViewModel.errorLoad(false);

      if (!pokemon.hasData()) {
        Model.getData(pokemon);
      }
    },

    /**
     * Searches all Pokemon names for matching text, hiding and showing as
     * needed.
     * @param {String} text - Search query
     */
    search: function (text) {
      var self = this;

      var textLowerCase = text.toLowerCase();
      var nameLowerCase;


      /**
       * Show and hide Pokemon depending on search term.
       * @param {Pokemon} pokemon - Single instance from allPokemon
       */
      self.allPokemon().forEach( function(pokemon) {
        nameLowerCase = pokemon.name.toLowerCase();

        // Empty search lists all Pokemon, and indexOf is browser universal
        if ( textLowerCase === "" ||
             nameLowerCase.indexOf(textLowerCase) !== -1 ) {
          pokemon.show();
        } else {
          pokemon.hide();
        }

      });
    },

    /**
     * Retrieves data from PokeAPI for given Pokemon object, making use of
     * functions housed within it that have no use outside of it.
     * @param {Pokemon} pokemon - Pokemon to get data for
     */
    getData: function(pokemon) {
      /**
       * Makes requests for JSON with AJAX, without using jQuery.
       * @param {String} url - The URL address to send the request to
       * @param {Function} callback - The function to call if data is
       *                              successfully retrieved
       * @param {Function} errorHandler - The function to call if retrieval is
       *                                  unsuccessful
       */
      function getJSON(url, callback, errorHandler) {
        var request = new XMLHttpRequest();
        request.open("GET", url, true);

        /**
         * This is called throughout the data retrieval process. Once the
         * request is complete (4), check if the status is OK (200) and act
         * accordingly.
         */
        request.onreadystatechange = function() {
          if (request.readyState == 4) {
            if (request.status == 200) {
              var data = JSON.parse(request.response);
              callback(data);
            } else {
              errorHandler();
            }
          }
        };

        request.send();

      } // end of getJSON

      /**
       * Initial callback that begins the chain for getting and setting data
       * from the PokeAPI.
       * @param {Object} data - JSON retrieved from PokeAPI
       */
      function setupChain(data) {
        setStats(data);
        chainToSprite(data);
        chainToDescription(data);
      }

      /**
       * Sets up Pokemon's stats and continues data-fetching chain
       * to setupimages and description.
       * @param {Object} data - JSON retrieved from PokeAPI
       */
      function setStats(data) {

        var statsData = [
          {
            name: "HP",
            value: data.hp
          },
          {
            name: "Atk",
            value: data.attack
          },
          {
            name: "Def",
            value: data.defense
          },
          {
            name: "SpA",
            value: data.sp_atk
          },
          {
            name: "SpD",
            value: data.sp_def
          },
          {
            name: "Spe",
            value: data.speed
          }
        ];

        pokemon.stats(statsData);

      } // end of setupStats

      /**
       * Next in chain, aiming to help set the sprite image for the Pokemon.
       * @param {Object} data - JSON retrieved from PokeAPI
       */
      function chainToSprite(data) {
        /*
         * Making sure this is not the single case where I manually provide the
         * image.
         */
        if ( pokemon.name == "Meowstic (Female)") {
          pokemon.image("img/meowstic-female.png");
        } else {
          // Use last image in list
          var spritesData = data.sprites.shift();
          var url = Model.apiBaseURL + spritesData.resource_uri;

          getJSON(url, setSprite, errorLoad);
        }
      }

      /**
       * Callback function that sets Pokemon's sprite image.
       * @param {Object} data - Image JSON retrieved from PokeAPI
       */
      function setSprite(data) {
        var url = Model.apiBaseURL + data.image;

        pokemon.image(url);
      }

      /**
       * Last in chain, aiming to help set the description text for the Pokemon.
       * @param {Object} data - JSON retrieved from PokeAPI
       */
      function chainToDescription(data) {
        var allDescriptions = data.descriptions;
        var descriptionURI = chooseDescription(allDescriptions);
        var descriptionURL = Model.apiBaseURL + descriptionURI;

        getJSON(descriptionURL, setDescription, errorLoad);
      }

      /**
       * Chooses one description URI from the list to be used.
       * @param  {Array} allDescriptions - Array of description JSONs
       * @return {String} - URI for getting description
       */
      function chooseDescription(allDescriptions) {
        var descriptionURI;

        /**
         * Gets a description from either Pokemon Generation 5 or 6, which are
         * the newer sets of games. Not all Pokemon have Generation 6
         * descriptions.
         * @param {Object} entry - Description URI JSON object retrieved from
         *                         PokeAPI
         */
        allDescriptions.forEach( function(entry) {
          if (entry.name[entry.name.length - 1] == "5" ||
            entry.name[entry.name.length - 1] == "6") {

            descriptionURI = entry.resource_uri;
          }
        });

        return descriptionURI;
      }

      /**
       * Callback function that sets Pokemon's description
       * @param {Object} data - JSON retrieved from PokeAPI
       */
      function setDescription(data) {
        var description = data.description;
        var newDescription = cleanDescription(description);

        pokemon.description(newDescription);
      }

      /**
       * This is an attempt to fix a handful of errors found in multiple
       * descriptions.
       * @param  {String} oldDescription - Original description from PokeAPI
       * @return {String} - Improved description
       */
      function cleanDescription(oldDescription) {
        var newDescription = oldDescription;

        newDescription = newDescription.replace("cant", "can't");
        newDescription = newDescription.replace("isnt", "isn't");
        newDescription = newDescription.replace("Pokmons", "Pokémon's");
        newDescription = newDescription.replace(/Pokmon/g, "Pokémon");
        newDescription = newDescription.replace("wont", "won't");

        return newDescription;
      }

      // Error handling function that informs View Model of issues
      function errorLoad() {
        PokeMapViewModel.errorLoad(true);
      }

      /**
       * Makes a version of the Pokemon's name that works for searching PokeAPI.
       * @return {String} finalName - Correctly stylized version of Pokemon's
       *                              name
       */
      function getStyleName() {
        var nameLowerCase = pokemon.name.toLowerCase();
        var spaceLocation = nameLowerCase.indexOf(" ");

        var finalName;
        if (spaceLocation !== -1) {
          /**
           * Some Pokemon come in a male and female variety. The PokeAPI seems
           * to not list all the data for female Pokemon for some reason, so
           * just go for male data.
           */
          finalName = nameLowerCase.slice(0, spaceLocation) +
                      "-male";
        } else if (nameLowerCase == "pumpkaboo") {
          /**
           * The Pokemon Pumpkaboo has varying data depending on the size, and
           * the PokeAPI requires the size to be attached. Just going to go with
           * the regular size.
           */
          finalName = nameLowerCase + "-average";
        } else {
          finalName = nameLowerCase;
        }

        return finalName;
      }

      var apiStyleName = getStyleName();
      var url = Model.apiPokemonSearchURL + apiStyleName;
      getJSON(url, setupChain, errorLoad);

    }, // end of getData

    // 150 Pokemon, each with a name and lattitude and longitude coordinates
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
      },
      // Sinnoh Pokemon
      {
        name: "Turtwig",
        lat: -2.254174,
        lon: -63.154450
      },
      {
        name: "Grotle",
        lat: 35.642969,
        lon: 139.860028
      },
      {
        name: "Torterra",
        lat: 35.651249,
        lon: 139.725142
      },
      {
        name: "Chimchar",
        lat: -3.066481,
        lon: 37.350596
      },
      {
        name: "Monferno",
        lat: 35.734683,
        lon: 139.713044
      },
      {
        name: "Infernape",
        lat: 35.6315433,
        lon: 139.7557322
      },
      {
        name: "Piplup",
        lat: 37.721917,
        lon: -122.378945
      },
      {
        name: "Prinplup",
        lat: -0.865837,
        lon: -90.776599
      },
      {
        name: "Empoleon",
        lat: 37.779914,
        lon: -122.514286
      },
      {
        name: "Staraptor",
        lat: -13.163890,
        lon: -72.544545
      },
      {
        name: "Luxray",
        lat: 37.420312,
        lon: -122.084249
      },
      {
        name: "Combee",
        lat: 40.107508,
        lon: -88.229983
      },
      {
        name: "Pachirisu",
        lat: 37.4142731,
        lon: -122.0774098
      },
      {
        name: "Buizel",
        lat: 37.437396,
        lon: -122.092515
      },
      {
        name: "Buneary",
        lat: 40.690164,
        lon: -74.047004
      },
      {
        name: "Chatot",
        lat: -33.856537,
        lon: 151.210992
      },
      {
        name: "Spiritomb",
        lat: 48.8334431,
        lon: 2.3320277
      },
      {
        name: "Garchomp",
        lat: 25.729945,
        lon: 32.613596
      },
      {
        name: "Munchlax",
        lat: 40.7483136,
        lon: -73.9868667
      },
      {
        name: "Lucario",
        lat: 27.180284,
        lon: 78.039364
      },
      {
        name: "Croagunk",
        lat: 35.6575094,
        lon: 139.7324691
      },
      {
        name: "Leafeon",
        lat: 35.644504,
        lon: 139.681716
      },
      {
        name: "Glaceon",
        lat: 27.986182,
        lon: 86.921478
      },
      {
        name: "Mamoswine",
        lat: 50.058242,
        lon: -122.968599
      },
      {
        name: "Rotom",
        lat: 42.2255805,
        lon: -83.2685609
      },
      // Unova Pokemon
      {
        name: "Snivy",
        lat: 31.785038,
        lon: 35.234088
      },
      {
        name: "Servine",
        lat: 51.477368,
        lon: 0.002293
      },
      {
        name: "Serperior",
        lat: 40.781520,
        lon: -73.966956
      },
      {
        name: "Tepig",
        lat: 44.8423945,
        lon: -0.5768001
      },
      {
        name: "Pignite",
        lat: 35.028292,
        lon: -111.018525
      },
      {
        name: "Emboar",
        lat: 31.757670,
        lon: -102.487883
      },
      {
        name: "Oshawott",
        lat: 42.2255805,
        lon: -83.2685609
      },
      {
        name: "Dewott",
        lat: 43.0792757,
        lon: -79.0791173
      },
      {
        name: "Samurott",
        lat: 46.2008415,
        lon: 6.0374643
      },
      {
        name: "Munna",
        lat: 40.756468,
        lon: -73.965881
      },
      {
        name: "Pidove",
        lat: 61.167919,
        lon: -150.037679
      },
      {
        name: "Audino",
        lat: 25.197462,
        lon: 55.2707856
      },
      {
        name: "Scraggy",
        lat: 37.8274658,
        lon: -122.4245827
      },
      {
        name: "Cofagrigus",
        lat: 45.514651,
        lon: 25.369125
      },
      {
        name: "Zoroark",
        lat: 20.214570,
        lon: -87.431663
      },
      {
        name: "Minccino",
        lat: 48.854179,
        lon: 2.354344
      },
      {
        name: "Deerling",
        lat: 35.659139,
        lon: 139.731536
      },
      {
        name: "Emolga",
        lat: 37.4239864,
        lon: -122.0723723
      },
      {
        name: "Joltik",
        lat: 37.421838,
        lon: -122.081792
      },
      {
        name: "Ferrothorn",
        lat: 35.750357,
        lon: 139.739954
      },
      {
        name: "Chandelure",
        lat: 37.240941,
        lon: -115.812198
      },
      {
        name: "Haxorus",
        lat: -33.842677,
        lon: 151.241313
      },
      {
        name: "Cubchoo",
        lat: 51.413841,
        lon: -116.226328
      },
      {
        name: "Stunfisk",
        lat: -3.065049,
        lon: 37.360800
      },
      {
        name: "Hydreigon",
        lat: 48.861157,
        lon: 2.335196
      },
      // Kalos Pokemon
      {
        name: "Chespin",
        lat: 35.677922,
        lon: 139.625982
      },
      {
        name: "Quilladin",
        lat: 42.2255805,
        lon: -83.2685609
      },
      {
        name: "Chesnaught",
        lat: 51.535224,
        lon: -0.156110
      },
      {
        name: "Fennekin",
        lat: -54.8073269,
        lon: -68.3172146
      },
      {
        name: "Braixen",
        lat: 31.599485,
        lon: 130.657665
      },
      {
        name: "Delphox",
        lat: 35.860732,
        lon: 139.643266
      },
      {
        name: "Froakie",
        lat: 21.273406,
        lon: -157.824015
      },
      {
        name: "Frogadier",
        lat: 36.112282,
        lon: -115.174141
      },
      {
        name: "Greninja",
        lat: -0.672175,
        lon: -90.545304
      },
      {
        name: "Bunnelby",
        lat: 35.659634,
        lon: 139.722917
      },
      {
        name: "Talonflame",
        lat: 35.6576461,
        lon: 139.7574488
      },
      {
        name: "Gogoat",
        lat: 35.6050551,
        lon: 140.1051944
      },
      {
        name: "Pancham",
        lat: 37.4167088,
        lon: -122.086735
      },
      {
        name: "Meowstic (Male)",
        lat: 37.427826,
        lon: -122.0796787
      },
      {
        name: "Meowstic (Female)",
        lat: 37.3323955,
        lon: -122.032412
      },
      {
        name: "Aegislash",
        lat: 39.1006119,
        lon: -94.5584363
      },
      {
        name: "Spritzee",
        lat: 33.810635,
        lon: -117.922689
      },
      {
        name: "Swirlix",
        lat: 53.3425029,
        lon: -6.274575
      },
      {
        name: "Inkay",
        lat: 43.2626114,
        lon: -2.9353935
      },
      {
        name: "Helioptile",
        lat: 37.3310019,
        lon: -122.0296628
      },
      {
        name: "Sylveon",
        lat: 45.4469363,
        lon: 12.3472392
      },
      {
        name: "Dedenne",
        lat: 42.377003,
        lon: -71.11666
      },
      {
        name: "Goodra",
        lat: 37.8201487,
        lon: -122.3689871
      },
      {
        name: "Pumpkaboo",
        lat: -33.848556,
        lon: 151.17282
      },
      {
        name: "Noivern",
        lat: 0.8072649,
        lon: -176.6176798
      }
    ] // end of pokemonData

  }; // end of model


  /**
   * Knockout ViewModel configuration
   * Controlling interactions between the Model and View
   */
  var PokeMapViewModel = {
    init: function() {
      var self = this;

      // Observables
      self.currentPokemon = ko.observable();
      self.searchText = ko.observable();
      self.errorLoad = ko.observable(false);

      // Retrieves allPokemon from Model to use in View
      self.getPokemon = ko.pureComputed(function() {
        return Model.allPokemon();
      });

      /**
       * On change of search text, perform a search.
       * @param {String} newValue) - The new, current string in the search box
       */
      self.searchText.subscribe( function (newValue) {
        self.search(newValue);
      });

      // Important booleans
      self.isGoogleWorking = (typeof google !== 'undefined');
      self.isInfoWindowLoaded = false;


      /**
       * Creates Google Map.
       * @return {google.maps.Map} - Instance of Google Map object
       */
      function mapInitialize() {
          var mapElement = document.getElementsByClassName('map-canvas')[0];
          var googleplex = new google.maps.LatLng(37.422,-122.084058);
          var mapOptions = {
            center: googleplex,
            disableDefaultUI: true,
            zoom: 17
          };

          return ( new google.maps.Map(mapElement, mapOptions) );
      }

      /**
       * Setup single info window to be used throughout map.
       * @return {google.maps.InfoWindow} - Instance of info window object
       */
      function infoWindowInitialize() {
        var infoWindowHTML = self.getInfoWindowView();

        var infoWindow = new google.maps.InfoWindow({content: infoWindowHTML});

        // Apply Knockout bindings to info window content when it's available.
        google.maps.event.addListener(infoWindow, 'domready', function () {
          if (!self.isInfoWindowLoaded)
          {
            var infoWindowElement = document.getElementsByClassName('info-window')[0];
            ko.applyBindings( self, infoWindowElement );
            self.isInfoWindowLoaded = true;
          }
        });

        return infoWindow;
      }

      // Make view-related items easily accessible
      function viewItemsInitialize() {
        self.drawer = document.getElementsByClassName('drawer')[0];
        self.modal = document.getElementsByClassName('modal')[0];
        self.scrollBox= document.getElementsByClassName('location-holder')[0];
      }


      // Initializing based on if Google Maps API has loaded
      if ( self.isGoogleWorking ) {
        self.map = mapInitialize();
        self.infoWindow = infoWindowInitialize();
        viewItemsInitialize();
        Model.init();
      }

      ko.applyBindings(self);

    }, // end of init

    /**
     * Searches all Pokemon names for matching text, hiding and showing as
     * needed.
     * @param {String} text - Search query
     */
    search: function (text) {
      var self = this;

      self.resetListScroll();
      Model.search(text);
    },

    /**
     * What happens when the marker is clicked.
     * @param {Pokemon} pokemon - Pokemon object that was clicked on
     */
    onMarkerClick: function(pokemon) {
      var self = this;

      self.hideDrawer();
      self.map.panTo(pokemon.position);

      /**
       * Show info window before changing currentPokemon, else lose Knockout
       * bindings and leave contents stuck
       */
      self.displayInfoWindow(pokemon.marker);
      self.currentPokemon(pokemon);

    },

    /**
     * Makes lone info window pop show up at the given marker.
     * @param {google.maps.Marker} marker - The marker to show the info window
     *                                      at
     */
    displayInfoWindow: function (marker) {
      var self = this;
      self.infoWindow.open(self.map, marker);
    },

    /**
     * Triggers click on marker of clicked Pokemon list item.
     * @param {Pokemon} pokemon - The Pokemon associated with the clicked list
     *                            item.
     */
    onListClick: function(pokemon) {
      google.maps.event.trigger(pokemon.marker, 'click');
    },

    // Sets list of scroll back to the very top
    resetListScroll: function() {
      var self = this;
      self.scrollBox.scrollTop = 0;
    },

    // What happens when the hamburger/menu icon is clicked
    onHamburgerClick: function() {
      var self = this;

      if ( self.drawer.classList.contains('open') ) {
        self.resetListScroll();
      }

      self.toggleDrawer();
    },

    // Toggles opening and closing of drawer on button click
    toggleDrawer: function() {
      var self = this;
      self.drawer.classList.toggle('open');
    },

    /**
     * Hide drawer, called by certain clicks.
     */
    hideDrawer: function () {
      var self = this;
      self.drawer.classList.remove('open');
    },

    // Show the modal
    showModal: function() {
      var self = this;
      self.modal.classList.remove('hide');
    },

    // Hide the modal
    hideModal: function() {
      var self = this;
      self.modal.classList.add('hide');
    },

    /**
     * Generates three-digit version of given number, adjusting it into a string
     * if it doesn't already have three digits.
     * @param  {Number} number - Given number
     * @return {String or Number} - Three-digit version of number
     */
    formatNumber: function(number) {
      var formattedNumber;

      if (number < 10) {
        formattedNumber = "00" + number;
      } else if (number < 100) {
        formattedNumber = "0" + number;
      } else {
        formattedNumber = number;
      }

      return formattedNumber;
    },

    /**
     * Creates a string of the Pokemon's number plus it's name.
     * @param  {String} name - Pokemon's name
     * @param  {Number} number - Pokemon's Google PokeDex number
     * @return {String} - Combination of Pokemon's number and name
     */
    getLabel: function (name, number) {
      var self = this;
      var formattedNumber = self.formatNumber(number);

      return formattedNumber + " " + name;
    },

    /**
     * Retrieves HTML code meant to go inside the info window.
     * @return {String} - HTML code
     */
    getInfoWindowView: function () {
      var innerHTML =
        '<div class="info-window" ' +
          'data-bind="template: { name: \'iw-template\', data: currentPokemon }">' +
        '</div>';

      return innerHTML;
    },

    /**
     * Turns stat number into a percentage for calculating the size of the bar
     * of the div that represents the value.
     * @param  {String} stat - Number in string format, representing one of a
     *                         Pokemon's stats
     * @return {String} - Percentage for style
     */
    getStatPercentage: function(stat) {
      var maxStat = 255;
      var calcPercent = (stat / maxStat) * 100;

      return calcPercent + '%';
    },

    /**
     * Creates style code for displaying the street view image;
     * @param  {String} streetView - URL for street view image
     * @return {String} - Code for background-image
     */
    getStreetViewStyle: function(streetView) {
      return "url(" + streetView + ")";
    }

  }; // end of PokeMapViewModel


  // Initialize the whole thing
  PokeMapViewModel.init();

})();