document.addEventListener('DOMContentLoaded', () => {
    const slotsMachine = document.querySelector('.slots-machine');
    const reels = document.querySelectorAll('.reel');
    const spinButton = document.getElementById('spin-button');
    const betInput = document.getElementById('bet-amount');
    const quickBets = document.querySelectorAll('.quick-bet');
    const balanceDisplay = document.getElementById('balance');
    const resultMessage = document.getElementById('result-message');

    const symbols = ['🍒', '🍊', '🍋', '🍇', '7️⃣', '💎'];
    let isSpinning = false;
    let currentBet = 0;

    // Initialize game
    function initGame() {
        updateBalance();
        setupEventListeners();
    }

    // Update balance display
    function updateBalance() {
        balanceDisplay.textContent = window.playerBalance;
        document.getElementById('header-balance').textContent = window.playerBalance;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Quick bet buttons
        quickBets.forEach(button => {
            button.addEventListener('click', () => {
                const amount = parseInt(button.dataset.amount);
                addToBet(amount);
            });
        });

        // Spin button
        spinButton.addEventListener('click', () => {
            if (!isSpinning && currentBet > 0 && currentBet <= window.playerBalance) {
                spin();
            }
        });

        // Bet input
        betInput.addEventListener('input', () => {
            const amount = parseInt(betInput.value) || 0;
            setBet(amount);
        });
    }

    // Set bet amount
    function setBet(amount) {
        if (amount > window.playerBalance) {
            amount = window.playerBalance;
        }
        currentBet = amount;
        betInput.value = amount;
    }

    // Add to current bet
    function addToBet(amount) {
        const newBet = currentBet + amount;
        if (newBet > window.playerBalance) {
            setBet(window.playerBalance);
        } else {
            setBet(newBet);
        }
    }

    // Spin the reels
    function spin() {
        if (isSpinning) return;

        isSpinning = true;
        window.playerBalance -= currentBet;
        updateBalance();
        showBalanceUpdate(currentBet, false);

        // Animate each reel
        reels.forEach((reel, index) => {
            const spins = 10 + index * 2; // Different spin duration for each reel
            let currentSpin = 0;

            const spinInterval = setInterval(() => {
                const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                reel.textContent = randomSymbol;
                currentSpin++;

                if (currentSpin >= spins) {
                    clearInterval(spinInterval);
                    
                    // Set final symbol
                    const finalSymbol = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.textContent = finalSymbol;

                    // Check for win after all reels stop
                    if (index === reels.length - 1) {
                        setTimeout(checkWin, 500);
                    }
                }
            }, 100);
        });
    }

    // Check for winning combinations
    function checkWin() {
        const results = Array.from(reels).map(reel => reel.textContent);
        let winAmount = 0;

        // Check for three of a kind
        if (results[0] === results[1] && results[1] === results[2]) {
            const symbol = results[0];
            switch (symbol) {
                case '💎':
                    winAmount = currentBet * 10;
                    break;
                case '7️⃣':
                    winAmount = currentBet * 5;
                    break;
                default:
                    winAmount = currentBet * 3;
            }
        }
        // Check for two of a kind
        else if (results[0] === results[1] || results[1] === results[2] || results[0] === results[2]) {
            winAmount = currentBet;
        }

        if (winAmount > 0) {
            window.playerBalance += winAmount;
            showBalanceUpdate(winAmount, true);
            resultMessage.textContent = `You won ${winAmount}!`;
            resultMessage.className = 'result-message win';
        } else {
            resultMessage.textContent = 'Try again!';
            resultMessage.className = 'result-message loss';
        }

        updateBalance();
        isSpinning = false;
    }

    // Initialize the game
    initGame();
}); 