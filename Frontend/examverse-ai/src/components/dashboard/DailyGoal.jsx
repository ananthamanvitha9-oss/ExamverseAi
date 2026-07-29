import React from 'react';
import styles from './DashboardComponents.module.css';

const DailyGoal = () => {
    const goals = [
        { title: "Read NCERT", subtitle: "Complete 2 Chapters", done: true },
        { title: "Solve 20 MCQs", subtitle: "Practice Section", done: false },
        { title: "Current Affairs", subtitle: "30 Minutes", done: false }
    ];

    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <h3>Today's Goal</h3>
                <span className={styles.goalDate}>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
            </div>
            
            <ul className={styles.goalList}>
                {goals.map((goal, index) => (
                    <li key={index} className={styles.goalItem}>
                        <div className={`${styles.checkbox} ${goal.done ? styles.checked : ''}`}>
                            {goal.done && '✓'}
                        </div>
                        <div className={styles.goalInfo}>
                            <h4 className={goal.done ? styles.textStrike : ''}>{goal.title}</h4>
                            <p>{goal.subtitle}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DailyGoal;
