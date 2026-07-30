import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Users, DollarSign, Activity, TrendingUp, LogOut } from 'lucide-react';
import api from '../services/api';
import styles from './AdminDashboard.module.css';
import { Helmet } from 'react-helmet-async';

const AdminDashboard = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAdminStats = async () => {
            try {
                const response = await api.get('/admin/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAdminStats();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className={styles.loading}>Loading Admin Portal...</div>;

    return (
        <div className={styles.adminLayout}>
            <Helmet>
                <title>Super Admin | Examverse AI</title>
            </Helmet>
            
            {/* Admin Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.logo}>Examverse <span>Admin</span></div>
                <nav className={styles.nav}>
                    <a href="#" className={styles.active}>Dashboard</a>
                    <a href="#">Users</a>
                    <a href="#">Payments</a>
                    <a href="#">Settings</a>
                </nav>
                <button onClick={handleLogout} className={styles.logoutBtn}>
                    <LogOut size={18} /> Exit Admin
                </button>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                <header className={styles.header}>
                    <h1>Platform Overview</h1>
                    <div className={styles.adminBadge}>Super Admin</div>
                </header>

                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon}><Users /></div>
                        <div className={styles.metricInfo}>
                            <h3>Total Users</h3>
                            <p className={styles.value}>{stats?.stats?.total_users || 0}</p>
                        </div>
                    </div>
                    
                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#10b981' }}>
                            <DollarSign />
                        </div>
                        <div className={styles.metricInfo}>
                            <h3>Total Revenue</h3>
                            <p className={styles.value}>₹{stats?.stats?.total_revenue?.toLocaleString() || 0}</p>
                        </div>
                    </div>

                    <div className={styles.metricCard}>
                        <div className={styles.metricIcon} style={{ background: '#f5f3ff', color: '#8b5cf6' }}>
                            <Activity />
                        </div>
                        <div className={styles.metricInfo}>
                            <h3>Transactions</h3>
                            <p className={styles.value}>{stats?.stats?.total_transactions || 0}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.tablesContainer}>
                    <div className={styles.tableCard}>
                        <h2>Recent Signups</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recent_users?.map(user => (
                                    <tr key={user.id}>
                                        <td>{user.full_name}</td>
                                        <td>{user.email}</td>
                                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className={styles.tableCard}>
                        <h2>Recent Payments</h2>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Amount</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recent_payments?.length > 0 ? (
                                    stats.recent_payments.map(payment => (
                                        <tr key={payment.id}>
                                            <td>{payment.user?.full_name}</td>
                                            <td>₹{(payment.amount / 100).toLocaleString()}</td>
                                            <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center' }}>No payments yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
