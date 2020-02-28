# Project Features

This project has been created to fulfil the requirements of the Udacity Memory Game Project specification, as well as some additional features detailed below.

## Required Features

* The game displays a memory game with 16 cards arranged face down in a 4x4 grid.
* The player clicks pairs of cards to reveal the symbols on them. If the cards have the same symbol, then they remain face up, otherwise they are turned back over. The player may then click another pair of cards.
* The number of moves (turning over a pair of cards counts as one move) is counted and displayed.
* The time taken in the current session is also measured and displayed. (This includes any time before the player turns over the first card.)
* A star rating gives an indication of a player's performance. This starts at 3 stars and then reduces to 2 stars once 20 moves have been made, and 1 star once 30 moves have been made.
* A restart button will completely reset the game to its initial state when clicked.
* If the player has matched all cards, then a panel is displayed congratulating the player and displaying again the number of moves, time taken, and star rating (as above). This also gives the player the option to restart the game.

## Additional Features

* Animations are displayed for revealing a card, turning cards back over if unmatched, and a special animation if the cards are matched. The former two prevent other card animations while the cards are animating, but players may continue turning cards over immediately after revealing a matching pair (by design).
* Local storage is used to record best scores for the game. Separate counters for least moves and fastest time to complete are maintained. The best scores are displayed on the congratulations panel and the player is told if either or both scores beat the previous best score (with handling for when there is not previous best score).

# Contained Files

The project should contain the following other files:
* index.html - containing the HTML for general structure, text content, viewport settings and imported stylesheets
* css\app.css - containing CSS for styling game elements including animations
* js\app.js - contains the Javascript that defines the game logic as well as creating and assigning dynamic HTML elements
* img\geometry2.png - contains the subtle background for the page outside of the grid of cards (provided by Udacity)

The project has the following external dependencies (given also in index.html):
* https://maxcdn.bootstrapcdn.com/font-awesome/4.6.1/css/font-awesome.min.css - provides symbols for the cards and restart buttons
* https://fonts.googleapis.com/css?family=Coda - provides the "Coda" font used across the project apart from the main heading.