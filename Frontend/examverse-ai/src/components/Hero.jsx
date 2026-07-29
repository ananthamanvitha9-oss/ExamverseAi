import React from 'react';
import styles from './Hero.module.css';
import Button from './Button';

const Hero = () => {
    return (
        <section className={styles.heroSection}>
            <div className={styles.container}>
                <div className={styles.textContent}>
                    <h1 className={styles.title}>Crack Your <span className={styles.highlight}>Dream Exam</span> with AI</h1>
                    <p className={styles.subtitle}>
                        Personalized study plans, dynamic mock tests, and AI-assisted tutoring tailored for UPSC, SSC, and JEE.
                    </p>
                    <div className={styles.ctaGroup}>
                        <Button variant="primary" size="large">Get Started for Free</Button>
                        <Button variant="outline" size="large">Explore Exams</Button>
                    </div>
                </div>
                <div className={styles.imageContent}>
                    {/* Placeholder for the illustration we discussed in the Figma design */}
                    <div className={styles.illustrationPlaceholder}>
                        <p>AI Tutoring Illustration</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
