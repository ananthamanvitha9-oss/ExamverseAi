import React from 'react';
import styles from './ExamCard.module.css';
import Button from './Button';

const ExamCard = ({ title, category }) => {
    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                <span className={styles.badge}>{category}</span>
            </div>
            <p className={styles.description}>
                Comprehensive mock tests, study materials, and AI guidance for {title} aspirants.
            </p>
            <div className={styles.footer}>
                <Button variant="outline" size="small" className={styles.exploreBtn}>Explore Exam</Button>
            </div>
        </div>
    );
};

export default ExamCard;
