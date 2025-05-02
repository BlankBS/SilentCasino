document.addEventListener('DOMContentLoaded', () => {
    const balanceElement = document.getElementById('balance');
    const betAmountInput = document.getElementById('bet-amount');
    const placeBetButton = document.getElementById('place-bet');
    const resultElement = document.querySelector('.result');
    const rouletteWheel = document.querySelector('.roulette-wheel');
    const bettingTable = document.querySelector('.betting-table');

    let balance = 1000;
    let currentBet = 0;

    function initializeBettingTable() {
        const numbers = Array.from({length: 37}, (_, i) => i); // 0-36
        const colors = {
            0: 'green',
            '1-10': 'red',
            '11-18': 'black',
            '19-28': 'red',
            '29-36': 'black'
        };

        numbers.forEach(number => {
            const cell = document.createElement('div');
            cell.className = 'betting-cell';
            cell.textContent = number;
            cell.style.backgroundColor = getColorForNumber(number);
            cell.addEventListener('click', () => placeBet(number));
            bettingTable.appendChild(cell);
        });
    }

    function getColorForNumber(number) {
        if (number === 0) return 'green';
        if (number >= 1 && number <= 10) return 'red';
        if (number >= 11 && number <= 18) return 'black';
        if (number >= 19 && number <= 28) return 'red';
        if (number >= 29 && number <= 36) return 'black';
    }

    function placeBet(number) {
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
        updateBalance();
        spinWheel(number);
    }

    function spinWheel(betNumber) {
        const result = Math.floor(Math.random() * 37);
        const isWin = result === betNumber;
        const winnings = isWin ? currentBet * 35 : 0;
        
        balance += winnings;
        updateBalance();
        
        showResult(`Result: ${result} (${getColorForNumber(result)}) - ${isWin ? 'You won!' : 'You lost.'}`);
        if (winnings > 0) {
            showResult(`Winnings: $${winnings}`);
        }
    }

    function updateBalance() {
        balanceElement.textContent = balance;
    }

    function showResult(message) {
        resultElement.textContent = message;
    }

    initializeBettingTable();
}); 