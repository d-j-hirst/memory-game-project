/*
 * Create a list that holds all of your cards
 */


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

const symbolClasses = ['diamond','paper-plane-o','anchor','bolt','cube','leaf','bicycle','bomb'];
const defaultSymbolOrder = [0,1,2,3,4,2,5,6,0,7,5,7,3,6,1,4];

class GameState {
    constructor(previousSession) {
        this.currentSymbolOrder = defaultSymbolOrder;
        this.moveCount = 0;
        this.matchCount = 0;
        this.session = previousSession + 1; // checking session number ensures that timer events from one session so
                                            // not bleed into the next one
        this.timePassed = 0;
        this.openedCards = [];
        this.cardsEnabled = true; // clicking on cards is disabled while an animation is playing
        shuffle(this.currentSymbolOrder);
    }

    isWon() {
        return this.matchCount >= this.currentSymbolOrder.length / 2;
    }
}

let game = new GameState(0);

function hideOpenedCards() {
    for (const cardIndex of game.openedCards) {
        const openCard = document.querySelector('#card-' + cardIndex);
        openCard.classList.remove('show');
        openCard.classList.remove('open');
    }
    game.openedCards = [];
    refreshScorePanel();
    game.cardsEnabled = true;
}

function showCongratsPanel() {
    document.querySelector('.congrats-panel').classList.add('enabled');
}

function hideCongratsPanel() {
    document.querySelector('.congrats-panel').classList.remove('enabled');
}

function checkForMatch() {
    if (game.openedCards.length == 2) {
        game.moveCount++;
        if (game.currentSymbolOrder[game.openedCards[0]] == game.currentSymbolOrder[game.openedCards[1]]) {
            for (const cardIndex of game.openedCards) {
                const openCard = document.querySelector('#card-' + cardIndex);
                openCard.classList.add('match');
            }
            game.openedCards = [];
            game.matchCount++;
            refreshScorePanel();
            if (game.isWon()) {
                showCongratsPanel();
            }
        }
        else {
            game.cardsEnabled = false;
            setTimeout(hideOpenedCards, 1000);
        }
    }
}

function refreshTimeCounters() {
    const timeCounters = document.querySelectorAll('.time');
    for (const timeCounter of timeCounters) {
        timeCounter.textContent = game.timePassed;
    }
}

function refreshMoveCounters() {
    const moveCounters = document.querySelectorAll('.moves');
    for (const moveCounter of moveCounters) {
        moveCounter.textContent = game.moveCount;
    }
}

function refreshStars() {
    const starCount = (game.moveCount < 20 ? 3 : (game.moveCount < 30 ? 2 : 1));
    const stars = document.querySelector('.stars');
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

function refreshScorePanel() {
    refreshMoveCounters();
    refreshTimeCounters();
    refreshStars();
}

function cardListener(evt) {
    if (!game.cardsEnabled) return;
    const card = evt.currentTarget;
    if (card.classList.contains('open')) return;
    card.classList.add('show');
    card.classList.add('open');
    const index = card.id.split('-')[1];
    game.openedCards.push(index);
    checkForMatch();
}

function resetCardListeners() {
    const cards = document.querySelectorAll('.card');
    for(const card of cards) {
        card.addEventListener('click', cardListener);
    }
}

function incrementTimer(session) {
    if (session == game.session && !game.isWon()) {
        game.timePassed++;
        refreshTimeCounters();
        // the extra function syntax is required otherwise this calls immediately causing a stack overflow
        setTimeout(function() {incrementTimer(session)}, 1000);
    }
}

function restartGame() {
    game = new GameState(game.session);
    const deck = document.querySelector('.deck');
    while (deck.firstChild) {
        deck.firstChild.remove();
    }
    for (let i=0; i<16; ++i) {
        const card = document.createElement('li');
        card.classList.add('card');
        card.id = 'card-' + i;
        const symbol = document.createElement('i');
        symbol.classList.add('fa');
        symbol.classList.add('fa-' + symbolClasses[game.currentSymbolOrder[i]]);
        card.appendChild(symbol);
        deck.appendChild(card);
    }
    hideCongratsPanel();
    setTimeout(function() {incrementTimer(game.session)}, 1000);
    refreshScorePanel();
    resetCardListeners();
}

restartGame();
game.session = 0; // just in case we actually use the number some day

const restartButtons = document.querySelectorAll('.restart');
for(const restartButton of restartButtons) {
    restartButton.addEventListener('click', restartGame);
}

// showCongratsPanel();

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
