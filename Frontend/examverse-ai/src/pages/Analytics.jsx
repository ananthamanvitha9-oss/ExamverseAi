import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Analytics.module.css';
import api from '../services/api';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, AreaChart, Area, Legend
} from 'recharts';
import { Target, Clock, TrendingUp, Award } from 'lucide-react';

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await api.get('/analytics');
                setData(response.data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <DashboardLayout>
                <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                    <p>Loading your insights...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!data) {
        return (
            <DashboardLayout>
                <div className={styles.container}>
                    <h2>No data available yet! Start studying to see your analytics.</h2>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>📊 Performance Analytics</h1>
                    <p>Track your progress, identify weaknesses, and optimize your study plan.</p>
                </div>

                {/* Summary Cards */}
                <div className={styles.summaryGrid}>
                    <div className={styles.summaryCard}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: '#eff6ff', color: '#3b82f6' }}>
                            <Target size={24} />
                        </div>
                        <div className={styles.cardInfo}>
                            <p className={styles.cardLabel}>Tests Taken</p>
                            <h3 className={styles.cardValue}>{data.summary.total_tests}</h3>
                        </div>
                    </div>
                    
                    <div className={styles.summaryCard}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}>
                            <Award size={24} />
                        </div>
                        <div className={styles.cardInfo}>
                            <p className={styles.cardLabel}>Average Score</p>
                            <h3 className={styles.cardValue}>{data.summary.avg_score}%</h3>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: '#fffbeb', color: '#f59e0b' }}>
                            <Clock size={24} />
                        </div>
                        <div className={styles.cardInfo}>
                            <p className={styles.cardLabel}>Hours Studied</p>
                            <h3 className={styles.cardValue}>{data.summary.hours_studied}h</h3>
                        </div>
                    </div>

                    <div className={styles.summaryCard}>
                        <div className={styles.iconWrapper} style={{ backgroundColor: '#fef2f2', color: '#ef4444' }}>
                            <TrendingUp size={24} />
                        </div>
                        <div className={styles.cardInfo}>
                            <p className={styles.cardLabel}>Current Trend</p>
                            <h3 className={styles.cardValue}>+4.5%</h3>
                        </div>
                    </div>
                </div>

                {/* Charts Grid */}
                <div className={styles.chartsGrid}>
                    {/* Test Scores Trend */}
                    <div className={`${styles.chartCard} ${styles.fullWidth}`}>
                        <h3>Mock Test Performance Over Time</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={data.test_scores} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
                                    <Tooltip 
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: 'white' }} activeDot={{ r: 6 }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Subject Mastery */}
                    <div className={styles.chartCard}>
                        <h3>Subject Mastery</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data.subject_performance} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} domain={[0, 100]} />
                                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Bar dataKey="score" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Time Spent */}
                    <div className={styles.chartCard}>
                        <h3>Weekly Study Hours</h3>
                        <div className={styles.chartWrapper}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.time_spent} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b'}} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                    <Area type="monotone" dataKey="hours" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorHours)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
