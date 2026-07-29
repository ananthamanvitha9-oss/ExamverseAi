// Registration specific logic
console.log('Register JS loaded');

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('register-form');
    const messageBox = document.getElementById('form-message');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault(); // Stop browser from reloading

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const confirm = document.getElementById('confirm-password').value;

            // Use the Validation object from validation.js
            if (!Validation.isValidName(name)) {
                showError('Please enter a valid full name (min 3 characters).');
                return;
            }
            if (!Validation.isValidEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }
            if (!Validation.isValidPhone(phone)) {
                showError('Please enter a valid 10-digit phone number.');
                return;
            }
            if (!Validation.isValidPassword(password)) {
                showError('Password must be at least 8 characters long.');
                return;
            }
            if (!Validation.doPasswordsMatch(password, confirm)) {
                showError('Passwords do not match. Please re-enter them.');
                return;
            }

            // Success feedback
            messageBox.textContent = `✅ Account created successfully for ${name}! Please log in.`;
            messageBox.className = 'form-message success';
            messageBox.classList.remove('hidden');
            form.reset();
        });
    }

    function showError(msg) {
        messageBox.textContent = `❌ ${msg}`;
        messageBox.className = 'form-message error';
        messageBox.classList.remove('hidden');
    }
});
