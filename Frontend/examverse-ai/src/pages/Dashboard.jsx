import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import WelcomeCard from '../components/dashboard/WelcomeCard';
import ProgressCard from '../components/dashboard/ProgressCard';
import CourseCard from '../components/dashboard/CourseCard';
import DailyGoal from '../components/dashboard/DailyGoal';
import StatisticsCard from '../components/dashboard/StatisticsCard';
import AITutorCard from '../components/dashboard/AITutorCard';
import styles from './Dashboard.module.css';
import api from '../services/api';

const Dashboard = () => {
    const [streak, setStreak] = useState(0);
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Log study session to get streak
                    const streakResponse = await api.post('/gamification/log-study', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStreak(streakResponse.data.current_streak || 0);

                    // Fetch analytics
                    const analyticsResponse = await api.get('/progress/dashboard', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setAnalytics(analyticsResponse.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            }
        };

        fetchDashboardData();
    }, []);

    return (
        <DashboardLayout>
            <Helmet>
                <title>Dashboard | Examverse AI</title>
                <meta name="description" content="Track your progress and access your AI study tools." />
            </Helmet>
            <div className={styles.dashboardGrid}>
                {/* Top Row: Welcome & Overall Progress */}
                <div className={styles.topRow}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <WelcomeCard />
                        <ProgressCard />
                    </div>
                    <DailyGoal />
                </div>

                {/* Second Row: Statistics Cards */}
                <div>
                    <h3 className={styles.sectionTitle}>Your Analytics</h3>
                    <div className={styles.statsGrid}>
                        <StatisticsCard title="Hours Studied" value={analytics?.stats?.hours_studied || '0 hrs'} subtitle="Total Study Time" icon="⏱️" color="#3b82f6" />
                        <StatisticsCard title="Weekly Progress" value={analytics?.stats?.weekly_progress || '0%'} subtitle="vs Last Week" icon="📈" color="#8b5cf6" />
                        <StatisticsCard title="Study Streak" value={`${streak} Days`} subtitle="Keep it going!" icon="🔥" color="#f59e0b" />
                        <StatisticsCard title="Completed Lessons" value={analytics?.stats?.completed_lessons || 0} subtitle="Lessons Finished" icon="📚" color="#10b981" />
                    </div>
                </div>

                {/* Third Row: Continue Learning */}
                <div>
                    <h3 className={styles.sectionTitle}>Continue Learning</h3>
                    <div className={styles.courseGrid}>
                        {analytics?.active_courses?.length > 0 ? (
                            analytics.active_courses.map(course => (
                                <CourseCard 
                                    key={course.id} 
                                    id={course.id} 
                                    title={course.title} 
                                    chapter={course.chapter} 
                                    progress={course.progress} 
                                />
                            ))
                        ) : (
                            <p style={{ color: '#666', gridColumn: 'span 3' }}>You haven't enrolled in any courses yet! Go to the Explore page to start learning.</p>
                        )}
                    </div>
                </div>

                {/* Fourth Row: AI Tutor Banner */}
                <AITutorCard />

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
