import React from 'react';
import styles from './DashboardComponents.module.css';

const ProgressCard = () => {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3>UPSC Progress</h3>
                <span className={styles.percentage}>58%</span>
            </div>
            <p className={styles.subtitle}>Overall Syllabus Completion</p>
            
            <div className={styles.progressContainer}>
                <div className={styles.progressBar} style={{ width: '58%' }}></div>
            </div>
            
            <div className={styles.progressFooter}>
                <span>42 Modules Left</span>
                <span>Target: Oct 2026</span>
            </div>
        </div>
    );
};

export default ProgressCard;
