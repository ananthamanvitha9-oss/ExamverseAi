import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
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
import StudyRoom from './pages/StudyRoom';
import CurrentAffairsMap from './pages/CurrentAffairsMap';
import AdminDashboard from './pages/AdminDashboard';
import Leaderboard from './pages/Leaderboard';
import StudyPlanner from './pages/StudyPlanner';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (user && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          {/* Note: Navbar is now part of Home explicitly so it can be omitted on Dashboard */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<><Navbar /><Login /></>} />
            <Route path="/register" element={<><Navbar /><Register /></>} />
            <Route path="/forgot-password" element={<><Navbar /><ForgotPassword /></>} />
            
            {/* Super Admin Route */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
            <Route path="/dashboard/study-room" element={<ProtectedRoute><StudyRoom /></ProtectedRoute>} />
            <Route path="/dashboard/current-affairs" element={<ProtectedRoute><CurrentAffairsMap /></ProtectedRoute>} />
            <Route path="/dashboard/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="/dashboard/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
            <Route path="/dashboard/study-planner" element={<ProtectedRoute><StudyPlanner /></ProtectedRoute>} />
            <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/dashboard/mock-tests/:id" element={<ProtectedRoute><MockTestInterface /></ProtectedRoute>} />
            <Route path="/dashboard/ai-tutor" element={<ProtectedRoute><AITutor /></ProtectedRoute>} />
            <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="/dashboard/courses" element={<ProtectedRoute><MyCourses /></ProtectedRoute>} />
            <Route path="/dashboard/courses/:id" element={<ProtectedRoute><CourseDetails /></ProtectedRoute>} />
            <Route path="/dashboard/news" element={<ProtectedRoute><CurrentAffairs /></ProtectedRoute>} />
            <Route path="/dashboard/tests" element={<ProtectedRoute><MockTests /></ProtectedRoute>} />
            <Route path="/dashboard/map" element={<ProtectedRoute><CurrentAffairsMap /></ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
