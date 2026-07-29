import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import WelcomeCard from '../components/Dashboard/WelcomeCard';
import ProgressCard from '../components/Dashboard/ProgressCard';
import CourseCard from '../components/Dashboard/CourseCard';
import DailyGoal from '../components/Dashboard/DailyGoal';
import StatisticsCard from '../components/Dashboard/StatisticsCard';
import AITutorCard from '../components/Dashboard/AITutorCard';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    return (
        <DashboardLayout>
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
                        <StatisticsCard title="Study Streak" value="14 Days" subtitle="Personal Best!" icon="🔥" color="#f59e0b" />
                        <StatisticsCard title="Completed Chapters" value="8" subtitle="Across 3 Subjects" icon="📚" color="#10b981" />
                    </div>
                </div>

                {/* Third Row: Continue Learning */}
                <div>
                    <h3 className={styles.sectionTitle}>Continue Learning</h3>
                    <div className={styles.courseGrid}>
                        <CourseCard title="Indian Polity" chapter="Chapter 5: Fundamental Rights" progress={58} />
                        <CourseCard title="Modern History" chapter="Chapter 8: Revolt of 1857" progress={32} />
                        <CourseCard title="Indian Economy" chapter="Chapter 3: RBI & Monetary Policy" progress={80} />
                    </div>
                </div>

                {/* Fourth Row: AI Tutor Banner */}
                <AITutorCard />

            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
