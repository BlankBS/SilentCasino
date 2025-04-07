document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const spinButton = document.getElementById('spin');
    const reels = [
        document.getElementById('reel1'),
        document.getElementById('reel2'),
        document.getElementById('reel3')
    ];
    const resultElement = document.querySelector('.result');

    let balance = 1000;
    let spinning = false;
    const symbols = ['🍒', '🍊', '🍋', '🍇', '🍉', '7️⃣', '💎'];
    const payouts = {
        '🍒🍒🍒': 3,
        '🍊🍊🍊': 5,
        '🍋🍋🍋': 5,
        '🍇🍇🍇': 7,
        '🍉🍉🍉': 7,
        '7️⃣7️⃣7️⃣': 10,
        '💎💎💎': 20
    };

    // Initialize the game
    function initializeGame() {
        updateUI();
    }

    // Spin the reels
    function spin() {
        if (spinning) return;

        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0) {
            showResult('Please enter a valid bet amount');
            return;
        }

        if (betAmount > balance) {
            showResult('Insufficient balance');
            return;
        }

        balance -= betAmount;
        updateBalance();
        spinning = true;
        spinButton.disabled = true;

        // Animate each reel
        reels.forEach((reel, index) => {
            const spins = 10 + index * 5; // Different number of spins for each reel
            let currentSpin = 0;

            const spinInterval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                currentSpin++;

                if (currentSpin >= spins) {
                    clearInterval(spinInterval);
                    if (index === reels.length - 1) {
                        checkResult(betAmount);
                    }
                }
            }, 100);
        });
    }

    // Check the result
    function checkResult(betAmount) {
        spinning = false;
        spinButton.disabled = false;

        const result = reels.map(reel => reel.textContent).join('');
        let winnings = 0;

        // Check for winning combinations
        for (const [combination, multiplier] of Object.entries(payouts)) {
            if (result === combination) {
                winnings = betAmount * multiplier;
                break;
            }
        }

        if (winnings > 0) {
            balance += winnings;
            showResult(`You won $${winnings}!`);
        } else {
            showResult('Try again!');
        }

        updateBalance();
    }

    // Update the UI
    function updateUI() {
        balanceElement.textContent = balance;
        spinButton.disabled = spinning;
    }

    // Show result message
    function showResult(message) {
        resultElement.textContent = message;
    }

    // Update balance display
    function updateBalance() {
        balanceElement.textContent = balance;
    }

    // Event listeners
    spinButton.addEventListener('click', spin);

    // Initialize the game
    initializeGame();
}); 