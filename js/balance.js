window.playerBalance = 1000;

window.updateAllBalances = function() {
    const balanceElements = document.querySelectorAll('#balance, #header-balance');
    balanceElements.forEach(element => {
        element.textContent = window.playerBalance;
    });
}

window.showBalanceUpdate = function(amount, isPositive) {
    const balanceElements = document.querySelectorAll('#balance, #header-balance');
    
    balanceElements.forEach(balanceElement => {
        const updateElement = document.createElement('div');
        updateElement.className = `balance-update ${isPositive ? 'positive' : 'negative'}`;
        updateElement.textContent = `${isPositive ? '+' : '-'}${amount}`;
        
        const balanceRect = balanceElement.getBoundingClientRect();
        updateElement.style.left = `${balanceRect.right + 10}px`;
        updateElement.style.top = `${balanceRect.top}px`;
        updateElement.style.position = 'fixed';
        updateElement.style.zIndex = '1001';
        
        document.body.appendChild(updateElement);

        setTimeout(() => {
            updateElement.remove();
        }, 1500);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    updateAllBalances();
}); 