import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../services/api';
import styles from './MockTests.module.css';
import UpgradeModal from '../components/UpgradeModal';

const MockTests = () => {
    const [topic, setTopic] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [quiz, setQuiz] = useState(null);
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [error, setError] = useState('');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGenerating(true);
        setError('');
        setQuiz(null);
        setShowResults(false);
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/ai/quiz', { topic }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setQuiz(response.data.quiz);
        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 402) {
                setShowUpgradeModal(true);
            } else {
                setError('Failed to generate quiz. Please try again.');
            }
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (showResults) return;
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIdx]: option
        });
    };

    const handleNext = () => {
        if (currentQuestionIdx < quiz.length - 1) {
            setCurrentQuestionIdx(currentQuestionIdx + 1);
        } else {
            setShowResults(true);
        }
    };

    const calculateScore = () => {
        let score = 0;
        quiz.forEach((q, idx) => {
            if (selectedAnswers[idx] === q.correct_answer) {
                score++;
            }
        });
        return score;
    };

    return (
        <DashboardLayout>
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                title="Mock Test Limit Reached"
            />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>AI Mock Tests</h2>
                    <p>Generate instant, customized quizzes on any topic.</p>
                </div>

                {!quiz && !isGenerating && (
                    <div className={styles.generatorCard}>
                        <h3>What do you want to practice?</h3>
                        <form onSubmit={handleGenerate} className={styles.generateForm}>
                            <input 
                                type="text" 
                                placeholder="e.g. Indian Constitution, Geography, Python Basics..." 
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                className={styles.input}
                            />
                            <button type="submit" className={styles.generateBtn} disabled={!topic.trim()}>
                                Generate Quiz ✨
                            </button>
                        </form>
                        {error && <p className={styles.error}>{error}</p>}
                    </div>
                )}

                {isGenerating && (
                    <div className={styles.loadingState}>
                        <div className={styles.spinner}></div>
                        <p>Our AI is crafting your custom quiz...</p>
                    </div>
                )}

                {quiz && !showResults && (
                    <div className={styles.quizCard}>
                        <div className={styles.quizHeader}>
                            <span>Question {currentQuestionIdx + 1} of {quiz.length}</span>
                        </div>
                        <h3 className={styles.questionText}>{quiz[currentQuestionIdx].question}</h3>
                        
                        <div className={styles.optionsList}>
                            {quiz[currentQuestionIdx].options.map((option, idx) => (
                                <button 
                                    key={idx}
                                    className={`${styles.optionBtn} ${selectedAnswers[currentQuestionIdx] === option ? styles.selected : ''}`}
                                    onClick={() => handleOptionSelect(option)}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>

                        <button 
                            className={styles.nextBtn} 
                            onClick={handleNext}
                            disabled={!selectedAnswers[currentQuestionIdx]}
                        >
                            {currentQuestionIdx === quiz.length - 1 ? 'See Results' : 'Next Question'}
                        </button>
                    </div>
                )}

                {quiz && showResults && (
                    <div className={styles.resultsCard}>
                        <div className={styles.scoreCircle}>
                            <h2>{calculateScore()} / {quiz.length}</h2>
                            <p>Correct</p>
                        </div>
                        
                        <div className={styles.reviewSection}>
                            <h3>Review Your Answers</h3>
                            {quiz.map((q, idx) => (
                                <div key={idx} className={styles.reviewItem}>
                                    <p className={styles.reviewQuestion}>Q: {q.question}</p>
                                    <p className={`${styles.reviewAnswer} ${selectedAnswers[idx] === q.correct_answer ? styles.correct : styles.incorrect}`}>
                                        Your Answer: {selectedAnswers[idx] || 'Skipped'}
                                    </p>
                                    {selectedAnswers[idx] !== q.correct_answer && (
                                        <p className={styles.correctAnswer}>Correct Answer: {q.correct_answer}</p>
                                    )}
                                    <p className={styles.explanation}><strong>Explanation:</strong> {q.explanation}</p>
                                </div>
                            ))}
                        </div>

                        <button className={styles.generateBtn} onClick={() => setQuiz(null)}>
                            Generate Another Quiz
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MockTests;
