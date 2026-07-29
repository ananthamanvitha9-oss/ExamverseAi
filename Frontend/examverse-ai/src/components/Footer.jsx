import React from 'react';
import styles from './Footer.module.css';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brandSection}>
                    <h3 className={styles.logo}>Examverse<span>AI</span></h3>
                    <p className={styles.tagline}>Empowering students to crack their dream exams with AI-driven personalized learning.</p>
                </div>
                <div className={styles.linksSection}>
                    <h4>Quick Links</h4>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/exams">Exams</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/contact">Contact Us</Link></li>
                    </ul>
                </div>
                <div className={styles.legalSection}>
                    <h4>Legal</h4>
                    <ul>
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms of Service</Link></li>
                    </ul>
                </div>
            </div>
            <div className={styles.bottomBar}>
                <p>&copy; {new Date().getFullYear()} Examverse AI. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
