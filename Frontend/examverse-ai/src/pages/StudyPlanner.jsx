import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../services/api';
import styles from './StudyPlanner.module.css';
import { Calendar, Clock, BookOpen, Target, Sparkles, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const StudyPlanner = () => {
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    
    // Form state
    const [examDate, setExamDate] = useState('');
    const [weakSubjects, setWeakSubjects] = useState('');

    useEffect(() => {
        fetchPlan();
    }, []);

    const fetchPlan = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await api.get('/study-plan', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setPlan(response.data);
        } catch (error) {
            console.error("Failed to fetch plan", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async (e) => {
        e.preventDefault();
        setGenerating(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/study-plan/generate', 
                { exam_date: examDate, weak_subjects: weakSubjects },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlan({
                exam_date: examDate,
                weak_subjects: weakSubjects,
                plan_data: response.data.plan
            });
        } catch (error) {
            alert("Failed to generate plan. Ensure your API keys are correct.");
        } finally {
            setGenerating(false);
        }
    };

    if (loading) return <DashboardLayout><div className={styles.loading}>Loading Planner...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <Helmet>
                <title>AI Study Planner | Examverse AI</title>
            </Helmet>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1><Sparkles size={32} className={styles.sparkleIcon} /> AI Study Planner</h1>
                    <p>Let AI craft the perfect day-by-day timetable to conquer your weak subjects.</p>
                </div>

                {!plan && !generating && (
                    <div className={styles.generatorCard}>
                        <h2>Create New Plan</h2>
                        <form onSubmit={handleGenerate}>
                            <div className={styles.formGroup}>
                                <label>Target Exam Date</label>
                                <input 
                                    type="date" 
                                    value={examDate} 
                                    onChange={(e) => setExamDate(e.target.value)}
                                    required 
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>What are your weakest subjects or topics?</label>
                                <textarea 
                                    placeholder="E.g., Modern History, Quantitative Aptitude, Algebra..."
                                    value={weakSubjects}
                                    onChange={(e) => setWeakSubjects(e.target.value)}
                                    required
                                    rows="3"
                                />
                            </div>
                            <button type="submit" className={styles.generateBtn}>
                                Generate My 7-Day Plan
                            </button>
                        </form>
                    </div>
                )}

                {generating && (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <h2>Gemini is analyzing your goals...</h2>
                        <p>Drafting a personalized study schedule.</p>
                    </div>
                )}

                {plan && !generating && (
                    <div className={styles.planContainer}>
                        <div className={styles.planHeader}>
                            <div className={styles.metaData}>
                                <div className={styles.metaItem}>
                                    <Target size={20} /> Target Date: {new Date(plan.exam_date).toLocaleDateString()}
                                </div>
                                <div className={styles.metaItem}>
                                    <BookOpen size={20} /> Focus: {plan.weak_subjects}
                                </div>
                            </div>
                            <button onClick={() => setPlan(null)} className={styles.resetBtn}>
                                Create New Plan
                            </button>
                        </div>

                        <div className={styles.timeline}>
                            {plan.plan_data.map((day, index) => (
                                <div key={index} className={styles.dayCard}>
                                    <div className={styles.daySidebar}>
                                        <div className={styles.dayName}>{day.day}</div>
                                        <div className={styles.date}>{day.date}</div>
                                    </div>
                                    <div className={styles.dayContent}>
                                        <h3 className={styles.focusSubject}>{day.focus_subject}</h3>
                                        <p className={styles.topics}>{day.topics_to_cover}</p>
                                        <div className={styles.timeTracker}>
                                            <Clock size={16} /> <span>{day.estimated_hours} Hours Estimated</span>
                                        </div>
                                    </div>
                                    <div className={styles.actionCol}>
                                        <button className={styles.completeBtn}>
                                            <CheckCircle2 size={24} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default StudyPlanner;
