import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <DashboardLayout>
            <div className={styles.container}>
                
                {/* Profile Header Card */}
                <div className={styles.profileHeader}>
                    <div className={styles.avatar}>
                        {user?.full_name?.charAt(0) || 'S'}
                    </div>
                    <div className={styles.userInfo}>
                        <h2>{user?.full_name || 'Student Name'}</h2>
                        <p>{user?.email || 'student@examverse.ai'}</p>
                        <span className={styles.roleBadge}>{user?.role || 'Student'}</span>
                    </div>
                </div>

                {/* Settings Grid */}
                <div className={styles.settingsGrid}>
                    
                    {/* Academic Settings */}
                    <div className={styles.settingsCard}>
                        <h3>Academic Preferences</h3>
                        
                        <div className={styles.settingRow}>
                            <div>
                                <h4>Selected Exam</h4>
                                <p>Change your primary target exam</p>
                            </div>
                            <select className={styles.selectBox} defaultValue="UPSC">
                                <option value="UPSC">UPSC Civil Services</option>
                                <option value="SSC">SSC CGL</option>
                                <option value="JEE">JEE Mains</option>
                            </select>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Language</h4>
                                <p>Preferred language for study material</p>
                            </div>
                            <select className={styles.selectBox} defaultValue="English">
                                <option value="English">English</option>
                                <option value="Hindi">Hindi</option>
                            </select>
                        </div>
                    </div>

                    {/* App Settings */}
                    <div className={styles.settingsCard}>
                        <h3>App Settings</h3>
                        
                        <div className={styles.settingRow}>
                            <div>
                                <h4>Dark Mode</h4>
                                <p>Toggle dark theme UI</p>
                            </div>
                            <label className={styles.switch}>
                                <input type="checkbox" />
                                <span className={styles.slider}></span>
                            </label>
                        </div>

                        <div className={styles.settingRow}>
                            <div>
                                <h4>Notifications</h4>
                                <p>Daily reminders and alerts</p>
                            </div>
                            <label className={styles.switch}>
                                <input type="checkbox" defaultChecked />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

                </div>

                {/* Danger Zone */}
                <div className={styles.dangerZone}>
                    <button onClick={logout} className={styles.logoutBtn}>
                        Log Out of Examverse
                    </button>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default Profile;
