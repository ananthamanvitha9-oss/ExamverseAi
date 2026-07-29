import React from 'react';
import styles from './DashboardComponents.module.css';

const StatisticsCard = ({ title, value, subtitle, icon, color }) => {
    return (
        <div className={`${styles.card} ${styles.statsCard}`}>
            <div className={styles.statsIcon} style={{ backgroundColor: color }}>
                {icon}
            </div>
            <div className={styles.statsInfo}>
                <p className={styles.statsTitle}>{title}</p>
                <h3 className={styles.statsValue}>{value}</h3>
                <p className={styles.statsSubtitle}>{subtitle}</p>
            </div>
        </div>
    );
};

export default StatisticsCard;
