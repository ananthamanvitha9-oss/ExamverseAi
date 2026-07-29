// Theme switching logic (Dark/Light mode)
console.log('Theme JS loaded');

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement; // the <html> tag

    // 1. Check localStorage for saved theme on page load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        // If they saved a preference, apply it
        htmlElement.setAttribute('data-theme', savedTheme);
        updateButtonText(savedTheme);
    }

    // 2. Add event listener to the toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            // Check what the current theme is
            const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
            
            // Switch it
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            htmlElement.setAttribute('data-theme', newTheme);
            
            // 3. Save the new preference to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update button UI
            updateButtonText(newTheme);
        });
    }

    // Helper function to update button icon/text
    function updateButtonText(theme) {
        if (themeToggleBtn) {
            themeToggleBtn.innerText = theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
        }
    }
});
