import React from 'react';
import styles from './Features.module.css';

const Features = () => {
    const featureData = [
        { title: "AI Tutor", description: "Get instant, personalized doubt resolution and explanations from our conversational AI.", icon: "🤖" },
        { title: "Daily Study Planner", description: "Adaptive schedules generated automatically to target your weakest subjects.", icon: "📅" },
        { title: "Mock Tests", description: "Experience exam-like UI with negative marking and real-time analytics.", icon: "📝" },
        { title: "Previous Year Papers", description: "Practice with a massive repository of authenticated previous year questions.", icon: "📄" },
        { title: "Current Affairs", description: "Stay updated with daily curated news feeds essential for competitive exams.", icon: "📰" },
        { title: "Progress Tracking", description: "Monitor your study streaks, subject completion, and target hours.", icon: "📈" }
    ];

    return (
        <section className={styles.featuresSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Why Choose Examverse AI?</h2>
                    <p className={styles.subtitle}>Our platform gives you the unfair advantage you need to succeed.</p>
                </div>
                
                <div className={styles.grid}>
                    {featureData.map((feature, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>{feature.icon}</div>
                            <h3 className={styles.cardTitle}>{feature.title}</h3>
                            <p className={styles.cardDescription}>{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
