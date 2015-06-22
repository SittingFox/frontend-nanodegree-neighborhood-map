Google PokéMap
=================

For April Fools of 2014, [Google challenged](https://www.youtube.com/watch?v=4YMD6xELI_k) iPhone and Android users to find 150 Pokémon that were hidden all across its map.

This Google PokéMap shows a compilation of locations put together by [users on Reddit](https://www.reddit.com/r/pokemon/comments/21ub4t/google_maps_pokemon_list_where_to_find_them/), from a list that contained only one position per Pokémon. The displayed data for each Pokémon is from the [PokéAPI](http://pokeapi.co/).


How to Use?
-----------

Open index.html in your browser. You will be greeted with a Google map aimed at the Googleplex in California, which was one of the designated Pokémon Labs in the prank. Near there, and in many different places around the world, you will find clickable markers that give data for each Pokémon.

On the left, you will find a list of the 150 Pokémon chosen by Google. Clicking on an item in this list with jump you to the marker of the Pokémon in question. This list is viewable on mobile through the use of the menu button that will appear in the upper right corner on smaller screens. There is also a search box above this list that can filter the list of Pokémon.


Tools
-----

* KnockoutJS is used for MVVM implementation.
* Bower is used for keeping the latest Knockout.
* Grunt is used (with grunt-shell) to update Bower and (with grunt-bower) to put Bower components in the right place.
