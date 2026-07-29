import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './DashboardComponents.module.css';

const AITutorCard = () => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.card} ${styles.aiTutorCard}`}>
            <div className={styles.aiTutorContent}>
                <div className={styles.aiIcon}>🤖</div>
                <div>
                    <h3 className={styles.aiTitle}>Your Personal AI Tutor</h3>
                    <p className={styles.aiSubtitle}>Stuck on a topic? Ask a question, generate a quiz, or get a concept explained instantly.</p>
                </div>
            </div>
            <button onClick={() => navigate('/dashboard/ai-tutor')} className={styles.aiActionBtn}>
                Chat with AI ➔
            </button>
        </div>
    );
};

export default AITutorCard;
