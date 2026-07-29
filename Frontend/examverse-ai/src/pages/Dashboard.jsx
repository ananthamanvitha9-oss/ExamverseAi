import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useAuth();

    return (
        <div style={{ padding: '4rem 2rem', minHeight: '80vh', backgroundColor: '#f9fafb' }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                <h2>Welcome to your Dashboard, {user?.full_name}!</h2>
                <p>Role: {user?.role}</p>
                <p>Email: {user?.email}</p>
                <hr style={{ margin: '2rem 0' }} />
                <h3>Your Study Streak: 5 Days 🔥</h3>
                <p>You have completely secured this page. Only logged-in users can see this!</p>
            </div>
        </div>
    );
};

export default Dashboard;
