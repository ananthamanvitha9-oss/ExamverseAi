import { useState, useEffect } from 'react';
import './styles.css';

const API_BASE_URL = 'http://localhost/examverse-backend';

function App() {
  const [tests, setTests] = useState([]);
  const [loadingTests, setLoadingTests] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    exam: ''
  });
  const [formStatus, setFormStatus] = useState({
    type: '', // 'success' or 'error'
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/mock-tests`)
      .then(res => {
        if (!res.ok) throw new Error('API server unreachable');
        return res.json();
      })
      .then(result => {
        setTests(result.data || []);
        setLoadingTests(false);
      })
      .catch(err => {
        console.warn('Backend API not reachable. Falling back to Demo Mode:', err);
        // Load fallback demo data
        setTests([
          { id: 1, title: 'UPSC Prelims Paper 1: General Studies Mock 1', duration_minutes: 120, total_questions: 100, passing_score: 90 },
          { id: 2, title: 'JEE Advanced: Full Physics & Chemistry Practice', duration_minutes: 180, total_questions: 60, passing_score: 120 },
          { id: 3, title: 'SSC CGL Tier-1: General Intelligence and Reasoning', duration_minutes: 60, total_questions: 25, passing_score: 35 }
        ]);
        setIsDemoMode(true);
        setLoadingTests(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormStatus({ type: '', message: '' });

    fetch(`${API_BASE_URL}/api/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to submit registration');
        }
        return data;
      })
      .then(() => {
        setFormStatus({
          type: 'success',
          message: 'Success! You have been added to the ExamVerse AI Waitlist. See you on the inside!'
        });
        setFormData({ name: '', email: '', phone: '', exam: '' });
      })
      .catch(err => {
        console.error('Waitlist submit error:', err);
        setFormStatus({
          type: 'error',
          message: err.message || 'Server error. Please ensure XAMPP Apache & MySQL are running.'
        });
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const handleStartTest = (testId) => {
    alert(`Ready to start Test #${testId}! This feature will be available in the full ExamVerse AI platform.`);
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="container">
          <p className="eyebrow">AI-powered learning for every Indian exam</p>
          <h1>ExamVerse AI</h1>
          <p className="lead">
            One smart platform for UPSC, SSC, Banking, Railways, JEE, NEET, GATE, CAT,
            and more.
          </p>
          <div className="actions">
            <a className="btn primary" href="#practice">Start Practice</a>
            <a className="btn secondary" href="#features">Explore Features</a>
          </div>
        </div>
      </header>

      <main id="features" className="container section">
        <h2>What students get</h2>
        <div className="feature-grid">
          <article className="card">
            <h3>AI Tutor</h3>
            <p>Get concept explanations, doubt resolution, and personalized study support instantly.</p>
          </article>
          <article className="card">
            <h3>Mock Tests</h3>
            <p>Practice full-length tests with real exam-style questions and instant feedback.</p>
          </article>
          <article className="card">
            <h3>PYQs</h3>
            <p>Access previous year questions by subject, topic, and exam category.</p>
          </article>
          <article className="card">
            <h3>Current Affairs</h3>
            <p>Stay updated with curated daily and weekly current affairs summaries.</p>
          </article>
          <article className="card">
            <h3>Notes</h3>
            <p>Organize clean, searchable notes from lectures, books, and revision sessions.</p>
          </article>
          <article className="card">
            <h3>Study Planner</h3>
            <p>Create day-wise plans that fit your schedule, goals, and exam timeline.</p>
          </article>
        </div>

        {/* Practice Zone section */}
        <section id="practice" className="section" style={{ marginTop: '3rem', paddingBottom: 0 }}>
          <div className="section-heading">
            <p className="eyebrow">Practice Zone</p>
            <h2>Try our live mock tests and practice papers</h2>
            {isDemoMode && (
              <p style={{ color: '#ffc861', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                ⚠️ Running on Demo Mode. Start XAMPP Apache server to load live tests from database.
              </p>
            )}
          </div>

          {loadingTests ? (
            <div className="loading">Loading available tests...</div>
          ) : (
            <div className="tests-grid">
              {tests.map(test => (
                <article key={test.id} className="test-card">
                  <div>
                    <div className="test-meta">
                      <span>Test ID: #{test.id}</span>
                      <span>{isDemoMode ? 'Demo' : 'Active'}</span>
                    </div>
                    <h3>{test.title}</h3>
                    <div className="test-details">
                      <span>⏱️ {test.duration_minutes} Mins</span>
                      <span>📋 {test.total_questions} Questions</span>
                      <span>🎯 Target: {test.passing_score} Marks</span>
                    </div>
                  </div>
                  <button 
                    className="btn secondary btn-submitStart" 
                    onClick={() => handleStartTest(test.id)}
                    style={{ border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', borderRadius: '999px', padding: '0.7rem' }}
                  >
                    Start Practice
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* CTA Waitlist section */}
        <aside className="cta-box">
          <h2>Ready to study with the smartest AI companion?</h2>
          <p>Join the next generation of exam preparation with ExamVerse AI.</p>
          
          <form className="cta-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                required 
                value={formData.name}
                onChange={handleInputChange}
              />
              <input 
                type="email" 
                name="email" 
                placeholder="Email Address" 
                required 
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <input 
                type="tel" 
                name="phone" 
                placeholder="Phone Number (Optional)" 
                value={formData.phone}
                onChange={handleInputChange}
              />
              <select 
                name="exam" 
                required 
                value={formData.exam}
                onChange={handleInputChange}
              >
                <option value="" disabled>Select Target Exam</option>
                <option value="UPSC">UPSC Civil Services</option>
                <option value="JEE Advanced">JEE Advanced</option>
                <option value="SSC CGL">SSC CGL</option>
                <option value="CAT">CAT (Management)</option>
                <option value="GATE">GATE</option>
                <option value="Other">Other Exam</option>
              </select>
            </div>
            <button type="submit" className="btn primary btn-submit" disabled={submitting}>
              {submitting ? 'Joining waitlist...' : 'Join the Waitlist'}
            </button>
          </form>

          {formStatus.message && (
            <div className={`form-message ${formStatus.type}`}>
              {formStatus.message}
            </div>
          )}
        </aside>
      </main>

      <section id="about" className="container section">
        <h2>Built for modern exam prep</h2>
        <p>
          ExamVerse AI combines personalization, practice, and AI guidance into a single
          experience designed for serious learners.
        </p>
      </section>

      <footer style={{ padding: '2rem 0', borderTop: '1px solid rgba(255,255,255,0.05)', marginTop: '4rem' }}>
        <p style={{ textAlign: 'center', color: '#9fb0c9', margin: 0, fontSize: '0.9rem' }}>
          © {new Date().getFullYear()} ExamVerse AI. Built for learners, by learners.
        </p>
      </footer>
    </div>
  );
}

export default App;

