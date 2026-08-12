import React from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Users, BookOpen, GraduationCap, DollarSign } from 'lucide-react';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
    return (
        <AdminLayout>
            <div className={styles.header}>
                <h1>Dashboard Overview</h1>
                <p>Welcome back, Admin!</p>
            </div>

            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.iconBox} style={{backgroundColor: '#eff6ff', color: '#3b82f6'}}>
                        <Users size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Students</h3>
                        <p>12,450</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconBox} style={{backgroundColor: '#fef2f2', color: '#ef4444'}}>
                        <BookOpen size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Total Subjects</h3>
                        <p>145</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconBox} style={{backgroundColor: '#ecfdf5', color: '#10b981'}}>
                        <GraduationCap size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Mock Tests Taken</h3>
                        <p>8,234</p>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.iconBox} style={{backgroundColor: '#fefce8', color: '#eab308'}}>
                        <DollarSign size={24} />
                    </div>
                    <div className={styles.statInfo}>
                        <h3>Monthly Revenue</h3>
                        <p>₹45,200</p>
                    </div>
                </div>
            </div>

            <div className={styles.recentActivity}>
                <h2>Recent Activity</h2>
                <div className={styles.activityList}>
                    <div className={styles.activityItem}>
                        <div className={styles.dot}></div>
                        <p>New user <strong>Rahul Verma</strong> registered.</p>
                        <span>2 mins ago</span>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.dot}></div>
                        <p><strong>UPSC Prelims</strong> mock test added by Teacher A.</p>
                        <span>1 hour ago</span>
                    </div>
                    <div className={styles.activityItem}>
                        <div className={styles.dot}></div>
                        <p>Payment of ₹999 received from <strong>Priya S.</strong></p>
                        <span>3 hours ago</span>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
