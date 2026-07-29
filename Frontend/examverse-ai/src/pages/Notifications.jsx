import React from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Profile.module.css';

const Notifications = () => {
    const notifications = [
        { id: 1, title: 'Welcome to Examverse AI!', date: 'Today', read: false },
        { id: 2, title: 'Your new AI Study Plan is ready.', date: 'Yesterday', read: true },
        { id: 3, title: 'New Mock Test available for UPSC CSE.', date: '2 days ago', read: true },
    ];

    return (
        <DashboardLayout>
            <div className={styles.header}>
                <h1>Notifications</h1>
                <p>Stay updated with system alerts and AI updates.</p>
            </div>
            
            <div className={styles.card}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {notifications.map(note => (
                        <div key={note.id} style={{
                            padding: '15px',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            background: note.read ? 'white' : '#f0fdf4',
                            borderLeft: note.read ? '1px solid #e5e7eb' : '4px solid #22c55e'
                        }}>
                            <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem', color: '#111827' }}>
                                {note.title}
                            </h3>
                            <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>{note.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Notifications;
