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

    useEffect(() => {
        const logStudySession = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await api.post('/gamification/log-study', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setStreak(response.data.current_streak || 0);
                }
            } catch (error) {
                console.error("Failed to log study session", error);
            }
        };

        logStudySession();
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
                        <StatisticsCard title="Hours Studied" value="2.5 hrs" subtitle="Today's Study Time" icon="⏱️" color="#3b82f6" />
                        <StatisticsCard title="Weekly Progress" value="+12%" subtitle="vs Last Week" icon="📈" color="#8b5cf6" />
                        <StatisticsCard title="Study Streak" value={`${streak} Days`} subtitle="Keep it going!" icon="🔥" color="#f59e0b" />
                        <StatisticsCard title="Completed Chapters" value="8" subtitle="Across 3 Subjects" icon="📚" color="#10b981" />
                    </div>
                </div>

                {/* Third Row: Continue Learning */}
                <div>
                    <h3 className={styles.sectionTitle}>Continue Learning</h3>
                    <div className={styles.courseGrid}>
                        <CourseCard id={20} title="UPSC Civil Services 2026" chapter="History: Ancient India" progress={58} />
                        <CourseCard id={21} title="SSC CGL Tier 1 & 2" chapter="Quantitative Aptitude: Arithmetic" progress={32} />
                        <CourseCard id={22} title="IBPS PO / Clerk Complete" chapter="Reasoning Ability: Puzzles" progress={80} />
                    </div>
                </div>

                {/* Fourth Row: AI Tutor Banner */}
                <AITutorCard />

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
