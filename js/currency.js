// Currency exchange rates (relative to USD)
const exchangeRates = {
    USD: 1.0,
    EUR: 0.85,
    GBP: 0.73,
    JPY: 110.25,
    CAD: 1.25,
    AUD: 1.35,
    CHF: 0.92,
    CNY: 7.12,
    INR: 83.15,
    NPR: 139.31
};

// Currency flags mapping
const currencyFlags = {
    USD: '🇺🇸',
    EUR: '🇪🇺',
    GBP: '🇬🇧',
    JPY: '🇯🇵',
    CAD: '🇨🇦',
    AUD: '🇦🇺',
    CHF: '🇨🇭',
    CNY: '🇨🇳',
    INR: '🇮🇳',
    NPR: '🇳🇵'
};

// DOM Elements
const fromCurrencySelect = document.getElementById('fromCurrency');
const toCurrencySelect = document.getElementById('toCurrency');
const inputAmount = document.getElementById('inputAmount');
const resultAmount = document.getElementById('resultAmount');
const swapBtn = document.getElementById('swapBtn');
const rateDisplay = document.getElementById('rateDisplay');

// State
let currentFromCurrency = 'USD';
let currentToCurrency = 'GBP';
let currentAmount = 100;

// Initialize the app
function init() {
    setupEventListeners();
    updateConversion();
    setupNavigation();
    animateOnLoad();
}

// Setup event listeners
function setupEventListeners() {
    // Currency selection change
    fromCurrencySelect.addEventListener('change', (e) => {
        currentFromCurrency = e.target.value;
        updateConversion();
        addFeedbackAnimation(fromCurrencySelect);
    });

    toCurrencySelect.addEventListener('change', (e) => {
        currentToCurrency = e.target.value;
        updateConversion();
        addFeedbackAnimation(toCurrencySelect);
    });

    // Amount input change
    inputAmount.addEventListener('input', (e) => {
        currentAmount = parseFloat(e.target.value) || 0;
        updateConversion();
    });

    // Swap button
    swapBtn.addEventListener('click', swapCurrencies);

    // Add loading animation to swap button
    swapBtn.addEventListener('click', () => {
        swapBtn.style.transform = 'scale(1.05) rotate(180deg)';
        setTimeout(() => {
            swapBtn.style.transform = 'scale(1.0) rotate(0deg)';
        }, 300);
    });

    // Prevent form submission on enter
    inputAmount.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            inputAmount.blur();
        }
    });
}

// Add visual feedback animation
function addFeedbackAnimation(element) {
    element.style.transform = 'scale(1.02)';
    element.style.transition = 'transform 0.2s ease';
    setTimeout(() => {
        element.style.transform = 'scale(1.0)';
    }, 200);
}

// Update currency conversion
function updateConversion() {
    try {
        // Calculate conversion
        const fromRate = exchangeRates[currentFromCurrency];
        const toRate = exchangeRates[currentToCurrency];
        
        if (!fromRate || !toRate) {
            throw new Error('Invalid currency rates');
        }
        
        const convertedAmount = (currentAmount * toRate / fromRate);
        
        // Update result input with proper formatting
        resultAmount.value = formatAmount(convertedAmount);
        
        // Update exchange rate display
        const rate = (toRate / fromRate).toFixed(4);
        const fromFlag = currencyFlags[currentFromCurrency];
        const toFlag = currencyFlags[currentToCurrency];
        
        rateDisplay.innerHTML = `
            <span class="flag">${fromFlag}</span>
            <span class="rate-info">1 ${currentFromCurrency} = ${rate} ${currentToCurrency}</span>
            <span class="flag">${toFlag}</span>
        `;
        
        // Add subtle animation to result
        resultAmount.style.backgroundColor = '#f0f9ff';
        setTimeout(() => {
            resultAmount.style.backgroundColor = '';
        }, 300);
        
    } catch (error) {
        console.error('Conversion error:', error);
        resultAmount.value = '0.00';
        handleError('Conversion failed. Please try again.');
    }
}

// Format amount for display
function formatAmount(amount) {
    if (isNaN(amount) || !isFinite(amount)) {
        return '0.00';
    }
    
    // For very large numbers, use scientific notation
    if (amount > 999999) {
        return amount.toExponential(2);
    }
    
    // For very small numbers, show more decimal places
    if (amount < 0.01 && amount > 0) {
        return amount.toFixed(6);
    }
    
    // Standard formatting
    return amount.toFixed(2);
}

// Swap currencies
function swapCurrencies() {
    try {
        // Swap the currencies
        const temp = currentFromCurrency;
        currentFromCurrency = currentToCurrency;
        currentToCurrency = temp;
        
        // Update select elements
        fromCurrencySelect.value = currentFromCurrency;
        toCurrencySelect.value = currentToCurrency;
        
        // Update conversion
        updateConversion();
        
        // Add visual feedback
        addFeedbackAnimation(fromCurrencySelect);
        addFeedbackAnimation(toCurrencySelect);
        
        // Add success feedback
        showSuccessMessage('Currencies swapped!');
        
    } catch (error) {
        console.error('Swap error:', error);
        handleError('Failed to swap currencies');
    }
}

// Setup navigation functionality
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all items
            navItems.forEach(nav => nav.classList.remove('active'));
            
            // Add active class to clicked item (except add button)
            if (!item.classList.contains('add-btn')) {
                item.classList.add('active');
            }
            
            // Add click animation
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = 'scale(1.0)';
            }, 150);
            
            // Special handling for add button
            if (item.classList.contains('add-btn')) {
                showSuccessMessage('Add transaction feature coming soon!');
            }
        });
    });
}

// Animate elements on load
function animateOnLoad() {
    const animatedElements = document.querySelectorAll('.balance-card, .exchange-card, .transaction-item');
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            element.style.transition = 'all 0.5s ease-out';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Transaction functionality
function setupTransactions() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const transactionItem = button.closest('.transaction-item');
            const transactionName = transactionItem.querySelector('.transaction-name').textContent;
            
            // Confirm deletion
            if (confirm(`Are you sure you want to delete the "${transactionName}" transaction?`)) {
                // Add removal animation
                transactionItem.style.transform = 'translateX(-100%)';
                transactionItem.style.opacity = '0';
                
                setTimeout(() => {
                    transactionItem.remove();
                    showSuccessMessage('Transaction deleted successfully!');
                }, 300);
            }
        });
    });
}

// Format currency for display
function formatCurrency(amount, currency) {
    try {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    } catch (error) {
        return `${currency} ${amount.toFixed(2)}`;
    }
}

// Add transaction (for future use)
function addTransaction(name, amount, type, date) {
    const transactionsList = document.querySelector('.transactions-list');
    const isIncome = type === 'income';
    
    const transactionHTML = `
        <div class="transaction-item" style="opacity: 0; transform: translateY(20px);">
            <div class="transaction-left">
                <div class="transaction-icon ${type}">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        ${isIncome 
                            ? '<path d="M16 17h6v-6"/><path d="M22 17l-8.5-8.5-5 5L2 7"/>'
                            : '<path d="M16 7h6v6"/><path d="M22 7l-8.5 8.5-5-5L2 17"/>'
                        }
                    </svg>
                </div>
                <div class="transaction-info">
                    <p class="transaction-name">${name}</p>
                    <p class="transaction-date">${date}</p>
                </div>
            </div>
            <div class="transaction-right">
                <p class="transaction-amount ${type}">${isIncome ? '+' : '-'}$${Math.abs(amount).toFixed(2)}</p>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
    `;
    
    transactionsList.insertAdjacentHTML('afterbegin', transactionHTML);
    
    // Animate in
    const newTransaction = transactionsList.firstElementChild;
    setTimeout(() => {
        newTransaction.style.transition = 'all 0.5s ease-out';
        newTransaction.style.opacity = '1';
        newTransaction.style.transform = 'translateY(0)';
    }, 50);
    
    // Setup delete functionality for new transaction
    setupTransactionDelete(newTransaction);
    
    showSuccessMessage('Transaction added successfully!');
}

// Setup delete functionality for a transaction
function setupTransactionDelete(transactionElement) {
    const deleteBtn = transactionElement.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        const transactionName = transactionElement.querySelector('.transaction-name').textContent;
        
        if (confirm(`Are you sure you want to delete the "${transactionName}" transaction?`)) {
            transactionElement.style.transform = 'translateX(-100%)';
            transactionElement.style.opacity = '0';
            
            setTimeout(() => {
                transactionElement.remove();
                showSuccessMessage('Transaction deleted successfully!');
            }, 300);
        }
    });
}

// Update balance (for future use)
function updateBalance(newBalance, newIncome, newExpenses) {
    const balanceAmount = document.querySelector('.amount');
    const incomeValue = document.querySelector('.stat-item:first-child .stat-value');
    const expensesValue = document.querySelector('.stat-item:last-child .stat-value');
    
    // Add animation
    const elements = [balanceAmount, incomeValue, expensesValue];
    elements.forEach(el => {
        el.style.transform = 'scale(1.1)';
        el.style.transition = 'transform 0.2s ease';
    });
    
    setTimeout(() => {
        balanceAmount.textContent = `$${newBalance.toFixed(2)}`;
        incomeValue.textContent = `$${newIncome.toFixed(2)}`;
        expensesValue.textContent = `$${newExpenses.toFixed(2)}`;
        
        elements.forEach(el => {
            el.style.transform = 'scale(1.0)';
        });
    }, 100);
    
    showSuccessMessage('Balance updated successfully!');
}

// Keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Swap currencies with Space bar
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            swapCurrencies();
        }
        
        // Focus amount input with 'A' key
        if (e.code === 'KeyA' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            inputAmount.focus();
            inputAmount.select();
        }
        
        // Clear amount with 'C' key
        if (e.code === 'KeyC' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'SELECT') {
            e.preventDefault();
            inputAmount.value = '';
            currentAmount = 0;
            updateConversion();
        }
    });
}

// Touch gestures for mobile
function setupTouchGestures() {
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Detect swipe gestures on currency exchange area
        const exchangeCard = document.querySelector('.exchange-card');
        const target = e.target.closest('.exchange-card');
        
        if (target && Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
            if (deltaX > 0) {
                // Swipe right - swap currencies
                swapCurrencies();
            }
        }
    });
}

// Show success message
function showSuccessMessage(message) {
    const toast = createToast(message, 'success');
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Error handling
function handleError(message) {
    console.error(message);
    
    const toast = createToast(message, 'error');
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 4000);
}

// Create toast notification
function createToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.textContent = message;
    
    const baseStyles = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        padding: 12px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        font-weight: 500;
        font-size: 14px;
        max-width: 300px;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    const typeStyles = {
        success: 'background: #dcfce7; color: #166534; border: 1px solid #bbf7d0;',
        error: 'background: #fee2e2; color: #dc2626; border: 1px solid #fecaca;',
        info: 'background: #dbeafe; color: #1d4ed8; border: 1px solid #bfdbfe;'
    };
    
    toast.style.cssText = baseStyles + typeStyles[type];
    
    return toast;
}

// Add CSS animation for toasts
function addToastAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(-50%) translateY(-20px);
                opacity: 0;
            }
            to {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        init();
        setupTransactions();
        setupKeyboardShortcuts();
        setupTouchGestures();
        addToastAnimation();
        
        // Show welcome message
        setTimeout(() => {
            showSuccessMessage('Welcome to your Expense Tracker! 🎉');
        }, 1000);
        
    } catch (error) {
        handleError('Failed to initialize application');
    }
});

// Export functions for potential external use
window.ExpenseTracker = {
    addTransaction,
    updateBalance,
    swapCurrencies,
    updateConversion,
    formatCurrency,
    exchangeRates,
    currencyFlags
};

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`App loaded in ${loadTime.toFixed(2)}ms`);
    });
}