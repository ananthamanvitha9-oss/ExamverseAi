import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';

const OAuthCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginWithToken } = useAuth(); // We need to add this to AuthContext!

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const token = queryParams.get('token');

        if (token) {
            loginWithToken(token).then(() => {
                navigate('/dashboard');
            }).catch(() => {
                navigate('/login');
            });
        } else {
            navigate('/login');
        }
    }, [location, navigate, loginWithToken]);

    return (
        <div className={styles.authContainer}>
            <div className={styles.authCard}>
                <h2>Authenticating...</h2>
                <p>Please wait while we log you in securely.</p>
                <div className={styles.loader}></div>
            </div>
        </div>
    );
};

export default OAuthCallback;
