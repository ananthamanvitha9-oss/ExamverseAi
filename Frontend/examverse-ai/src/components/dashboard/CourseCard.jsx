import React from 'react';
import styles from './DashboardComponents.module.css';

const CourseCard = ({ title, chapter, progress, status = "Continue" }) => {
    return (
        <div className={`${styles.card} ${styles.courseCard}`}>
            <div className={styles.courseIcon}>📚</div>
            <div className={styles.courseInfo}>
                <h4>{title}</h4>
                <p>{chapter}</p>
                {progress !== undefined && (
                    <div className={styles.miniProgressContainer}>
                        <div className={styles.miniProgressBar} style={{ width: `${progress}%` }}></div>
                    </div>
                )}
            </div>
            <div className={styles.courseAction}>
                <button className={status === "Start" ? styles.startBtn : styles.continueBtn}>
                    {status}
                </button>
            </div>
        </div>
    );
};

export default CourseCard;
