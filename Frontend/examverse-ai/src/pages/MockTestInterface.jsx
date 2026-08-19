import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './MockTestInterface.module.css';

const MockTestInterface = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [testData, setTestData] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitResults, setSubmitResults] = useState(null);

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

    const handleSelectOption = (qId, optionString) => {
        setAnswers({ ...answers, [qId]: optionString });
    };

    const handleSubmit = async () => {
        setIsSubmitted(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(`http://127.0.0.1:8000/api/mock-tests/${id}/submit`, 
                { answers: answers },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubmitResults(response.data);
        } catch (error) {
            console.error("Submit error", error);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 0' }}>
                    <div className="spinner" style={{width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite'}}></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!testData) {
        return (
            <DashboardLayout>
                <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                    <h2>Mock Test not found.</h2>
                </div>
            </DashboardLayout>
        );
    }

    if (isSubmitted) {
        if (!submitResults) {
            return (
                <DashboardLayout>
                    <div className={styles.resultsContainer}>
                        <div className="spinner" style={{width: '40px', height: '40px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem'}}></div>
                        <h2>Grading your test...</h2>
                    </div>
                </DashboardLayout>
            );
        }

        return (
            <DashboardLayout>
                <div className={styles.resultsContainer}>
                    <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
                    <h2>Test Submitted!</h2>
                    <h1>{submitResults.score} / {submitResults.total}</h1>
                    <h3>🏆 Points Earned: +{submitResults.points_earned}</h3>
                    <button className="btn btn-primary" onClick={() => navigate('/dashboard/tests')}>Back to Tests</button>
                    
                    <div className={styles.solutionsList}>
                        <h3 style={{ color: 'var(--text-primary)', marginBottom: 0 }}>Solutions & Review:</h3>
                        {testData.questions.map((q, idx) => {
                            const result = submitResults.results.find(r => r.question_id === q.id);
                            const isCorrect = result?.is_correct;
                            return (
                                <div key={q.id} className={styles.solutionCard}>
                                    <strong>Q{idx+1}: {q.question_text}</strong>
                                    <p className={isCorrect ? styles.correctText : styles.incorrectText} style={{ marginBottom: '0.5rem', fontWeight: 500 }}>
                                        {isCorrect ? <CheckCircle2 size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/> : <AlertCircle size={16} style={{display:'inline', verticalAlign:'text-bottom', marginRight:'4px'}}/>}
                                        Your Answer: {result?.user_answer || 'Skipped'}
                                    </p>
                                    {!isCorrect && (
                                        <p className={styles.correctText} style={{ fontWeight: 500 }}>
                                            Correct Answer: {q.correct_option}
                                        </p>
                                    )}
                                    <div className={styles.explanation}>
                                        <strong>Explanation:</strong> {q.explanation}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const currentQuestion = testData.questions[currentQuestionIndex];

    return (
        <DashboardLayout>
            <div className={styles.container}>
                {/* Main Question Area */}
                <div className={styles.mainArea}>
                    <div className={styles.header}>
                        <h3>{testData.title}</h3>
                        <div className={`${styles.timer} ${timeLeft < 300 ? styles.timerWarning : ''}`}>
                            <Clock size={20} /> {formatTime(timeLeft)}
                        </div>
                    </div>

                    <div className={styles.questionContent}>
                        <h4 className={styles.questionText}>
                            <span style={{color: 'var(--primary)', marginRight: '0.5rem'}}>Q{currentQuestionIndex + 1}.</span> 
                            {currentQuestion.question_text}
                        </h4>

                        <div className={styles.optionsGrid}>
                            {[currentQuestion.option_a, currentQuestion.option_b, currentQuestion.option_c, currentQuestion.option_d].map((opt, idx) => {
                                const isSelected = answers[currentQuestion.id] === opt;
                                return (
                                    <button 
                                        key={idx}
                                        className={`${styles.optionBtn} ${isSelected ? styles.selected : ''}`}
                                        onClick={() => handleSelectOption(currentQuestion.id, opt)}
                                    >
                                        <span className={styles.optionLetter}>{String.fromCharCode(65 + idx)}.</span> 
                                        <span>{opt}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button 
                            className="btn btn-outline" 
                            disabled={currentQuestionIndex === 0}
                            onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                        >
                            <ChevronLeft size={18} /> Previous
                        </button>
                        
                        {currentQuestionIndex === testData.questions.length - 1 ? (
                            <button className="btn btn-primary" onClick={handleSubmit}>
                                Submit Test <CheckCircle2 size={18} style={{marginLeft: '0.5rem'}} />
                            </button>
                        ) : (
                            <button 
                                className="btn btn-primary"
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                            >
                                Next <ChevronRight size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Right Side Question Palette */}
                <div className={styles.paletteArea}>
                    <h4>Question Palette</h4>
                    <div className={styles.paletteGrid}>
                        {testData.questions.map((q, idx) => {
                            const isAnswered = answers[q.id] !== undefined;
                            const isActive = currentQuestionIndex === idx;
                            let btnClass = styles.paletteBtn;
                            if (isActive) btnClass += ` ${styles.active}`;
                            else if (isAnswered) btnClass += ` ${styles.answered}`;

                            return (
                                <button 
                                    key={q.id}
                                    className={btnClass}
                                    onClick={() => setCurrentQuestionIndex(idx)}
                                >
                                    {idx + 1}
                                </button>
                            );
                        })}
                    </div>
                    
                    <div className={styles.legend}>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: 'var(--success)' }}></div> Answered
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}></div> Not Answered
                        </div>
                        <div className={styles.legendItem}>
                            <div className={styles.legendDot} style={{ background: 'var(--primary)' }}></div> Current
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default MockTestInterface;
