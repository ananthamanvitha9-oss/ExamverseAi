import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../pages/Dashboard.module.css';

const CourseCard = ({ id, title, chapter, progress, status = "Continue" }) => {
    return (
        <div className={`${styles.card} ${styles.courseCard}`}>
            <div className={styles.courseIcon}>📚</div>
            <div className={styles.courseInfo}>
                <h4>{title}</h4>
                <p>{chapter}</p>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className={styles.courseAction}>
                <span className={styles.status}>{progress}%</span>
                <Link to={`/dashboard/courses/${id}`} className={styles.btnSecondary}>{status}</Link>
            </div>
        </div>
    );
};

export default CourseCard;
