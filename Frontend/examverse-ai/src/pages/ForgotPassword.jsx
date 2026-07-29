import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Auth.module.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('If an account exists, a reset link will be sent to your email.');
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Reset Password</h2>
                <p>Enter your email to receive a reset link.</p>
                
                {message && <div className={styles.successAlert}>{message}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <Button type="submit" variant="primary" className={styles.submitBtn}>Send Reset Link</Button>
                </form>

                <p className={styles.authFooter}>
                    Remembered your password? <Link to="/login">Back to Login</Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
