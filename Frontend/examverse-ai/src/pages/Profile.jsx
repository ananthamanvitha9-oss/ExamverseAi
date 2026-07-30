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

    const [avatarUrl, setAvatarUrl] = useState(null);
    const [uploading, setUploading] = useState(false);

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
                setAvatarUrl(response.data.avatar_url || null);
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

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('avatar', file);

        setUploading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/user/avatar', formData, {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            setAvatarUrl(response.data.avatar_url);
            setMessage("Profile picture uploaded successfully!");
        } catch (error) {
            console.error("Error uploading avatar", error);
            setMessage("Failed to upload profile picture.");
        } finally {
            setUploading(false);
        }
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

                {message && <div className={styles.alert}>{message}</div>}

                <div className={styles.settingsGrid}>
                    <div className={styles.settingsCard}>
                        <h3>Personal Information</h3>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatarCircle}>
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className={styles.avatarImg} />
                                ) : (
                                    <span className={styles.avatarInitials}>{user.name ? user.name.charAt(0) : 'U'}</span>
                                )}
                            </div>
                            <div className={styles.uploadControls}>
                                <h4>Profile Picture</h4>
                                <label className={styles.uploadBtn}>
                                    {uploading ? 'Uploading...' : 'Upload New Photo'}
                                    <input type="file" onChange={handleUpload} accept="image/*" disabled={uploading} style={{display: 'none'}} />
                                </label>
                            </div>
                        </div>
                        <div className={styles.settingRow}>
                            <div>
                                <h4>Full Name</h4>
                                <input type="text" name="name" value={user.name} onChange={handleChange} className={styles.inputBox} />
                            </div>
                        </div>
                        <div className={styles.settingRow}>
                            <div>
                                <h4>Email Address</h4>
                                <input type="email" value={user.email} disabled className={styles.inputBox} />
                            </div>
                        </div>
                        <button onClick={handleSave} disabled={saving} className={styles.saveBtn}>
                            {saving ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>

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
