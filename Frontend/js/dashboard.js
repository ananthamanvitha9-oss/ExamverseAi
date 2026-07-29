// Dashboard specific logic (Step 12)
console.log('Dashboard JS loaded');

document.addEventListener('DOMContentLoaded', () => {
    // 1. Grab elements from the DOM
    const welcomeMessage = document.getElementById('welcome-message');
    const selectedExam = document.getElementById('selected-exam');
    const selectedLanguage = document.getElementById('selected-language');
    const streakCounter = document.getElementById('streak-counter');
    const progressPercentage = document.getElementById('progress-percentage');
    const progressBar = document.getElementById('progress-bar');
    const editBtn = document.getElementById('edit-profile-btn');

    // 2. Load the profile using our new ProfileManager (Step 11)
    const profile = ProfileManager.getProfile();

    // 3. Inject the data into the HTML
    if (welcomeMessage) {
        welcomeMessage.innerText = `Welcome back, ${profile.name}!`;
    }
    if (selectedExam) {
        selectedExam.innerText = profile.exam;
    }
    if (selectedLanguage) {
        selectedLanguage.innerText = profile.language;
    }
    if (streakCounter) {
        streakCounter.innerText = profile.streak;
    }
    if (progressPercentage && progressBar) {
        progressPercentage.innerText = profile.progress;
        // Animate the progress bar dynamically based on their saved progress
        setTimeout(() => {
            progressBar.style.width = `${profile.progress}%`;
        }, 300); // Wait a tiny bit so the animation triggers smoothly on load
    }

    // 4. Fake "Edit Profile" feature to show modifying localStorage
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            const newExam = prompt("What exam are you studying for now?", profile.exam);
            if (newExam) {
                profile.exam = newExam;
                // Save it back to LocalStorage
                ProfileManager.saveProfile(profile);
                // Update the UI immediately
                selectedExam.innerText = newExam;
                alert("Exam updated! Refresh the page to prove it saved.");
            }
        });
    }
});
