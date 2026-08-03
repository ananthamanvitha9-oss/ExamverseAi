import React, { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import WhatsAppWidget from '../common/WhatsAppWidget';
import styles from './DashboardLayout.module.css';
import { requestForToken, onMessageListener } from '../../services/firebase';
import api from '../../services/api';

const DashboardLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className={styles.mainContent}>
                <Topbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className={styles.contentArea}>
                    {children}
                </main>
            </div>
            <WhatsAppWidget />
        </div>
    );
};

export default DashboardLayout;
