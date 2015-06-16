Sources
=======

There were many different examples that I found as I looked around the web for help throughout building the Google PokéMap project. I'd like to share where I found things I didn't really know or think to try. It gives some credit out there, and it makes a nice collection of helpful links for me and maybe others.


Positioning
-----------

Mixing relative and absolute positioning is a handy way to position certain elements, and it's thanks to this [Stack Overflow thread](https://stackoverflow.com/questions/6040005/relatively-position-an-element-without-it-taking-up-space-in-document-flow) that I learned about it.

[Another one](https://stackoverflow.com/questions/7273338/how-to-vertically-align-an-image-inside-div) was helpful for a different way of vertical alignment. Although I tried the answer with two inline-block elements initially, it was centering with line-height that really did the trick for what I ended up doing.


Working Knockout in with the Search Box
---------------------------------------

A [Stack Overflow thread](https://stackoverflow.com/questions/9543304/knockout-js-input-box-event-change-passes-old-value) helped me figure this out. Not only did it point out the textInput binding, but it showed me that I needed to subscribe to the observable that held the input text. In this way, every time the input text changed, the search was triggered.


Knockout + Info Window
----------------------

I wasn't sure if working in Knockout with Google's info windows was possible. Then I found [Google Maps InfoWindow With Knockout](http://techcrawler.riedme.de/2012/09/14/google-maps-infowindow-with-knockout/). It's a few years old, but after replacing the Knockout file in the given JSfiddle, I really started making progress.


Pure JavaScript Ajax
--------------------

I wanted to avoid jQuery if I could help it in this project. I have nothing against jQuery, but I wanted one less file to load, and I kind of wanted to understand how to do things in more pure JavaScript. The three links below were really helpful in figuring out what to do.

 * [Native JavaScript Equivalents of jQuery Methods: Events, Ajax and Utilities (Part 2)](http://www.sitepoint.com/jquery-vs-raw-javascript-3-events-ajax/)
 * [New Tricks in XMLHttpRequest2](http://www.html5rocks.com/en/tutorials/file/xhr2/)
 * [Ajax (XMLHttpRequest object)](http://www.javascriptkit.com/jsref/ajax.shtml)


Checking Variable Existance
---------------------------

Trying to figure out how to check if a variable exists or not without triggering an error is tricky. Fortunately, [Stack Overflow](https://stackoverflow.com/questions/5113374/javascript-check-if-variable-exists-is-defined-initialized-which-method-is-b) was there to help with that, too.


Bounce Marker Once
------------------

Getting a map marker to bounce only one time is a little trickier than it sounds. Once again, [StackOverflow](https://stackoverflow.com/questions/7339200/bounce-a-pin-in-google-maps-once) to the rescue!


Spinning Object
---------------

Once more, [Stack Overflow](https://stackoverflow.com/questions/14859322/css3-spin-animation) provided me with the way to make something spin with CSS3.

Meowstic Image
--------------

I'll give thanks to [Pokémon Database](http://pokemondb.net/) for the image I needed of the female Meowstic. It was just the right size, fitting what PokéAPI seemed to use. It's definitely a site I want to remember for the future.