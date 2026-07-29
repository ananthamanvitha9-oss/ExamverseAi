import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ExamSection from './components/ExamSection';

// Temporary Home Page Component
const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <ExamSection />
      {/* Footer will go here next! */}
    </>
  );
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* We will add routes for /login, /register, etc. later */}
      </Routes>
    </Router>
  );
}

export default App;
