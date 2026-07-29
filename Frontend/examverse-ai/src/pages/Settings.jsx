import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Profile.module.css'; // Reusing profile styles

const Settings = () => {
    const [darkMode, setDarkMode] = useState(false);
    
    return (
        <DashboardLayout>
            <div className={styles.header}>
                <h1>Account Settings</h1>
                <p>Manage your security and app preferences.</p>
            </div>
            
            <div className={styles.card}>
                <h2>Preferences</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                    <label style={{ fontWeight: '600' }}>Dark Mode</label>
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        style={{
                            padding: '8px 16px',
                            background: darkMode ? '#111827' : '#e5e7eb',
                            color: darkMode ? 'white' : 'black',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        {darkMode ? 'Enabled' : 'Disabled'}
                    </button>
                    <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        (Theme switching will be fully implemented in a future update)
                    </span>
                </div>
                
                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid #e5e7eb' }} />
                
                <h2>Security</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }} onSubmit={(e) => { e.preventDefault(); alert('Password change simulated.'); }}>
                    <div className={styles.formGroup}>
                        <label>Current Password</label>
                        <input type="password" required className={styles.input} />
                    </div>
                    <div className={styles.formGroup}>
                        <label>New Password</label>
                        <input type="password" required className={styles.input} />
                    </div>
                    <button type="submit" className={styles.saveBtn} style={{ width: 'fit-content' }}>
                        Update Password
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
