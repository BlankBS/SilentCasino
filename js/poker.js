document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetButton = document.getElementById('place-bet');
    const foldButton = document.getElementById('fold');
    const callButton = document.getElementById('call');
    const raiseButton = document.getElementById('raise');
    const communityCardsElement = document.getElementById('community-cards');
    const playerCardsElement = document.getElementById('player-cards');
    const resultElement = document.querySelector('.result');

    let balance = 1000;
    let currentBet = 0;
    let pot = 0;
    let deck = [];
    let communityCards = [];
    let playerHand = [];
    let gameInProgress = false;

    // Initialize the game
    function initializeGame() {
        deck = createDeck();
        communityCards = [];
        playerHand = [];
        pot = 0;
        gameInProgress = false;
        updateUI();
    }

    // Create a deck of cards
    function createDeck() {
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];

        for (let suit of suits) {
            for (let value of values) {
                deck.push({ suit, value });
            }
        }

        return shuffleDeck(deck);
    }

    // Shuffle the deck
    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    // Deal a card
    function dealCard() {
        return deck.pop();
    }

    // Start a new round
    function startRound() {
        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            showResult('Please enter a valid bet amount');
            return;
        }

        if (betAmount > balance) {
            showResult('Insufficient balance');
            return;
        }

        currentBet = betAmount;
        balance -= betAmount;
        pot = betAmount;
        updateBalance();

        // Deal initial cards
        playerHand = [dealCard(), dealCard()];
        communityCards = [dealCard(), dealCard(), dealCard()];
        gameInProgress = true;

        updateUI();
    }

    // Player folds
    function fold() {
        if (!gameInProgress) return;
        endGame('You folded. Game over.');
    }

    // Player calls
    function call() {
        if (!gameInProgress) return;

        if (currentBet > balance) {
            showResult('Insufficient balance to call');
            return;
        }

        balance -= currentBet;
        pot += currentBet;
        updateBalance();

        // Deal additional community cards
        if (communityCards.length < 5) {
            communityCards.push(dealCard());
            updateUI();
        }

        if (communityCards.length === 5) {
            determineWinner();
        }
    }

    // Player raises
    function raise() {
        if (!gameInProgress) return;

        const raiseAmount = currentBet * 2;
        if (raiseAmount > balance) {
            showResult('Insufficient balance to raise');
            return;
        }

        balance -= raiseAmount;
        pot += raiseAmount;
        currentBet = raiseAmount;
        updateBalance();

        // Deal additional community cards
        if (communityCards.length < 5) {
            communityCards.push(dealCard());
            updateUI();
        }

        if (communityCards.length === 5) {
            determineWinner();
        }
    }

    // Determine the winner
    function determineWinner() {
        const playerHandValue = evaluateHand([...playerHand, ...communityCards]);
        const dealerHandValue = evaluateHand([...communityCards, dealCard(), dealCard()]);

        if (playerHandValue > dealerHandValue) {
            endGame(`You win! Hand: ${getHandName(playerHandValue)}`);
            balance += pot * 2;
        } else if (playerHandValue < dealerHandValue) {
            endGame(`You lose. Dealer's hand: ${getHandName(dealerHandValue)}`);
        } else {
            endGame(`Push! Both have ${getHandName(playerHandValue)}`);
            balance += pot;
        }
    }

    // Evaluate poker hand
    function evaluateHand(cards) {
        // Implementation of poker hand evaluation
        // Returns a numeric value representing hand strength
        // Higher value = better hand
        return 0; // Placeholder
    }

    // Get hand name
    function getHandName(handValue) {
        // Implementation of hand name lookup
        return 'High Card'; // Placeholder
    }

    // End the game
    function endGame(message) {
        gameInProgress = false;
        showResult(message);
        updateBalance();
    }

    // Update the UI
    function updateUI() {
        communityCardsElement.innerHTML = '';
        playerCardsElement.innerHTML = '';

        communityCards.forEach(card => {
            const cardElement = createCardElement(card);
            communityCardsElement.appendChild(cardElement);
        });

        playerHand.forEach(card => {
            const cardElement = createCardElement(card);
            playerCardsElement.appendChild(cardElement);
        });

        foldButton.disabled = !gameInProgress;
        callButton.disabled = !gameInProgress;
        raiseButton.disabled = !gameInProgress;
        placeBetButton.disabled = gameInProgress;
    }

    // Create a card element
    function createCardElement(card) {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.textContent = `${card.value}${getSuitSymbol(card.suit)}`;
        return cardElement;
    }

    // Get suit symbol
    function getSuitSymbol(suit) {
        const symbols = {
            'hearts': '♥',
            'diamonds': '♦',
            'clubs': '♣',
            'spades': '♠'
        };
        return symbols[suit];
    }

    // Update balance display
    function updateBalance() {
        balanceElement.textContent = balance;
    }

    // Show result message
    function showResult(message) {
        resultElement.textContent = message;
    }

    // Event listeners
    placeBetButton.addEventListener('click', startRound);
    foldButton.addEventListener('click', fold);
    callButton.addEventListener('click', call);
    raiseButton.addEventListener('click', raise);

    // Initialize the game
    initializeGame();
}); 