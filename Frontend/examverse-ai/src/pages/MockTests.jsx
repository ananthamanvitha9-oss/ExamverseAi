import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './MockTests.module.css';

const MockTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                // Fallback dummy data if API fails
                const dummyTests = [
                    { id: 1, title: 'UPSC Prelims Mock 1', questions: 100, duration: '2 Hours', status: 'New' },
                    { id: 2, title: 'SSC CGL Tier 1 Mock', questions: 100, duration: '1 Hour', status: 'Completed', score: '145/200' },
                ];
                
                try {
                    const response = await api.get('/mock-tests');
                    setTests(response.data.length ? response.data : dummyTests);
                } catch (e) {
                    setTests(dummyTests);
                }
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const getStatusStyle = (status) => {
        if (status === 'Completed') return styles.completed;
        if (status === 'Resume') return styles.resume;
        return styles.new;
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Mock Tests</h1>
                    <p>Practice with real exam simulation and AI analysis.</p>
                </div>
                
                {loading ? (
                    <p>Loading tests...</p>
                ) : (
                    <div className={styles.grid}>
                        {tests.map((test) => (
                            <div key={test.id} className={styles.testCard}>
                                <div className={styles.cardTop}>
                                    <span className={`${styles.statusBadge} ${getStatusStyle(test.status)}`}>
                                        {test.status}
                                    </span>
                                    {test.score && <span className={styles.scoreBadge}>Score: {test.score}</span>}
                                </div>
                                
                                <h3 className={styles.testTitle}>{test.title}</h3>
                                
                                <div className={styles.testDetails}>
                                    <span>📝 {test.questions} Questions</span>
                                    <span>⏱️ {test.duration}</span>
                                </div>
                                
                                <button className={styles.startBtn}>
                                    {test.status === 'Completed' ? 'View Analysis' : test.status === 'Resume' ? 'Resume Test' : 'Start Now ➔'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MockTests;
