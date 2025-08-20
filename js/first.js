// ==== Registration / Login (index.html) ====
const registerBtn = document.getElementById("register-btn");
const loginBtn = document.getElementById("login-btn");
const newUserForm = document.getElementById("new-user-form");
const returningUserForm = document.getElementById("returning-user-form");
const showLoginLink = document.getElementById("show-login");
const showRegisterLink = document.getElementById("show-register");
const messageDiv = document.getElementById("message");

// Initialize UI based on login status
document.addEventListener("DOMContentLoaded", () => {
    // If a user passcode exists, show the login form by default
    if (localStorage.getItem("userPasscode")) {
        newUserForm.style.display = "none";
        returningUserForm.style.display = "flex";
        messageDiv.textContent = "Please login with your passcode.";
        messageDiv.style.color = "#7d5fff";
        document.getElementById("login-passcode").focus();
    } else {
        // Otherwise, show the registration form
        newUserForm.style.display = "flex";
        returningUserForm.style.display = "none";
        document.getElementById("username").focus();
    }
});

// Handle Registration
if (registerBtn) {
    registerBtn.addEventListener("click", () => {
        const username = document.getElementById("username").value.trim();
        const passcode = document.getElementById("passcode").value.trim();

        if (username && passcode && passcode.length >= 4 && /^\d+$/.test(passcode)) { // Basic validation
            localStorage.setItem("username", username);
            localStorage.setItem("userPasscode", passcode);
            messageDiv.textContent = "Registration successful! Redirecting...";
            messageDiv.style.color = "green";
            setTimeout(() => {
                window.location.href = "home.html"; // Redirect to home page
            }, 1500);
        } else {
            messageDiv.textContent = "Please enter a name and a numeric passcode (min 4 digits).";
            messageDiv.style.color = "red";
        }
    });
}

// Handle Login
if (loginBtn) {
    loginBtn.addEventListener("click", () => {
        const loginPasscode = document.getElementById("login-passcode").value.trim();
        const storedPasscode = localStorage.getItem("userPasscode");

        if (loginPasscode === storedPasscode) {
            localStorage.setItem("loggedIn", "true"); // Mark as logged in
            messageDiv.textContent = "Login successful! Redirecting...";
            messageDiv.style.color = "green";
            setTimeout(() => {
                window.location.href = "home.html"; // Redirect to home page
            }, 1500);
        } else {
            messageDiv.textContent = "Invalid passcode. Please try again.";
            messageDiv.style.color = "red";
        }
    });
}

// Toggle between forms (Show Login)
if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
        e.preventDefault();
        newUserForm.style.display = "none";
        returningUserForm.style.display = "flex";
        messageDiv.textContent = " ";
        document.getElementById("login-passcode").value = '';
        document.getElementById("login-passcode").focus();
    });
}

// Toggle between forms (Show Register)
if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
        e.preventDefault();
        newUserForm.style.display = "flex";
        returningUserForm.style.display = "none";
        messageDiv.textContent = " ";
        document.getElementById("username").value = '';
        document.getElementById("passcode").value = '';
        document.getElementById("username").focus();
    });
}
