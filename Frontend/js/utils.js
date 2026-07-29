// Utility functions
console.log('Utils JS loaded');

// --- Step 11: Local Storage Profile Manager ---
const ProfileManager = {
    // Default mock data if nothing is saved
    defaultProfile: {
        name: "Aman Kumar",
        exam: "UPSC CSE",
        language: "English",
        streak: 12,
        progress: 45
    },

    // Save profile to localStorage
    saveProfile: function(profileData) {
        // We use JSON.stringify because localStorage only saves Strings!
        localStorage.setItem('studentProfile', JSON.stringify(profileData));
    },

    // Load profile from localStorage
    getProfile: function() {
        const saved = localStorage.getItem('studentProfile');
        if (saved) {
            // Convert the string back into a JavaScript Object
            return JSON.parse(saved);
        }
        // If nothing is saved yet, save the default and return it
        this.saveProfile(this.defaultProfile);
        return this.defaultProfile;
    }
};

// Make it available globally
window.ProfileManager = ProfileManager;
