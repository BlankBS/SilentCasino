document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetButton = document.getElementById('place-bet');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const doubleButton = document.getElementById('double');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerCardsElement = document.getElementById('player-cards');
    const dealerScoreElement = document.getElementById('dealer-score');
    const playerScoreElement = document.getElementById('player-score');

    let playerBalance = 1000;
    let currentBet = 0;
    let deck = [];
    let dealerHand = [];
    let playerHand = [];
    let gameInProgress = false;

    // Initialize the game
    function initializeGame() {
        deck = createDeck();
        dealerHand = [];
        playerHand = [];
        gameInProgress = false;
        currentBet = 0;
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

    // Calculate hand value
    function calculateHandValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            if (card.value === 'A') {
                aces += 1;
            } else if (['K', 'Q', 'J'].includes(card.value)) {
                value += 10;
            } else {
                value += parseInt(card.value);
            }
        }

        for (let i = 0; i < aces; i++) {
            if (value + 11 <= 21) {
                value += 11;
            } else {
                value += 1;
            }
        }

        return value;
    }

    // Update scores display
    function updateScores() {
        if (gameInProgress) {
            dealerScoreElement.textContent = '?';
        } else {
            dealerScoreElement.textContent = calculateHandValue(dealerHand);
        }
        playerScoreElement.textContent = calculateHandValue(playerHand);
    }

    // Start a new round
    function startRound() {
        if (gameInProgress) return;

        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Please enter a valid bet amount');
            return;
        }

        if (betAmount > playerBalance) {
            alert('Insufficient balance');
            return;
        }

        currentBet = betAmount;
        playerBalance -= betAmount;
        updateBalance();

        // Create new deck and deal cards
        deck = createDeck();
        dealerHand = [dealCard(), dealCard()];
        playerHand = [dealCard(), dealCard()];
        gameInProgress = true;

        updateUI();
        checkBlackjack();
    }

    // Player hits
    function hit() {
        if (!gameInProgress) return;

        playerHand.push(dealCard());
        updateUI();

        if (calculateHandValue(playerHand) > 21) {
            endGame('lose');
        }
    }

    // Player stands
    function stand() {
        if (!gameInProgress) return;

        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(dealCard());
        }

        updateUI();
        determineWinner();
    }

    // Player doubles
    function double() {
        if (!gameInProgress || playerHand.length !== 2) return;

        if (currentBet * 2 > playerBalance) {
            alert('Insufficient balance to double');
            return;
        }

        playerBalance -= currentBet;
        currentBet *= 2;
        updateBalance();

        hit();
        if (gameInProgress) {
            stand();
        }
    }

    // Check for blackjack
    function checkBlackjack() {
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);

        if (playerValue === 21) {
            if (dealerValue === 21) {
                endGame('push');
            } else {
                endGame('win', 2.5);
            }
        } else if (dealerValue === 21) {
            endGame('lose');
        }
    }

    // Determine the winner
    function determineWinner() {
        const playerValue = calculateHandValue(playerHand);
        const dealerValue = calculateHandValue(dealerHand);

        if (dealerValue > 21) {
            endGame('win', 2);
        } else if (playerValue > dealerValue) {
            endGame('win', 2);
        } else if (playerValue < dealerValue) {
            endGame('lose');
        } else {
            endGame('push');
        }
    }

    // Update balance display
    function updateBalance() {
        balanceElement.textContent = playerBalance;
    }

    // Show balance update animation
    function showBalanceUpdate(amount, isPositive) {
        const updateElement = document.createElement('div');
        updateElement.className = `balance-update ${isPositive ? 'positive' : 'negative'}`;
        updateElement.textContent = `${isPositive ? '+' : '-'}${amount}`;
        
        // Позиционируем элемент рядом с балансом
        const balanceRect = balanceElement.getBoundingClientRect();
        updateElement.style.left = `${balanceRect.right + 10}px`;
        updateElement.style.top = `${balanceRect.top}px`;
        
        document.body.appendChild(updateElement);

        // Remove the element after animation completes
        setTimeout(() => {
            updateElement.remove();
        }, 1500);
    }

    // End the game
    function endGame(result, multiplier = 1) {
        gameInProgress = false;
        
        if (result === 'win') {
            const winAmount = currentBet * multiplier;
            playerBalance += winAmount;
            showBalanceUpdate(winAmount, true);
        } else if (result === 'push') {
            playerBalance += currentBet;
            showBalanceUpdate(currentBet, true);
        } else {
            showBalanceUpdate(currentBet, false);
        }
        
        updateBalance();
        updateUI();
    }

    // Update UI
    function updateUI() {
        // Clear previous cards
        dealerCardsElement.innerHTML = '';
        playerCardsElement.innerHTML = '';

        // Show dealer's cards
        dealerHand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            // First card is hidden only during the game
            if (index === 0 && gameInProgress) {
                cardElement.style.backgroundImage = 'url(assets/cards/back.png)';
            } else {
                cardElement.style.backgroundImage = `url(assets/cards/${card.suit}_${card.value}.png)`;
            }
            
            dealerCardsElement.appendChild(cardElement);
        });

        // Show player's cards
        playerHand.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.backgroundImage = `url(assets/cards/${card.suit}_${card.value}.png)`;
            playerCardsElement.appendChild(cardElement);
        });

        // Update scores
        updateScores();

        // Update button states
        hitButton.disabled = !gameInProgress;
        standButton.disabled = !gameInProgress;
        doubleButton.disabled = !gameInProgress || playerHand.length !== 2 || currentBet * 2 > playerBalance;
        placeBetButton.disabled = gameInProgress;
        betAmountInput.disabled = gameInProgress;
    }

    // Event listeners
    placeBetButton.addEventListener('click', startRound);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
    doubleButton.addEventListener('click', double);

    // Quick bet buttons
    const quickBetButtons = document.querySelectorAll('.quick-bet');
    quickBetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            const currentAmount = parseInt(betAmountInput.value) || 0;
            betAmountInput.value = currentAmount + amount;
        });
    });

    // Initialize the game
    initializeGame();
}); 