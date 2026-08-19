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
            
            <div className={styles.settingsCard}>
                <h2>Preferences</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '20px' }}>
                    <label style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Dark Mode</label>
                    <button 
                        onClick={() => setDarkMode(!darkMode)}
                        style={{
                            padding: '8px 16px',
                            background: darkMode ? 'var(--primary)' : 'var(--bg-hover)',
                            color: darkMode ? 'white' : 'var(--text-primary)',
                            border: '1px solid var(--border-light)',
                            borderRadius: '20px',
                            cursor: 'pointer'
                        }}
                    >
                        {darkMode ? 'Enabled' : 'Disabled'}
                    </button>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                        (Theme switching will be fully implemented in a future update)
                    </span>
                </div>
                
                <hr style={{ margin: '30px 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />
                
                <h2>Security</h2>
                <form style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }} onSubmit={(e) => { e.preventDefault(); alert('Password change simulated.'); }}>
                    <div className={styles.settingRow}>
                        <h4>Current Password</h4>
                        <input type="password" required className={styles.inputBox} />
                    </div>
                    <div className={styles.settingRow}>
                        <h4>New Password</h4>
                        <input type="password" required className={styles.inputBox} />
                    </div>
                    <button type="submit" className={styles.saveBtn} style={{ width: 'fit-content', padding: '0.75rem 1.5rem' }}>
                        Update Password
                    </button>
                </form>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
