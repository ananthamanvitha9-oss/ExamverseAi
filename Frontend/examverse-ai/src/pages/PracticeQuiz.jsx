import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './PracticeQuiz.module.css';
import api from '../services/api';
import { CheckCircle, XCircle, AlertCircle, ArrowRight, BrainCircuit } from 'lucide-react';

const PracticeQuiz = () => {
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                // Fetching questions for topic 1 as an example
                const response = await api.get('/topics/1/practice-questions');
                setQuestions(response.data);
            } catch (error) {
                console.error("Failed to fetch questions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuestions();
    }, []);

    const handleOptionSelect = (option) => {
        if (!isSubmitted) setSelectedOption(option);
    };

    const handleSubmit = () => {
        if (!selectedOption) return;
        setIsSubmitted(true);
        if (selectedOption.is_correct) {
            setScore(score + 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setSelectedOption(null);
            setIsSubmitted(false);
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <BrainCircuit className={styles.spinner} size={40} />
                    <p>Loading your AI-generated quiz...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (questions.length === 0) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <AlertCircle size={40} style={{color: '#ef4444', marginBottom: '1rem'}} />
                    <p>No questions available for this topic yet. Check back later!</p>
                </div>
            </DashboardLayout>
        );
    }

    const currentQuestion = questions[currentIndex];

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>📝 Practice Quiz</h1>
                    <div className={styles.statsRow}>
                        <span className={styles.progress}>Question {currentIndex + 1} of {questions.length}</span>
                        <span className={styles.scoreBadge}>Score: {score}</span>
                    </div>
                </div>

                <div className={styles.questionCard}>
                    <h2 className={styles.questionText}>
                        {currentQuestion.question_text.split('\\n').map((line, i) => (
                            <React.Fragment key={i}>{line}<br/></React.Fragment>
                        ))}
                    </h2>

                    <div className={styles.optionsList}>
                        {currentQuestion.options.map((opt) => {
                            let className = styles.option;
                            if (selectedOption?.id === opt.id) className += ` ${styles.selected}`;
                            if (isSubmitted) {
                                if (opt.is_correct) className += ` ${styles.correct}`;
                                else if (selectedOption?.id === opt.id) className += ` ${styles.incorrect}`;
                            }

                            return (
                                <div 
                                    key={opt.id} 
                                    className={className}
                                    onClick={() => handleOptionSelect(opt)}
                                >
                                    <div className={styles.optionCircle}></div>
                                    <span className={styles.optionText}>{opt.option_text}</span>
                                    {isSubmitted && opt.is_correct && <CheckCircle className={styles.resultIcon} size={20} color="#10b981" />}
                                    {isSubmitted && selectedOption?.id === opt.id && !opt.is_correct && <XCircle className={styles.resultIcon} size={20} color="#ef4444" />}
                                </div>
                            );
                        })}
                    </div>

                    {!isSubmitted ? (
                        <button 
                            className={styles.submitBtn} 
                            onClick={handleSubmit}
                            disabled={!selectedOption}
                        >
                            Submit Answer
                        </button>
                    ) : (
                        <div className={styles.explanationBox}>
                            <h3>📖 Explanation</h3>
                            <p>{currentQuestion.answer?.explanation || "No explanation provided for this question."}</p>
                            
                            {currentIndex < questions.length - 1 ? (
                                <button className={styles.nextBtn} onClick={handleNext}>
                                    Next Question <ArrowRight size={18} />
                                </button>
                            ) : (
                                <div className={styles.quizComplete}>
                                    🎉 Quiz Complete! You scored {score} out of {questions.length}.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default PracticeQuiz;
