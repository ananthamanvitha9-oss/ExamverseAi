import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './MockTests.module.css';
import { mockTestsData } from '../data/mocktests';

const MockTests = () => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setTests(mockTestsData);
            setLoading(false);
        const fetchTests = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/mock-tests');
                setTests(response.data);
            } catch (error) {
                console.error("Error fetching tests:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    return (
        <DashboardLayout>
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
