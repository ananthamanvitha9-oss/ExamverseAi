import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import styles from './DashboardLayout.module.css';
import { useAuth } from '../../context/AuthContext';

const DashboardLayout = ({ children }) => {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <div className={styles.mainContent}>
                <Topbar />
                <main className={styles.pageContent}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
