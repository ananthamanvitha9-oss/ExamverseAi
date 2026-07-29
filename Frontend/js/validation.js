// Form validation logic
console.log('Validation JS loaded');

// Helper functions for validating different fields
const Validation = {
    // Check if name is at least 3 characters
    isValidName: (name) => {
        return name.trim().length >= 3;
    },
    
    // Check if email format is correct using a simple regex
    isValidEmail: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email.trim());
    },
    
    // Check if phone is exactly 10 digits
    isValidPhone: (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone.trim());
    },
    
    // Check if password is at least 8 characters
    isValidPassword: (password) => {
        return password.length >= 8;
    },

    // Check if password and confirm password match
    doPasswordsMatch: (password, confirmPassword) => {
        return password === confirmPassword;
    }
};

// Make it available globally
window.Validation = Validation;
