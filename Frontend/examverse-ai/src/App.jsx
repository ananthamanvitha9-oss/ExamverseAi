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
import Pricing from './pages/Pricing';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import PageWrapper from './components/PageWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin Route Component
const AdminRoute = ({ children }) => {
    const { token, user } = useAuth();
    if (!token) return <Navigate to="/login" replace />;
    if (user && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
    return children;
};

function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <AuthProvider>
          <Router>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
            {/* Note: Navbar is now part of Home explicitly so it can be omitted on Dashboard */}
            <Routes>
              <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
              <Route path="/login" element={<PageWrapper><><Navbar /><Login /></></PageWrapper>} />
              <Route path="/register" element={<PageWrapper><><Navbar /><Register /></></PageWrapper>} />
              <Route path="/forgot-password" element={<PageWrapper><><Navbar /><ForgotPassword /></></PageWrapper>} />
              <Route path="/pricing" element={<PageWrapper><><Navbar /><Pricing /><Footer /></></PageWrapper>} />
              
              {/* Super Admin Route */}
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* Protected Routes */}
              <Route path="/dashboard" element={<ProtectedRoute><PageWrapper><Dashboard /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/analytics" element={<ProtectedRoute><PageWrapper><Analytics /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/study-room" element={<ProtectedRoute><PageWrapper><StudyRoom /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/current-affairs" element={<ProtectedRoute><PageWrapper><CurrentAffairsMap /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/notifications" element={<ProtectedRoute><PageWrapper><Notifications /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/leaderboard" element={<ProtectedRoute><PageWrapper><Leaderboard /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/study-planner" element={<ProtectedRoute><PageWrapper><StudyPlanner /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/profile" element={<ProtectedRoute><PageWrapper><Profile /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/mock-tests/:id" element={<ProtectedRoute><PageWrapper><MockTestInterface /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/ai-tutor" element={<ProtectedRoute><PageWrapper><AITutor /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/courses" element={<ProtectedRoute><PageWrapper><MyCourses /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/courses/:id" element={<ProtectedRoute><PageWrapper><CourseDetails /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/news" element={<ProtectedRoute><PageWrapper><CurrentAffairs /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/tests" element={<ProtectedRoute><PageWrapper><MockTests /></PageWrapper></ProtectedRoute>} />
              <Route path="/dashboard/map" element={<ProtectedRoute><PageWrapper><CurrentAffairsMap /></PageWrapper></ProtectedRoute>} />
            </Routes>
          </Router>

        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
