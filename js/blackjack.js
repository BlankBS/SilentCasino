document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const headerBalanceElement = document.getElementById('header-balance');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetButton = document.getElementById('place-bet');
    const hitButton = document.getElementById('hit');
    const standButton = document.getElementById('stand');
    const doubleButton = document.getElementById('double');
    const dealerCardsElement = document.getElementById('dealer-cards');
    const playerCardsElement = document.getElementById('player-cards');
    const dealerScoreElement = document.getElementById('dealer-score');
    const playerScoreElement = document.getElementById('player-score');

    let currentBet = 0;
    let deck = [];
    let dealerHand = [];
    let playerHand = [];
    let gameInProgress = false;

    function initializeGame() {
        deck = createDeck();
        dealerHand = [];
        playerHand = [];
        gameInProgress = false;
        currentBet = 0;
        updateUI();
    }

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

    function shuffleDeck(deck) {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    }

    function dealCard() {
        return deck.pop();
    }

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

    function updateScores() {
        if (gameInProgress) {
            dealerScoreElement.textContent = '?';
        } else {
            dealerScoreElement.textContent = calculateHandValue(dealerHand);
        }
        playerScoreElement.textContent = calculateHandValue(playerHand);
    }

    function startRound() {
        if (gameInProgress) return;

        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Please enter a valid bet amount');
            return;
        }

        if (betAmount > window.playerBalance) {
            alert('Insufficient balance');
            return;
        }

        currentBet = betAmount;
        window.playerBalance -= betAmount;
        updateBalance();

        deck = createDeck();
        dealerHand = [dealCard(), dealCard()];
        playerHand = [dealCard(), dealCard()];
        gameInProgress = true;

        updateUI();
        checkBlackjack();
    }

    function hit() {
        if (!gameInProgress) return;

        playerHand.push(dealCard());
        updateUI();

        if (calculateHandValue(playerHand) > 21) {
            endGame('lose');
        }
    }

    function stand() {
        if (!gameInProgress) return;

        while (calculateHandValue(dealerHand) < 17) {
            dealerHand.push(dealCard());
        }

        updateUI();
        determineWinner();
    }

    function double() {
        if (!gameInProgress || playerHand.length !== 2) return;

        if (currentBet * 2 > window.playerBalance) {
            alert('Insufficient balance to double');
            return;
        }

        window.playerBalance -= currentBet;
        currentBet *= 2;
        updateBalance();

        hit();
        if (gameInProgress) {
            stand();
        }
    }

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

    function updateBalance() {
        window.updateAllBalances();
    }

    function showBalanceUpdate(amount, isPositive) {
        const updateElement = document.createElement('div');
        updateElement.className = `balance-update ${isPositive ? 'positive' : 'negative'}`;
        updateElement.textContent = `${isPositive ? '+' : '-'}${amount}`;
        
        const balanceRect = balanceElement.getBoundingClientRect();
        updateElement.style.left = `${balanceRect.right + 10}px`;
        updateElement.style.top = `${balanceRect.top}px`;
        updateElement.style.position = 'fixed';
        updateElement.style.zIndex = '1001';
        
        document.body.appendChild(updateElement);

        const headerUpdateElement = document.createElement('div');
        headerUpdateElement.className = `balance-update ${isPositive ? 'positive' : 'negative'}`;
        headerUpdateElement.textContent = `${isPositive ? '+' : '-'}${amount}`;
        
        const headerBalanceRect = headerBalanceElement.getBoundingClientRect();
        const headerRect = document.querySelector('.header').getBoundingClientRect();
        headerUpdateElement.style.left = `${headerBalanceRect.right + 10}px`;
        headerUpdateElement.style.top = `${headerBalanceRect.top}px`;
        headerUpdateElement.style.position = 'fixed';
        headerUpdateElement.style.zIndex = '1001';
        
        document.body.appendChild(headerUpdateElement);

        setTimeout(() => {
            updateElement.remove();
            headerUpdateElement.remove();
        }, 1500);
    }

    function endGame(result, multiplier = 1) {
        gameInProgress = false;
        
        if (result === 'win') {
            const winAmount = currentBet * multiplier;
            window.playerBalance += winAmount;
            showBalanceUpdate(winAmount, true);
        } else if (result === 'push') {
            window.playerBalance += currentBet;
            showBalanceUpdate(currentBet, true);
        } else {
            showBalanceUpdate(currentBet, false);
        }
        
        updateBalance();
        updateUI();
    }

    function updateUI() {
        dealerCardsElement.innerHTML = '';
        playerCardsElement.innerHTML = '';

        dealerHand.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            if (index === 0 && gameInProgress) {
                cardElement.style.backgroundImage = 'url(/assets/cards/back.png)';
            } else {
                cardElement.style.backgroundImage = `url(/assets/cards/${card.suit}_${card.value}.png)`;
            }
            
            dealerCardsElement.appendChild(cardElement);
        });

        playerHand.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            cardElement.style.backgroundImage = `url(/assets/cards/${card.suit}_${card.value}.png)`;
            playerCardsElement.appendChild(cardElement);
        });

        updateScores();

        hitButton.disabled = !gameInProgress;
        standButton.disabled = !gameInProgress;
        doubleButton.disabled = !gameInProgress || playerHand.length !== 2 || currentBet * 2 > window.playerBalance;
        placeBetButton.disabled = gameInProgress;
        betAmountInput.disabled = gameInProgress;
    }

    placeBetButton.addEventListener('click', startRound);
    hitButton.addEventListener('click', hit);
    standButton.addEventListener('click', stand);
    doubleButton.addEventListener('click', double);

    const quickBetButtons = document.querySelectorAll('.quick-bet');
    quickBetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            const currentAmount = parseInt(betAmountInput.value) || 0;
            betAmountInput.value = currentAmount + amount;
        });
    });

    initializeGame();
}); 