// The CSS class names used to display each card symbol type
const symbolClasses = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

class Card {
    // symbol: this CSS class name to display the symbol for this card
    //         (excluding the "fa-" prefix)
    constructor(symbol) {
        this.symbol = symbol;
        this.matched = false;
    }
}

class GameState {
    constructor(previousSession) {
        // Create two of each type of card and put them in an array
        const cardSymbols = symbolClasses.concat(symbolClasses);
        this.cards = [];
        for (const cardSymbol of cardSymbols) {
            this.cards.push(new Card(cardSymbol));
        }

        this.moveCount = 0; // Number of opened pairs. Uncovering 2 cards counts as one move
        this.matchCount = 0; // Number of matched pairs. Each pair adds 1 to this value
        this.session = previousSession + 1; // checking session number ensures that timer events
                                            // from one session to avoid bleeding into the next one
        this.timePassed = 0;
        this.openedCards = []; // cards currently uncovered (but not yet matched) by the user
        this.cardsEnabled = true; // clicking on cards is disabled while an animation is playing
        shuffle(this.cards);
    }

    isWon() {
        return this.matchCount >= this.cards.length / 2;
    }
}

// Completes operations that should take place after the animation for closing
// an opened pair of cards is complete
function completeClosedCards() {
    for (const cardIndex of game.openedCards) {
        const openCard = document.querySelector('#card-' + cardIndex);
        openCard.classList.remove('show');
        openCard.classList.remove('close');
    }
    game.openedCards = [];
    refreshScorePanel();
    game.cardsEnabled = true;
}

// Begins the animations for hiding an unmatched pair of cards once they have been shown to the player
function hideOpenedCards() {
    for (const cardIndex of game.openedCards) {
        const openCard = document.querySelector('#card-' + cardIndex);
        openCard.classList.remove('open');
        openCard.classList.add('close');
    }
    // hiding animation takes 200ms to complete, so set a timeout to complete the animation and re-enable card interactions then
    setTimeout(function () {completeClosedCards();}, 200);
}

// Check whether this game sets a new best score for fewest moves,
// and update displays on the congrats panel to reflect this
function recordFewestMoves() {
    const previousFewestMoves = window.localStorage.getItem('FewestMoves');

    if (previousFewestMoves != null) {
        document.querySelector('.fewest-moves-previous-message').classList.remove('disabled');
        document.querySelector('.previous-fewest-moves').textContent = previousFewestMoves;
    }
    else {
        // Don't display info about best scores if there are no previous games recorded
        document.querySelector('.fewest-moves-previous-message').classList.add('disabled');
    }

    if (previousFewestMoves == null || previousFewestMoves > game.moveCount) {
        document.querySelector('.fewest-moves-new-message').classList.remove('disabled');
        window.localStorage.setItem('FewestMoves', game.moveCount);
    }
    else {
        document.querySelector('.fewest-moves-new-message').classList.add('disabled');
    }
}

// Check whether this game sets a new best score for fastest time,
// and update displays on the congrats panel to reflect this
function recordFastestTime() {
    const previousFastestTime = window.localStorage.getItem('FastestTime');

    if (previousFastestTime != null) {
        document.querySelector('.fastest-time-previous-message').classList.remove('disabled');
        document.querySelector('.previous-fastest-time').textContent = previousFastestTime;
    }
    else {
        // Don't display info about best scores if there are no previous games recorded
        document.querySelector('.fastest-time-previous-message').classList.add('disabled');
    }

    if (previousFastestTime == null || previousFastestTime > game.timePassed) {
        document.querySelector('.fastest-time-new-message').classList.remove('disabled');
        window.localStorage.setItem('FastestTime', game.timePassed);
    }
    else {
        document.querySelector('.fastest-time-new-message').classList.add('disabled');
    }
}

// Check whether this game sets any new best scores,
// and update displays on the congrats panel to reflect this
function recordBestScore() {
    recordFewestMoves();
    recordFastestTime();
}

// More readable function for displaying the congrats panel
function showCongratsPanel() {
    document.querySelector('.congrats-panel').classList.add('enabled');
}

// More readable function for hiding the congrats panel
function hideCongratsPanel() {
    document.querySelector('.congrats-panel').classList.remove('enabled');
}

// Handles the changes in game state and display when two cards are matched
function handleMatch() {
    for (const cardIndex of game.openedCards) {
        game.cards[cardIndex].matched = true;
        const openCard = document.querySelector('#card-' + cardIndex);
        openCard.classList.add('match');
        openCard.classList.remove('open');
    }
    game.openedCards = [];
    game.cardsEnabled = true;
    game.matchCount++;
    refreshScorePanel();
    if (game.isWon()) {
        recordBestScore();
        showCongratsPanel();
    }
}

// Handles the changes in display when two cards are shown but unmatched
function handleNonMatch() {
    // pause for 1 second to display the symbol, so set a timeout to complete the animation and hide the cards then
    setTimeout(hideOpenedCards, 1000);
}

// Check whether there are two currently shown cards and, if so,
// call the appropriate handler depending on whether they are matched or not
function checkForMatch() {
    if (game.openedCards.length == 2) {
        game.moveCount++;
        if (game.cards[game.openedCards[0]].symbol == game.cards[game.openedCards[1]].symbol) {
            handleMatch();
        }
        else {
            handleNonMatch();
        }
    }
    else {
        // Card interations were disabled during the opening animation
        // here it is know only one card is displayed so we can enable clicking on other cards
        game.cardsEnabled = true;
    }
}

// Refresh the display on all time counters
function refreshTimeCounters() {
    const timeCounters = document.querySelectorAll('.time');
    for (const timeCounter of timeCounters) {
        timeCounter.textContent = game.timePassed;
    }
}

// Refresh the display on all move counters
function refreshMoveCounters() {
    const moveCounters = document.querySelectorAll('.moves');
    for (const moveCounter of moveCounters) {
        moveCounter.textContent = game.moveCount;
    }
}

// Refresh all displays of stars
function refreshStars() {
    const starCount = (game.moveCount < 20 ? 3 : (game.moveCount < 30 ? 2 : 1));
    const starContainers = document.querySelectorAll('.stars');
    // Apply the same code to the main game stars and the congrats panel stars
    for (const stars of starContainers) {
        // if too few stars, add more until we have enough
        while (stars.children.length < starCount) {
            const star = document.createElement('li');
            const starSymbol = document.createElement('i');
            starSymbol.classList.add('fa');
            starSymbol.classList.add('fa-star');
            star.appendChild(starSymbol);
            stars.appendChild(star);
        }
        // if too many stars, remove until we have the right number
        while (stars.children.length > starCount) {
            stars.firstChild.remove();
        }
    }
}

// Refresh the score panel (this will also automatically refresh the corresponding parts of the congrats panel)
function refreshScorePanel() {
    refreshMoveCounters();
    refreshTimeCounters();
    refreshStars();
}

// To be run when a card is clicked on, handles the logic of whether that card should be turned over
// and begins the opening animation if that is so
function cardListener(evt) {
    if (!game.cardsEnabled || game.isWon()) return;
    const card = evt.currentTarget;
    const index = card.id.split('-')[1];
    if (game.cards[index].matched) return;
    if (game.openedCards.includes(index)) return;
    card.classList.add('show');
    card.classList.add('open');
    game.openedCards.push(index);
    game.cardsEnabled = false;
    // pause for 200ms for the animation, so set a timeout to handle match logic then
    setTimeout(function() {checkForMatch();}, 200);
}

// Look for all cards and add event listeners to them so that they function properly when clicked
function resetCardListeners() {
    const cards = document.querySelectorAll('.card-display');
    for(const card of cards) {
        card.addEventListener('click', cardListener);
    }
}

// Look for all elements that restart the game and add listeners to them so that they function properly when clicked
function resetRestartListeners() {
    const restartButtons = document.querySelectorAll('.restart');
    for(const restartButton of restartButtons) {
        restartButton.addEventListener('click', restartGame);
    }
}

// Increment the timer by one second if it is active, then set a timeout to repeat after one more second
function incrementTimer(session) {
    if (session == game.session && !game.isWon()) {
        game.timePassed++;
        refreshTimeCounters();
        // the extra function syntax is required otherwise this calls immediately causing a stack overflow
        setTimeout(function() {incrementTimer(session)}, 1000);
    }
}

// Creates the HTML elements for the cards of the game and place them in the appropriate parent element
function createGameElements() {
    const deck = document.querySelector('.deck');
    while (deck.firstChild) {
        deck.firstChild.remove();
    }
    for (let i=0; i<game.cards.length; ++i) {
        const card = document.createElement('li');
        card.classList.add('card');
        const cardDisplay = document.createElement('div');
        cardDisplay.classList.add('card-display');
        cardDisplay.id = 'card-' + i;
        const symbol = document.createElement('i');
        symbol.classList.add('fa');
        symbol.classList.add('fa-' + game.cards[i].symbol);
        cardDisplay.appendChild(symbol);
        card.appendChild(cardDisplay);
        deck.appendChild(card);
    }
}

// Do everything to restart the game regardless of the current state
function restartGame() {
    // Just discard the old game state and create a new one from scratch
    // to prevent anything from the old game leaking into the new one
    // The constructor of GameState does all the logic needed for this
    game = new GameState(game.session);

    createGameElements();
    hideCongratsPanel(); // If we restarted from the congrats panel then it need to be hidden
    setTimeout(function() {incrementTimer(game.session)}, 1000); // Start the timer
    refreshScorePanel();
    resetCardListeners(); // createGameElements destroyed the old card listeners so we need to create them again
}

let game = new GameState(0);
restartGame();
game.session = 0; // just in case we actually use the absolute number some day
resetRestartListeners();