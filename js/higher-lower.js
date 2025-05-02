document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let streak = 0;
    let currentCard = null;
    let nextCard = null;
    let gameActive = false;
    let currentBet = 0;
    let balance = 1000;

    const scoreElement = document.getElementById('score');
    const streakElement = document.getElementById('streak');
    const currentCardImage = document.getElementById('current-card-image');
    const higherButton = document.getElementById('higher');
    const lowerButton = document.getElementById('lower');
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetButton = document.getElementById('place-bet');
    const quickBetButtons = document.querySelectorAll('.quick-bet');

    const cardValues = {
        '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
        'J': 11, 'Q': 12, 'K': 13, 'A': 14
    };

    function initGame() {
        score = 0;
        streak = 0;
        gameActive = true;
        updateUI();
        dealInitialCard();
    }

    function dealInitialCard() {
        const deck = createDeck();
        currentCard = deck[Math.floor(Math.random() * deck.length)];
        const [value, suit] = [currentCard.slice(0, -1), currentCard.slice(-1)];
        const suitName = {
            'H': 'hearts',
            'D': 'diamonds',
            'C': 'clubs',
            'S': 'spades'
        }[suit];
        currentCardImage.src = `assets/cards/${suitName}_${value}.png`;
        currentCardImage.alt = currentCard;
    }

    function createDeck() {
        const suits = ['H', 'D', 'C', 'S'];
        const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        const deck = [];

        for (const suit of suits) {
            for (const value of values) {
                deck.push(`${value}${suit}`);
            }
        }

        return deck;
    }

    function handleGuess(isHigher) {
        if (!gameActive) {
            console.log('Game is not active');
            return;
        }

        const deck = createDeck();
        do {
            nextCard = deck[Math.floor(Math.random() * deck.length)];
        } while (nextCard === currentCard);
        
        const currentValue = cardValues[currentCard.slice(0, -1)];
        const nextValue = cardValues[nextCard.slice(0, -1)];
        
        const isCorrect = isHigher ? nextValue > currentValue : nextValue < currentValue;
        
        if (isCorrect) {
            streak++;
            score += streak;
            const winnings = currentBet * 1.5;
            balance += winnings;
            updateBalance(winnings);
        } else {
            streak = 0;
            gameActive = false;
            disableGameControls();
            enableBettingControls();
            updateBalance(-currentBet);
        }

        const [value, suit] = [nextCard.slice(0, -1), nextCard.slice(-1)];
        const suitName = {
            'H': 'hearts',
            'D': 'diamonds',
            'C': 'clubs',
            'S': 'spades'
        }[suit];
        currentCardImage.src = `assets/cards/${suitName}_${value}.png`;
        currentCardImage.alt = nextCard;
        currentCard = nextCard;
        updateUI();
    }

    function updateUI() {
        scoreElement.textContent = score;
        streakElement.textContent = streak;
    }

    function updateBalance(change = 0) {
        const balanceElement = document.getElementById('balance');
        const headerBalanceElement = document.getElementById('header-balance');
        
        const winLossElement = document.createElement('div');
        winLossElement.className = 'win-loss-value';
        
        if (change > 0) {
            winLossElement.textContent = `+${change}`;
            balanceElement.classList.add('balance-increase');
        } else if (change < 0) {
            winLossElement.textContent = `${change}`;
            balanceElement.classList.add('balance-decrease');
        }
        
        if (change !== 0) {
            balanceElement.appendChild(winLossElement);
            
            setTimeout(() => {
                balanceElement.removeChild(winLossElement);
                balanceElement.classList.remove('balance-increase', 'balance-decrease');
            }, 1500);
        }
        
        balanceElement.textContent = balance;
        headerBalanceElement.textContent = balance;
    }

    function enableGameControls() {
        higherButton.disabled = false;
        lowerButton.disabled = false;
    }

    function disableGameControls() {
        higherButton.disabled = true;
        lowerButton.disabled = true;
    }

    function enableBettingControls() {
        betAmountInput.disabled = false;
        placeBetButton.disabled = false;
        quickBetButtons.forEach(button => button.disabled = false);
    }

    function disableBettingControls() {
        betAmountInput.disabled = true;
        placeBetButton.disabled = true;
        quickBetButtons.forEach(button => button.disabled = true);
    }

    function placeBet() {
        const amount = parseInt(betAmountInput.value);
        if (amount && amount > 0 && amount <= balance) {
            currentBet = amount;
            balance -= amount;
            updateBalance(-amount);
            enableGameControls();
            disableBettingControls();
            gameActive = true;
            dealInitialCard();
        } else {
            alert('Введите корректную сумму ставки');
        }
    }

    higherButton.addEventListener('click', () => {
        console.log('Higher button clicked');
        if (gameActive) {
            handleGuess(true);
        }
    });

    lowerButton.addEventListener('click', () => {
        console.log('Lower button clicked');
        if (gameActive) {
            handleGuess(false);
        }
    });

    placeBetButton.addEventListener('click', () => {
        const amount = parseInt(betAmountInput.value);
        if (amount && amount > 0 && amount <= balance) {
            placeBet();
        } else {
            alert('Введите корректную сумму ставки');
        }
    });

    quickBetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const amount = parseInt(button.dataset.amount);
            const currentAmount = parseInt(betAmountInput.value) || 0;
            const newAmount = currentAmount + amount;
            
            if (newAmount <= balance) {
                betAmountInput.value = newAmount;
            } else {
                alert('Недостаточно средств на балансе');
            }
        });
    });

    disableGameControls();
    updateBalance();
}); 