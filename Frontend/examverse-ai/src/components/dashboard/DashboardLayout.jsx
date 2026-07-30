import React, { useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './DashboardLayout.module.css';
import { requestForToken, onMessageListener } from '../../services/firebase';
import api from '../../services/api';

const DashboardLayout = ({ children }) => {
    
    useEffect(() => {
        const setupNotifications = async () => {
            const token = await requestForToken();
            if (token) {
                try {
                    const authToken = localStorage.getItem('token');
                    await api.post('/user/fcm-token', { fcm_token: token }, {
                        headers: { Authorization: `Bearer ${authToken}` }
                    });
                } catch (e) {
                    console.error("Failed to save FCM token", e);
                }
            }
        };

        setupNotifications();

        onMessageListener().then(payload => {
            console.log('Received foreground message: ', payload);
            // Can add toast notification here in the future
        }).catch(err => console.log('failed: ', err));
    }, []);

    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Header />
                <main className={styles.contentArea}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
