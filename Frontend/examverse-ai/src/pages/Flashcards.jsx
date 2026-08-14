import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RefreshCcw } from 'lucide-react';
import api from '../services/api';
import styles from './Flashcards.module.css';

const Flashcards = () => {
    const [topic, setTopic] = useState('');
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const generateFlashcards = async () => {
        if (!topic.trim()) return;
        
        setLoading(true);
        setError(null);
        setFlashcards([]);
        setCurrentIndex(0);
        setIsFlipped(false);

        try {
            const response = await api.post('/flashcards/generate', { topic });
            setFlashcards(response.data);
        } catch (err) {
            console.error("Failed to generate flashcards:", err);
            setError("Failed to generate flashcards. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const nextCard = () => {
        if (currentIndex < flashcards.length - 1) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev + 1), 150);
        }
    };

    const prevCard = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setTimeout(() => setCurrentIndex(prev => prev - 1), 150);
        }
    };

    return (
        <div className={styles.flashcardsContainer}>
            <div className={styles.header}>
                <h1>AI Flashcards Generator</h1>
                <p>Paste your notes or enter a topic, and Gemini will create study cards for you.</p>
            </div>

            <div className={styles.inputSection}>
                <textarea 
                    className={styles.textarea}
                    placeholder="Enter a topic (e.g. 'Photosynthesis') or paste your notes here..."
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    disabled={loading}
                />
                <button 
                    className={styles.generateBtn} 
                    onClick={generateFlashcards}
                    disabled={loading || !topic.trim()}
                >
                    {loading ? (
                        <><span className={styles.loader}></span> Generating Cards...</>
                    ) : (
                        <><RefreshCcw size={18} style={{marginRight: '8px', verticalAlign: 'middle'}}/> Generate Flashcards</>
                    )}
                </button>
                {error && <p style={{ color: 'var(--danger-color)', marginTop: '1rem', textAlign: 'center' }}>{error}</p>}
            </div>

            {flashcards.length > 0 && (
                <div className={styles.flashcardViewer}>
                    <div className={styles.scene}>
                        <div 
                            className={`${styles.card} ${isFlipped ? styles.isFlipped : ''}`}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            <div className={`${styles.cardFace} ${styles.cardFront}`}>
                                <div className={styles.cardContent}>
                                    {flashcards[currentIndex].front}
                                </div>
                                <div className={styles.cardHint}>Click to reveal answer</div>
                            </div>
                            <div className={`${styles.cardFace} ${styles.cardBack}`}>
                                <div className={styles.cardContent}>
                                    {flashcards[currentIndex].back}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.controls}>
                        <button 
                            className={styles.navBtn} 
                            onClick={prevCard}
                            disabled={currentIndex === 0}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <span className={styles.counter}>
                            {currentIndex + 1} / {flashcards.length}
                        </span>
                        <button 
                            className={styles.navBtn} 
                            onClick={nextCard}
                            disabled={currentIndex === flashcards.length - 1}
                        >
                            <ChevronRight size={24} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Flashcards;
