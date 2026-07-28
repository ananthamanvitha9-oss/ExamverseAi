document.addEventListener('DOMContentLoaded', () => {
  // Set current year
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const API_BASE_URL = 'http://localhost/examverse-backend';

  // 1. Fetch and render mock tests
  const testsContainer = document.getElementById('tests-container');
  if (testsContainer) {
    fetch(`${API_BASE_URL}/api/mock-tests`)
      .then(response => {
        if (!response.ok) throw new Error('API network error');
        return response.json();
      })
      .then(result => {
        const tests = result.data || [];
        if (tests.length === 0) {
          testsContainer.innerHTML = '<div class="loading">No practice tests available at the moment.</div>';
          return;
        }

        testsContainer.innerHTML = '';
        tests.forEach(test => {
          const card = document.createElement('div');
          card.className = 'test-card';
          
          card.innerHTML = `
            <div>
              <div class="test-meta">
                <span>Test ID: #${test.id}</span>
                <span>Active</span>
              </div>
              <h3>${escapeHtml(test.title)}</h3>
              <div class="test-details">
                <span>⏱️ ${test.duration_minutes} Mins</span>
                <span>📋 ${test.total_questions} Questions</span>
                <span>🎯 Target: ${test.passing_score} Marks</span>
              </div>
            </div>
            <button class="btn btn-secondary start-test-btn" data-id="${test.id}">Start Practice</button>
          `;
          
          testsContainer.appendChild(card);
        });

        // Add dummy event listener for start test
        document.querySelectorAll('.start-test-btn').forEach(btn => {
          btn.addEventListener('click', (e) => {
            const testId = e.target.getAttribute('data-id');
            alert(`Ready to start Test #${testId}! This feature will be available in the full ExamVerse AI platform.`);
          });
        });
      })
      .catch(error => {
        console.error('Error fetching mock tests:', error);
        // Render fallback UI in case database/backend is not yet active in Apache
        renderFallbackTests(testsContainer);
      });
  }

  // 2. Handle early access waitlist form submission
  const earlyAccessForm = document.getElementById('early-access-form');
  const formMessage = document.getElementById('form-message');

  if (earlyAccessForm) {
    earlyAccessForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('student-name').value.trim();
      const email = document.getElementById('student-email').value.trim();
      const phone = document.getElementById('student-phone').value.trim();
      const exam = document.getElementById('student-exam').value;

      formMessage.classList.add('hidden');
      formMessage.className = 'form-message'; // Reset classes

      const submitBtn = earlyAccessForm.querySelector('.btn-submit');
      const originalBtnText = submitBtn.textContent;
      submitBtn.textContent = 'Joining waitlist...';
      submitBtn.disabled = true;

      fetch(`${API_BASE_URL}/api/students`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, phone, exam })
      })
        .then(async response => {
          const responseData = await response.json();
          if (!response.ok) {
            throw new Error(responseData.error || 'Failed to submit registration');
          }
          return responseData;
        })
        .then(data => {
          formMessage.textContent = 'Success! You have been added to the ExamVerse AI Waitlist. See you on the inside!';
          formMessage.classList.add('success');
          formMessage.classList.remove('hidden');
          earlyAccessForm.reset();
        })
        .catch(error => {
          console.error('Waitlist submission error:', error);
          formMessage.textContent = error.message || 'Server error. Please ensure XAMPP Apache & MySQL are running.';
          formMessage.classList.add('error');
          formMessage.classList.remove('hidden');
        })
        .finally(() => {
          submitBtn.textContent = originalBtnText;
          submitBtn.disabled = false;
        });
    });
  }
});

// Helper: Escape HTML strings to prevent XSS
function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Fallback Mock Tests if API server is not running or reachable
function renderFallbackTests(container) {
  const fallbackTests = [
    { id: 1, title: 'UPSC Prelims Paper 1: General Studies Mock 1', duration_minutes: 120, total_questions: 100, passing_score: 90 },
    { id: 2, title: 'JEE Advanced: Full Physics & Chemistry Practice', duration_minutes: 180, total_questions: 60, passing_score: 120 },
    { id: 3, title: 'SSC CGL Tier-1: General Intelligence and Reasoning', duration_minutes: 60, total_questions: 25, passing_score: 35 }
  ];

  container.innerHTML = '';
  
  // Informative header that local backend server needs to be running for real data
  const infoHeader = document.createElement('div');
  infoHeader.className = 'loading';
  infoHeader.style.padding = '0.5rem';
  infoHeader.style.fontSize = '0.9rem';
  infoHeader.innerHTML = '<span style="color: #ffc861;">⚠️ Running on Demo Mode.</span> Start XAMPP Apache server to load live tests from database.';
  container.appendChild(infoHeader);

  fallbackTests.forEach(test => {
    const card = document.createElement('div');
    card.className = 'test-card';
    card.innerHTML = `
      <div>
        <div class="test-meta">
          <span>Test ID: #${test.id}</span>
          <span>Demo</span>
        </div>
        <h3>${test.title}</h3>
        <div class="test-details">
          <span>⏱️ ${test.duration_minutes} Mins</span>
          <span>📋 ${test.total_questions} Questions</span>
          <span>🎯 Target: ${test.passing_score} Marks</span>
        </div>
      </div>
      <button class="btn btn-secondary start-test-btn" data-id="${test.id}">Start Practice</button>
    `;
    container.appendChild(card);
  });

  document.querySelectorAll('.start-test-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const testId = e.target.getAttribute('data-id');
      alert(`Ready to start Test #${testId}! (Demo Mode - Start XAMPP Apache for live platform).`);
    });
  });
}

