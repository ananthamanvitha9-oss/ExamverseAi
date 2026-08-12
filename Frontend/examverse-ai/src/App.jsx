import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const ForgotPassword = React.lazy(() => import('./pages/ForgotPassword'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const MyCourses = React.lazy(() => import('./pages/MyCourses'));
const CourseDetails = React.lazy(() => import('./pages/CourseDetails'));
const CurrentAffairs = React.lazy(() => import('./pages/CurrentAffairs'));
const MockTests = React.lazy(() => import('./pages/MockTests'));
const MockTestInterface = React.lazy(() => import('./pages/MockTestInterface'));
const AITutor = React.lazy(() => import('./pages/AITutor'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Notes = React.lazy(() => import('./pages/Notes'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Notifications = React.lazy(() => import('./pages/Notifications'));
const StudyRoom = React.lazy(() => import('./pages/StudyRoom'));
const CurrentAffairsMap = React.lazy(() => import('./pages/CurrentAffairsMap'));
const AdminDashboardPage = React.lazy(() => import('./pages/AdminDashboard'));
const Leaderboard = React.lazy(() => import('./pages/Leaderboard'));
const StudyPlanner = React.lazy(() => import('./pages/StudyPlanner'));
const FocusTimer = React.lazy(() => import('./pages/FocusTimer'));
const Syllabus = React.lazy(() => import('./pages/Syllabus'));
const StudyExplorer = React.lazy(() => import('./pages/StudyExplorer'));
const PracticeQuiz = React.lazy(() => import('./pages/PracticeQuiz'));
const DailyQuiz = React.lazy(() => import('./pages/DailyQuiz'));


// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminCurriculum = React.lazy(() => import('./pages/admin/AdminCurriculum'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const OAuthCallback = React.lazy(() => import('./pages/OAuthCallback'));
const Resources = React.lazy(() => import('./pages/Resources'));
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
            <React.Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-color)', color: 'var(--text-color)' }}>Loading...</div>}>
              <Routes>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><><Navbar /><Login /></></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><><Navbar /><Register /></></PageWrapper>} />
                <Route path="/forgot-password" element={<PageWrapper><><Navbar /><ForgotPassword /></></PageWrapper>} />
                <Route path="/pricing" element={<PageWrapper><><Navbar /><Pricing /><Footer /></></PageWrapper>} />
                <Route path="/auth/callback" element={<PageWrapper><OAuthCallback /></PageWrapper>} />
                
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
                <Route path="/dashboard/focus" element={<ProtectedRoute><PageWrapper><FocusTimer /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/syllabus" element={<ProtectedRoute><PageWrapper><Syllabus /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/study-explorer" element={<ProtectedRoute><PageWrapper><StudyExplorer /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/practice-quiz" element={<ProtectedRoute><PageWrapper><PracticeQuiz /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/daily-quiz" element={<ProtectedRoute><PageWrapper><DailyQuiz /></PageWrapper></ProtectedRoute>} />

                {/* Admin Routes */}
                <Route path="/admin" element={<ProtectedRoute><PageWrapper><AdminDashboard /></PageWrapper></ProtectedRoute>} />
                <Route path="/admin/curriculum" element={<ProtectedRoute><PageWrapper><AdminCurriculum /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/notes" element={<ProtectedRoute><PageWrapper><Notes /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/resources" element={<ProtectedRoute><PageWrapper><Resources /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/settings" element={<ProtectedRoute><PageWrapper><Settings /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/pricing" element={<ProtectedRoute><PageWrapper><Pricing /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/courses" element={<ProtectedRoute><PageWrapper><MyCourses /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/courses/:id" element={<ProtectedRoute><PageWrapper><CourseDetails /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/news" element={<ProtectedRoute><PageWrapper><CurrentAffairs /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/tests" element={<ProtectedRoute><PageWrapper><MockTests /></PageWrapper></ProtectedRoute>} />
                <Route path="/dashboard/map" element={<ProtectedRoute><PageWrapper><CurrentAffairsMap /></PageWrapper></ProtectedRoute>} />
              </Routes>
            </React.Suspense>
          </Router>

        </AuthProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
}

export default App;
