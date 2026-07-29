import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    // State to toggle the mobile menu dropdown
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Toggle function for accessibility and user interaction
    const toggleMenu = () => {
        setIsMobileMenuOpen((prevState) => !prevState);
    };

    // Close menu when a link is clicked on mobile
    const closeMenu = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <header className={styles.header}>
            <nav className={styles.navContainer} aria-label="Main Navigation">
                {/* Logo Section */}
                <div className={styles.logo}>
                    <Link to="/" onClick={closeMenu} aria-label="Examverse AI Home">
                        Examverse<span>AI</span>
                    </Link>
                </div>

                {/* Desktop and Mobile Navigation Links */}
                <ul 
                    className={`${styles.navLinks} ${isMobileMenuOpen ? styles.active : ''}`}
                    id="primary-navigation"
                >
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/exams" onClick={closeMenu}>Exams</Link></li>
                    <li><Link to="/courses" onClick={closeMenu}>Courses</Link></li>
                    <li><Link to="/current-affairs" onClick={closeMenu}>Current Affairs</Link></li>
                    <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
                    
                    {/* Mobile Only: Authentication Links */}
                    <li className={styles.mobileAuth}>
                        <Link to="/login" onClick={closeMenu}>Login</Link>
                    </li>
                    <li className={styles.mobileAuth}>
                        <Link to="/register" onClick={closeMenu} className={styles.mobileRegister}>Register</Link>
                    </li>
                </ul>

                {/* Desktop Authentication Buttons */}
                <div className={styles.authButtons}>
                    <Link to="/login" className={styles.loginBtn}>Login</Link>
                    <Link to="/register" className={styles.registerBtn}>Register</Link>
                </div>

                {/* Hamburger Menu for Mobile */}
                <button 
                    className={styles.hamburger} 
                    onClick={toggleMenu}
                    aria-expanded={isMobileMenuOpen}
                    aria-controls="primary-navigation"
                    aria-label="Toggle navigation menu"
                >
                    <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barOne : ''}`}></span>
                    <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barTwo : ''}`}></span>
                    <span className={`${styles.bar} ${isMobileMenuOpen ? styles.barThree : ''}`}></span>
                </button>
            </nav>
        </header>
    );
};

export default Navbar;
