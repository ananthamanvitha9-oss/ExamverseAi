// Login specific logic
console.log('Login JS loaded');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    const messageBox = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop browser from reloading

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Use the Validation object from validation.js
            if (!Validation.isValidEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }
            if (!Validation.isValidPassword(password)) {
                showError('Password must be at least 8 characters long.');
                return;
            }

            // Success feedback
            messageBox.textContent = `✅ Login successful! Redirecting to dashboard...`;
            messageBox.className = 'form-message success';
            messageBox.classList.remove('hidden');
            form.reset();
            
            // Redirect to dashboard after 1.5 seconds
            setTimeout(() => {
                window.location.href = './dashboard.html';
            }, 1500);
        });
    }

    function showError(msg) {
        messageBox.textContent = `❌ ${msg}`;
        messageBox.className = 'form-message error';
        messageBox.classList.remove('hidden');
    }
});
