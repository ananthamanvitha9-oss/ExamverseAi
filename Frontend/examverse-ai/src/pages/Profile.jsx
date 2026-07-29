import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './Profile.module.css';

const Profile = () => {
    const { logout } = useAuth();
    const [user, setUser] = useState({ name: '', email: '', phone: '', target_exam: '' });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }
                const response = await api.get('/user', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUser({
                    name: response.data.name || '',
                    email: response.data.email || '',
                    phone: response.data.phone || '',
                    target_exam: response.data.target_exam || ''
                });
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const token = localStorage.getItem('token');
            await api.put('/user', user, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage("Failed to update profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <DashboardLayout><p>Loading...</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className={styles.profileContainer}>
                <div className={styles.header}>
                    <h1>Profile Settings</h1>
                </div>

                <div className={styles.settingsGrid}>
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
