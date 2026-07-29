import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Dashboard.module.css';

const MockTestInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTest = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/mock-tests/${id}`);
                setTestData(response.data);
                setTimeLeft(response.data.duration_minutes * 60);
            } catch (error) {
                console.error("Error fetching mock test:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTest();
    }, [id]);

    useEffect(() => {
        if (isSubmitted || !testData) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [isSubmitted, testData]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    const handleSelectOption = (qId, optionIndex) => {
        setAnswers({ ...answers, [qId]: optionIndex });
    };

    const handleSubmit = () => {
        setIsSubmitted(true);
    };

    const currentQuestion = testData.questions[currentQuestionIndex];

    if (isSubmitted) {
        let score = 0;
        testData.questions.forEach(q => {
            if (answers[q.id] == q.correct_option) score++;
        });

        return (
            <DashboardLayout>
                <div style={{ background: 'white', padding: '40px', borderRadius: '12px', textAlign: 'center' }}>
                    <h2>Test Submitted!</h2>
                    <h1>Your Score: {score} / {testData.questions.length}</h1>
                    <button className={styles.btnPrimary} onClick={() => navigate('/dashboard/mock-tests')}>Back to Tests</button>
                    
                    <div style={{ marginTop: '40px', textAlign: 'left' }}>
                        <h3>Solutions:</h3>
                        {testData.questions.map((q, idx) => (
                            <div key={q.id} style={{ padding: '15px', border: '1px solid #eee', marginBottom: '10px', borderRadius: '8px' }}>
                                <strong>Q{idx+1}: {q.question_text}</strong>
                                <p style={{ color: answers[q.id] == q.correct_option ? 'green' : 'red' }}>
                                    Your Answer: {answers[q.id] !== undefined ? String.fromCharCode(65 + answers[q.id]) : 'Skipped'}
                                </p>
                                <p style={{ color: 'green' }}>Correct Answer: {String.fromCharCode(65 + parseInt(q.correct_option))}</p>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>Explanation: {q.explanation}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 100px)' }}>
                
                {/* Main Question Area */}
                <div style={{ flex: 3, background: 'white', padding: '30px', borderRadius: '12px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '20px', marginBottom: '20px' }}>
                        <h3>{testData.title}</h3>
                        <h3 style={{ color: timeLeft < 300 ? 'red' : 'inherit' }}>⏱ {formatTime(timeLeft)}</h3>
                    </div>

                    <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                            Q{currentQuestionIndex + 1}. {currentQuestion.question_text}
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {[currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d].map((opt, idx) => (
                                <button 
                                    key={idx}
                                    style={{
                                        padding: '15px', 
                                        textAlign: 'left', 
                                        border: answers[currentQuestion.id] === idx ? '2px solid #2563eb' : '1px solid #ccc',
                                        background: answers[currentQuestion.id] === idx ? '#eff6ff' : 'white',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontSize: '1rem'
                                    }}
                                    onClick={() => handleSelectOption(currentQuestion.id, idx)}
                                >
                                    {String.fromCharCode(65 + idx)}. {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <button 
                            className={styles.btnSecondary} 
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        >
                            Previous
                        </button>
                        
                        {currentQuestionIndex === testData.questions.length - 1 ? (
                            <button className={styles.btnPrimary} onClick={handleSubmit}>Submit Test</button>
                        ) : (
                            <button 
                                className={styles.btnPrimary}
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            >
                                Next
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Side Question Palette */}
                <div style={{ flex: 1, background: 'white', padding: '20px', borderRadius: '12px' }}>
                    <h4>Question Palette</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginTop: '20px' }}>
                        {testData.questions.map((q, idx) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isActive = currentQuestionIndex === idx;
                            return (
                                <button 
                                    key={q.id}
                                    style={{
                                        padding: '10px',
                                        borderRadius: '50%',
                                        border: 'none',
                                        background: isActive ? '#2563eb' : (isAnswered ? '#10b981' : '#e5e7eb'),
                                        color: (isActive || isAnswered) ? 'white' : 'black',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    <div style={{ marginTop: '30px', fontSize: '0.9rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                            <div style={{ width: '15px', height: '15px', background: '#10b981', borderRadius: '50%' }}></div> Answered
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '15px', height: '15px', background: '#e5e7eb', borderRadius: '50%' }}></div> Not Answered
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MockTestInterface;
