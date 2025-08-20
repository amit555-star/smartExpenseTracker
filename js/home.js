// ==== Home Page (home.html) Logic ====

// DOM Elements
const greetingEl = document.getElementById("greeting");
const logoutIcon = document.querySelector(".logout-icon");
const openAddTransactionFormBtn = document.getElementById("openAddTransactionForm"); // Plus button
const transactionsList = document.getElementById("transactionsList");
const totalBalanceAmount = document.getElementById("totalBalanceAmount");
const incomeAmount = document.getElementById("incomeAmount");
const expenseAmount = document.getElementById("expenseAmount");

// --- Initial Checks & UI Setup ---
document.addEventListener("DOMContentLoaded", () => {
    // Check if user is logged in (from first.js)
    if (localStorage.getItem("loggedIn") !== "true") {
        window.location.href = "index.html"; // Not logged in, redirect to login page
        return; // Stop further execution
    }

    // Display greeting
    const username = localStorage.getItem("username");
    if (greetingEl && username) {
        greetingEl.textContent = `Hello 👋, ${username}!`;
    }

    // Load and display transactions from Local Storage
    loadTransactions();
});

// --- Event Listeners ---
if (logoutIcon) {
    logoutIcon.addEventListener("click", () => {
        localStorage.removeItem("loggedIn"); // Clear login status
        // localStorage.removeItem("username"); // Clear username
        // localStorage.removeItem("userPasscode"); // Clear passcode
        // You might want to clear transaction data here too if it's strictly per-user and not shared.
        // localStorage.removeItem("transactions"); // Uncomment if each user has entirely separate transactions

        alert("You have been logged out successfully!"); // Using alert for simplicity
        window.location.href = "index.html"; // Redirect to login page
    });
}

if (openAddTransactionFormBtn) {
    openAddTransactionFormBtn.addEventListener('click', () => {
        // Clear any previous edit data from localStorage before navigating to add form
        localStorage.removeItem('editTransactionId');
        localStorage.removeItem('editTransactionData');
        window.location.href = 'transactions.html'; // Navigate to the add/edit form page
    });
}

// --- Local Storage & UI Functions ---

function loadTransactions() {
    // Get transactions from Local Storage
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    
    transactionsList.innerHTML = ''; // Clear current list
    let totalIncome = 0;
    let totalExpense = 0;

    if (transactions.length === 0) {
        transactionsList.innerHTML = '<li class="text-center text-muted py-3">No transactions yet. Add one!</li>';
    } else {
        // Sort by timestamp if available, otherwise assume latest is last added
        // For local storage, a simple `Date.parse` comparison is often enough
        transactions.sort((a, b) => {
            const dateA = new Date(a.timestamp || a.date).getTime();
            const dateB = new Date(b.timestamp || b.date).getTime();
            return dateB - dateA; // Sort descending (latest first)
        });

        transactions.forEach(transaction => {
            addTransactionToUI(transaction);

            if (transaction.type === 'income') {
                totalIncome += parseFloat(transaction.amount);
            } else if (transaction.type === 'expense') {
                totalExpense += parseFloat(transaction.amount);
            }
        });
    }

    const totalBalance = totalIncome - totalExpense;
    totalBalanceAmount.textContent = `$${totalBalance.toFixed(2)}`;
    incomeAmount.textContent = `$${totalIncome.toFixed(2)}`;
    expenseAmount.textContent = `$${totalExpense.toFixed(2)}`;
}

function addTransactionToUI(transaction) {
    const li = document.createElement('li');
    li.classList.add('transaction-item');
    // Store original index or a unique ID if you want to allow updating/deleting
    li.dataset.id = transaction.id; // Use the 'id' field from transaction object

    const dateObj = new Date(transaction.date); // Assuming transaction.date is a valid date string
    const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    const iconClass = transaction.type === 'income' ? 'bi-arrow-down-short' : 'bi-arrow-up-short';
    const iconBgClass = transaction.type === 'income' ? 'income-icon' : 'expense-icon';
    const amountClass = transaction.type === 'income' ? 'income' : 'expense';

    li.innerHTML = `
        <div class="transaction-avatar ${iconBgClass}">
            <i class="bi ${iconClass}"></i>
        </div>
        <div class="transaction-details">
            <h4>${transaction.title}</h4>
            <small>${formattedDate}</small>
        </div>
        <div class="transaction-amount-wrapper">
            <span class="transaction-amount ${amountClass}">${transaction.type === 'expense' ? '-' : '+'}$${parseFloat(transaction.amount).toFixed(2)}</span>
            <button class="transaction-delete-btn" data-id="${transaction.id}">Delete</button>
        </div>
    `;

    // Event listener for editing (clicking the transaction item itself)
    li.addEventListener('click', (event) => {
        // Ensure click wasn't on the delete button
        if (!event.target.classList.contains('transaction-delete-btn')) {
            // Store transaction data in localStorage for the transactions.html page to pick up
            localStorage.setItem('editTransactionId', transaction.id);
            localStorage.setItem('editTransactionData', JSON.stringify(transaction));
            window.location.href = 'transactions.html'; // Navigate to the add/edit form page
        }
    });

    // Event listener for delete button
    const deleteButton = li.querySelector('.transaction-delete-btn');
    if (deleteButton) {
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent li click event from firing
            deleteTransaction(event.currentTarget.dataset.id);
        });
    }

    transactionsList.appendChild(li);
}

function deleteTransaction(idToDelete) {
    if (!confirm("Are you sure you want to delete this transaction?")) {
        return;
    }

    let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    // Filter out the transaction with the matching ID
    transactions = transactions.filter(t => t.id !== idToDelete);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    alert("Transaction deleted successfully!"); // Using alert for simplicity
    loadTransactions(); // Re-render the list
}
