import React from 'react';
import styles from './ExamSection.module.css';
import ExamCard from './ExamCard';

const ExamSection = () => {
    // Real content injected directly into the data array
    const exams = [
        { title: "UPSC CSE", category: "Civil Services" },
        { title: "SSC CGL / CHSL", category: "Govt Jobs" },
        { title: "Banking (IBPS/SBI)", category: "Banking" },
        { title: "Railways (RRB)", category: "Railways" },
        { title: "JEE Main & Adv", category: "Engineering" },
        { title: "NEET UG", category: "Medical" }
    ];

    return (
        <section className={styles.examSection}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Select Your Target Exam</h2>
                    <p className={styles.subtitle}>Choose your path and let AI guide your preparation.</p>
                </div>
                <div className={styles.grid}>
                    {exams.map((exam, index) => (
                        <ExamCard key={index} title={exam.title} category={exam.category} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ExamSection;
