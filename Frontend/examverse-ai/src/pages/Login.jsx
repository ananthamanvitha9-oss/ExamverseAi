import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Auth.module.css';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Welcome Back</h2>
                <p>Enter your details to log in to your account</p>
                
                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    
                    <div className={styles.forgotPassword}>
                        <Link to="/forgot-password">Forgot Password?</Link>
                    </div>

                    <Button type="submit" variant="primary" className={styles.submitBtn}>Log In</Button>
                </form>



                <p className={styles.authFooter}>
                    Don't have an account? <Link to="/register">Register here</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
