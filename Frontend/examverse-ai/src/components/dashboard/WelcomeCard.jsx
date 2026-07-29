import React from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from './DashboardComponents.module.css';

const WelcomeCard = () => {
    const { user } = useAuth();
    
    // Determine greeting based on time (optional polish)
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    return (
        <div className={`${styles.card} ${styles.welcomeCard}`}>
            <div className={styles.welcomeHeader}>
                <div>
                    <h2>{greeting}, {user?.full_name || 'Maheshwari'} 👋</h2>
                    <p>Ready to study today?</p>
                </div>
            </div>
            
            <div className={styles.statsRow}>
                <div className={styles.statBox}>
                    <span className={styles.statIcon}>🎯</span>
                    <div>
                        <p className={styles.statLabel}>Today's Goal</p>
                        <h3 className={styles.statValue}>3 Hours</h3>
                    </div>
                </div>
                <div className={styles.statBox}>
                    <span className={styles.statIcon}>🔥</span>
                    <div>
                        <p className={styles.statLabel}>Study Streak</p>
                        <h3 className={styles.statValue}>14 Days</h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeCard;
