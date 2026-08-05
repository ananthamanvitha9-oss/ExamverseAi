import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './DailyQuiz.module.css';
import api from '../services/api';
import { Target, CheckCircle2, XCircle, Award, Sparkles, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';

const DailyQuiz = () => {
    const [quiz, setQuiz] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [isChecking, setIsChecking] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        generateQuiz();
    }, []);

    const generateQuiz = async () => {
        setLoading(true);
        setError(null);
        setQuiz([]);
        setCurrentQuestionIndex(0);
        setScore(0);
        setShowResults(false);
        setSelectedOption(null);

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/quiz/generate', {
                topic: "Today's most important Current Affairs and Geopolitics for UPSC"
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            if (response.data.quiz && response.data.quiz.length > 0) {
                setQuiz(response.data.quiz);
            } else {
                setError("AI failed to generate a valid quiz. Please try again.");
            }
        } catch (err) {
            console.error(err);
            setError("Failed to fetch quiz. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (isChecking || showResults) return;
        setSelectedOption(option);
        setIsChecking(true);

        const currentQ = quiz[currentQuestionIndex];
        const isCorrect = option === currentQ.correct_answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }
    };

    const handleNext = async () => {
        if (currentQuestionIndex < quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsChecking(false);
        } else {
            // Finish Quiz
            setShowResults(true);
            
            // If perfect score, award gamification points
            if (score + (selectedOption === quiz[currentQuestionIndex].correct_answer ? 1 : 0) === quiz.length) {
                try {
                    const token = localStorage.getItem('token');
                    await api.post('/gamification/log-study', {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    toast.success("Perfect Score! 🏆 +5 Gamification Points earned!");
                } catch (e) {
                    console.error("Points failed", e);
                }
            }
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <h2><Sparkles size={24} className={styles.sparkleIcon}/> Curating Today's AI Quiz...</h2>
                    <p>Gemini is scanning the latest current affairs.</p>
                </div>
            </DashboardLayout>
        );
    }

    if (error) {
        return (
            <DashboardLayout>
                <div className={styles.errorContainer}>
                    <p className={styles.errorText}>{error}</p>
                    <button className={styles.retryBtn} onClick={generateQuiz}>
                        <RefreshCw size={18} /> Try Again
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    if (showResults) {
        const percentage = (score / quiz.length) * 100;
        return (
            <DashboardLayout>
                <div className={styles.container}>
                    <div className={styles.resultsCard}>
                        <Award size={64} className={percentage === 100 ? styles.goldAward : styles.silverAward} />
                        <h2>Quiz Complete!</h2>
                        <div className={styles.scoreText}>
                            You scored <span>{score}</span> out of {quiz.length}
                        </div>
                        {percentage === 100 && <p className={styles.bonusText}>🎉 Brilliant! You earned bonus points for a perfect score!</p>}
                        {percentage < 100 && <p className={styles.reviewText}>Keep practicing! Review the explanations to master these topics.</p>}
                        
                        <button className={styles.retryBtn} onClick={generateQuiz}>
                            <RefreshCw size={18} /> Generate New Quiz
                        </button>
                    </div>
                </div>
            </DashboardLayout>
        );
    }

    const currentQ = quiz[currentQuestionIndex];

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>🎯 Daily Current Affairs Quiz</h1>
                    <p>Test your knowledge on the latest geopolitics and national news.</p>
                </div>

                <div className={styles.quizCard}>
                    <div className={styles.progressHeader}>
                        <span className={styles.questionCounter}>
                            Question {currentQuestionIndex + 1} of {quiz.length}
                        </span>
                        <div className={styles.scoreDisplay}>
                            Score: {score}
                        </div>
                    </div>

                    <div className={styles.progressBar}>
                        <div 
                            className={styles.progressFill} 
                            style={{ width: `${((currentQuestionIndex) / quiz.length) * 100}%` }}
                        ></div>
                    </div>

                    <h2 className={styles.questionText}>{currentQ?.question}</h2>

                    <div className={styles.optionsList}>
                        {currentQ?.options.map((option, index) => {
                            let optionClass = styles.optionBtn;
                            let Icon = null;
                            
                            if (isChecking) {
                                if (option === currentQ.correct_answer) {
                                    optionClass = `${styles.optionBtn} ${styles.correctOption}`;
                                    Icon = CheckCircle2;
                                } else if (option === selectedOption) {
                                    optionClass = `${styles.optionBtn} ${styles.wrongOption}`;
                                    Icon = XCircle;
                                }
                            }

                            return (
                                <button 
                                    key={index} 
                                    className={optionClass}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={isChecking}
                                >
                                    <span>{option}</span>
                                    {Icon && <Icon size={20} className={styles.optionIcon} />}
                                </button>
                            );
                        })}
                    </div>

                    {isChecking && (
                        <div className={styles.explanationBox}>
                            <h4>Explanation:</h4>
                            <p>{currentQ.explanation}</p>
                            <button className={styles.nextBtn} onClick={handleNext}>
                                {currentQuestionIndex < quiz.length - 1 ? 'Next Question' : 'View Results'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default DailyQuiz;
