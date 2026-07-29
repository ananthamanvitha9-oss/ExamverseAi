// Main application logic
console.log('App JS loaded');

// --- Step 2 Assignment: JS Basics ---
// Variables & Data Types
const studentName = "Aman Kumar"; // String
let selectedExam = "UPSC CSE";      // String
let language = "English";         // String
let age = 22;                     // Number (Integer)

// Output to browser console
console.log("--- Student Profile ---");
console.log("Name:", studentName);
console.log("Exam:", selectedExam);
console.log("Language:", language);
console.log("Age:", age);
// ------------------------------------

// --- Step 3 Assignment: Control Flow ---
console.log("\n--- Exam Advice ---");
if (selectedExam === "UPSC CSE") {
    console.log("Tip: Focus on Current Affairs and Answer Writing.");
} else if (selectedExam === "NEET UG") {
    console.log("Tip: NCERT Biology is your bible. Revise daily.");
} else if (selectedExam === "JEE Advanced") {
    console.log("Tip: Practice numericals and mock tests heavily.");
} else {
    console.log("Tip: Stay consistent and follow your syllabus.");
}
// ------------------------------------

// --- Step 4 Assignment: Loops & Arrays ---
console.log("\n--- Available Exams (using Loop) ---");
const availableExams = ["UPSC CSE", "NEET UG", "JEE Advanced", "SSC CGL", "Banking PO"];

// Using a for...of loop to iterate through the array
for (let exam of availableExams) {
    console.log("-> " + exam);
}
// ------------------------------------

// --- Step 5 Assignment: Functions ---
// Function Declaration
function calculateProgress(chaptersCompleted, totalChapters) {
    if (totalChapters === 0) return 0;
    const progress = (chaptersCompleted / totalChapters) * 100;
    return Math.round(progress);
}

// Arrow Function alternative (same logic as above)
const calculateProgressArrow = (completed, total) => total === 0 ? 0 : Math.round((completed / total) * 100);

console.log("\n--- Study Progress ---");
console.log("Math Progress: " + calculateProgress(4, 10) + "%");
// ------------------------------------

// --- Step 6 Assignment: Arrays & Objects ---
// Array of exams
const examCategories = [
    "UPSC", 
    "SSC", 
    "Banking", 
    "Railways", 
    "JEE", 
    "NEET"
];

// Object for a student
const studentProfile = {
    name: "Aman Kumar",
    email: "aman.kumar@example.com",
    exam: "UPSC",
    progress: calculateProgress(25, 100) // Using our function from Step 5!
};

console.log("\n--- Advanced Student Object ---");
console.log(studentProfile.name + " is preparing for " + studentProfile.exam);
console.log("Current Progress: " + studentProfile.progress + "%");
console.log("All supported exams:", examCategories.join(", "));
// ------------------------------------

// --- Step 7 & 8: DOM Manipulation & Events ---
// Wait for the HTML to fully load before trying to find elements
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Select the elements using their IDs
    const heroTitle = document.getElementById('hero-title');
    const changeTitleBtn = document.getElementById('change-title-btn');
    const startLearningBtn = document.getElementById('start-learning-btn');

    // Step 7: Mini Project - Change Title on Button Click
    if (changeTitleBtn && heroTitle) {
        changeTitleBtn.addEventListener('click', () => {
            // Change Text
            heroTitle.innerText = "Master Exams with AI.";
            // Change Style directly
            heroTitle.style.color = "var(--primary-2)";
            // Add a CSS class
            heroTitle.classList.add('animate-pulse');
        });
    }

    // Step 8: Assignment - Welcome message on "Start Learning"
    if (startLearningBtn) {
        startLearningBtn.addEventListener('click', (event) => {
            // Prevent the link from immediately jumping to the next page
            event.preventDefault(); 
            
            // Show interactive alert
            alert("Welcome to ExamVerse AI! Let's start your journey.");
            
            // After they click OK on the alert, manually send them to the register page
            window.location.href = startLearningBtn.href;
        });
    }
});
// ------------------------------------
