import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
    Flame, Clock, TrendingUp, BookOpen, ChevronRight, 
    Target, Calendar as CalendarIcon, Sparkles, Activity, AlertCircle
} from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Dashboard.module.css';
import api from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [streak, setStreak] = useState(0);
    const [analytics, setAnalytics] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const streakResponse = await api.post('/gamification/log-study', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStreak(streakResponse.data.current_streak || 0);

                    const analyticsResponse = await api.get('/progress/dashboard', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAnalytics(analyticsResponse.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (isLoading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingState}>
                    <div className={styles.spinner}></div>
                    <p>Loading your command center...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <Helmet>
                <title>Dashboard | ExamVerse AI</title>
                <meta name="description" content="Track your progress and access your AI study tools." />
            </Helmet>
            
            <div className={styles.dashboardContainer}>
                {/* 1. WELCOME SECTION */}
                <div className={styles.welcomeSection}>
                    <div>
                        <h1 className={styles.welcomeTitle}>{greeting()}, {user?.full_name?.split(' ')[0] || 'Student'}! 👋</h1>
                        <p className={styles.welcomeSubtitle}>Let's make today count. Here's your study overview.</p>
                    </div>
                    <Link to="/dashboard/ai-tutor" className="btn btn-primary">
                        <Sparkles size={18} /> Ask AI Tutor
                    </Link>
                </div>

                {/* 2. STATS OVERVIEW */}
                <div className={styles.statsGrid}>
                    <div className={`card ${styles.statCard}`}>
                        <div className={styles.statIcon} style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
                            <Flame size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{streak} Days</h3>
                            <p>Study Streak</p>
                        </div>
                    </div>
                    <div className={`card ${styles.statCard}`}>
                        <div className={styles.statIcon} style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{analytics?.stats?.hours_studied || '0'} hrs</h3>
                            <p>Study Time</p>
                        </div>
                    </div>
                    <div className={`card ${styles.statCard}`}>
                        <div className={styles.statIcon} style={{ background: 'var(--success-bg)', color: 'var(--success)' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{analytics?.stats?.weekly_progress || '0%'}</h3>
                            <p>Weekly Progress</p>
                        </div>
                    </div>
                    <div className={`card ${styles.statCard}`}>
                        <div className={styles.statIcon} style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6' }}>
                            <BookOpen size={24} />
                        </div>
                        <div className={styles.statInfo}>
                            <h3>{analytics?.stats?.completed_lessons || '0'}</h3>
                            <p>Lessons Completed</p>
                        </div>
                    </div>
                </div>

                {/* 3. MAIN CONTENT GRID */}
                <div className={styles.mainContentGrid}>
                    {/* LEFT COLUMN */}
                    <div className={styles.leftCol}>
                        {/* CONTINUE LEARNING */}
                        <div className={styles.sectionHeader}>
                            <h2>Continue Learning</h2>
                            <Link to="/dashboard/courses" className={styles.viewAll}>View All <ChevronRight size={16} /></Link>
                        </div>
                        <div className={styles.courseList}>
                            {analytics?.active_courses?.length > 0 ? (
                                analytics.active_courses.map(course => (
                                    <div key={course.id} className={`card card-hover ${styles.courseItem}`}>
                                        <div className={styles.courseInfo}>
                                            <h4>{course.title}</h4>
                                            <p>{course.chapter}</p>
                                        </div>
                                        <div className={styles.courseProgress}>
                                            <div className={styles.progressBar}>
                                                <div className={styles.progressFill} style={{ width: `${course.progress || 0}%` }}></div>
                                            </div>
                                            <span>{course.progress || 0}%</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className={`card ${styles.emptyState}`}>
                                    <BookOpen size={40} className={styles.emptyIcon} />
                                    <p>No active courses yet. Start your journey!</p>
                                    <Link to="/dashboard/syllabus" className="btn btn-outline">Explore Courses</Link>
                                </div>
                            )}
                        </div>

                        {/* TEST PERFORMANCE (Placeholder mapping to real concept) */}
                        <div className={styles.sectionHeader}>
                            <h2>Recent Test Performance</h2>
                            <Link to="/dashboard/tests" className={styles.viewAll}>View All <ChevronRight size={16} /></Link>
                        </div>
                        <div className={`card ${styles.performanceCard}`}>
                            <Activity size={40} className={styles.emptyIcon} />
                            <p>Take a mock test to see your performance analysis.</p>
                            <Link to="/dashboard/tests" className="btn btn-primary" style={{marginTop: '1rem'}}>Take Mock Test</Link>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className={styles.rightCol}>
                        {/* AI RECOMMENDATIONS */}
                        <div className={`card ${styles.aiCard}`}>
                            <div className={styles.aiCardHeader}>
                                <Sparkles size={20} />
                                <h3>AI Recommendations</h3>
                            </div>
                            <div className={styles.aiContent}>
                                <div className={styles.aiItem}>
                                    <AlertCircle size={16} className={styles.aiIcon} />
                                    <p>Based on your last quiz, you should review <strong>Modern History</strong>.</p>
                                </div>
                                <div className={styles.aiItem}>
                                    <Target size={16} className={styles.aiIcon} />
                                    <p>You have a 5-day streak! Complete today's Daily Quiz to keep it going.</p>
                                </div>
                            </div>
                            <Link to="/dashboard/study-planner" className="btn btn-secondary" style={{width: '100%'}}>
                                View Study Plan
                            </Link>
                        </div>

                        {/* UPCOMING TASKS */}
                        <div className={`card ${styles.tasksCard}`}>
                            <h3>Upcoming Tasks</h3>
                            <div className={styles.taskList}>
                                <div className={styles.taskItem}>
                                    <CalendarIcon size={18} className={styles.taskIcon} />
                                    <div>
                                        <h4>Daily Current Affairs</h4>
                                        <p>Due Today</p>
                                    </div>
                                    <Link to="/dashboard/daily-quiz" className="btn btn-ghost">Start</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
