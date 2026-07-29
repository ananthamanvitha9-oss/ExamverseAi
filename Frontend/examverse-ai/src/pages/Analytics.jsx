import React, { useState } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Analytics.module.css';

const Analytics = () => {
    const [weakSubjects, setWeakSubjects] = useState('');
    const [examDate, setExamDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [studyPlan, setStudyPlan] = useState(null);
    const [error, setError] = useState(null);

    const handleGeneratePlan = async (e) => {
        e.preventDefault();
        if (!weakSubjects || !examDate) return;

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/study-plan/generate', {
                weak_subjects: weakSubjects,
                exam_date: examDate
            });
            setStudyPlan(response.data.plan);
        } catch (err) {
            console.error("Failed to generate plan:", err);
            setError("Failed to generate your study plan. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.analyticsContainer}>
                <div className={styles.header}>
                    <h1>AI Study Planner</h1>
                    <p>Tell us your weak areas, and Examverse AI will generate a customized 7-day schedule for you.</p>
                </div>

                <div className={styles.card}>
                    <h2 className={styles.cardTitle}>Configure Your Plan</h2>
                    <form onSubmit={handleGeneratePlan}>
                        <div className={styles.formGroup}>
                            <label>What are your weak subjects? (e.g., Indian Polity, Geography)</label>
                            <input 
                                type="text" 
                                className={styles.formInput} 
                                value={weakSubjects} 
                                onChange={(e) => setWeakSubjects(e.target.value)} 
                                placeholder="Enter subjects separated by commas..."
                                required 
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>When is your upcoming exam?</label>
                            <input 
                                type="date" 
                                className={styles.formInput} 
                                value={examDate} 
                                onChange={(e) => setExamDate(e.target.value)} 
                                required 
                            />
                        </div>
                        <button type="submit" className={styles.generateBtn} disabled={loading}>
                            {loading ? '🧠 AI is building your plan...' : 'Generate 7-Day Study Plan'}
                        </button>
                    </form>
                    {error && <p style={{ color: 'red', marginTop: '15px' }}>{error}</p>}
                </div>

                {studyPlan && (
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Your Custom 7-Day Roadmap</h2>
                        <div className={styles.planGrid}>
                            {studyPlan.map((day, idx) => (
                                <div key={idx} className={styles.planDayCard}>
                                    <div className={styles.dayLabel}>{day.day}</div>
                                    <div className={styles.topicText}>{day.topic}</div>
                                    <div className={styles.durationBadge}>⏱ {day.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
