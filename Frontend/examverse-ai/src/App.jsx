import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import ExamSection from './components/ExamSection';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import MyCourses from './pages/MyCourses';
import CourseDetails from './pages/CourseDetails';
import CurrentAffairs from './pages/CurrentAffairs';
import MockTests from './pages/MockTests';
import MockTestInterface from './pages/MockTestInterface';
import AITutor from './pages/AITutor';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Temporary Home Page Component
const Home = () => {
  return (
    <>
      <Hero />
      <Features />
      <ExamSection />
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
          <Route path="/dashboard/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
          <Route path="/dashboard/news" element={<ProtectedRoute><CurrentAffairs /></ProtectedRoute>} />
          <Route path="/dashboard/tests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
          <Route path="/dashboard/mock-tests/:id" element={<ProtectedRoute><MockTestInterface /></ProtectedRoute>} />
          <Route path="/dashboard/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
          <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
