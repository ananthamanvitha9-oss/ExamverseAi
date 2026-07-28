document.addEventListener('DOMContentLoaded', () => {
  // Set current year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Handle forms (Login, Register, Contact) if present
  setupFormHandlers();
});

function setupFormHandlers() {
  // Contact Form
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const messageEl = document.getElementById('form-message');
      messageEl.textContent = 'Thank you! Your message has been sent successfully. We will get back to you shortly.';
      messageEl.className = 'form-message success';
      messageEl.classList.remove('hidden');
      contactForm.reset();
    });
  }

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const messageEl = document.getElementById('form-message');
      messageEl.textContent = `Welcome back! Logged in as ${email}. Redirecting to dashboard...`;
      messageEl.className = 'form-message success';
      messageEl.classList.remove('hidden');
      setTimeout(() => {
        alert('Authentication logic will be connected in Module 2!');
      }, 500);
    });
  }

  // Register Form
  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value;
      const messageEl = document.getElementById('form-message');
      messageEl.textContent = `Account created successfully for ${name}! Please login.`;
      messageEl.className = 'form-message success';
      messageEl.classList.remove('hidden');
      registerForm.reset();
    });
  }
}
