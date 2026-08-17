import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import styles from './Auth.module.css';

import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [formData, setFormData] = useState({ full_name: '', email: '', password: '', confirm_password: '' });
    const [error, setError] = useState('');
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirm_password) {
            setError("Passwords do not match!");
            return;
        }
        try {
            await register({
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password
            });
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Email might be in use.');
        }
    };

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Create Account</h2>
                <p>Join Examverse AI today.</p>
                
                {error && <div className={styles.errorAlert}>{error}</div>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Full Name</label>
                        <input type="text" name="full_name" value={formData.full_name} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Email Address</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required minLength="8" />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Confirm Password</label>
                        <input type="password" name="confirm_password" value={formData.confirm_password} onChange={handleChange} required />
                    </div>

                    <Button type="submit" variant="primary" className={styles.submitBtn}>Sign Up</Button>
                </form>



                <p className={styles.authFooter}>
                    Already have an account? <Link to="/login">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
