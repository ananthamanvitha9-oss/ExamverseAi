import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../services/api';
import styles from './Leaderboard.module.css';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [currentUserStats, setCurrentUserStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await api.get('/leaderboard', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLeaderboard(response.data.leaderboard);
                setCurrentUserStats(response.data.current_user);
            } catch (error) {
                console.error("Failed to fetch leaderboard", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const getRankIcon = (index) => {
        if (index === 0) return <Trophy className={styles.gold} />;
        if (index === 1) return <Medal className={styles.silver} />;
        if (index === 2) return <Award className={styles.bronze} />;
        return <span className={styles.rankNumber}>#{index + 1}</span>;
    };

    if (loading) return <DashboardLayout><div className={styles.loading}>Loading Leaderboard...</div></DashboardLayout>;

    return (
        <DashboardLayout>
            <Helmet>
                <title>Global Leaderboard | Examverse AI</title>
            </Helmet>
            
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Global Leaderboard</h1>
                    <p>Compete with students worldwide by completing mock tests and studying.</p>
                </div>

                <div className={styles.myStatsCard}>
                    <div className={styles.statBox}>
                        <h3>Your Rank</h3>
                        <p className={styles.statValue}>#{currentUserStats?.rank || '-'}</p>
                    </div>
                    <div className={styles.statBox}>
                        <h3>Your Points</h3>
                        <p className={styles.statValue}>
                            <Star className={styles.starIcon} size={24} /> 
                            {currentUserStats?.points || 0}
                        </p>
                    </div>
                </div>

                <div className={styles.boardCard}>
                    <div className={styles.list}>
                        {leaderboard.map((user, index) => (
                            <div key={user.id} className={`${styles.listItem} ${index < 3 ? styles.topThree : ''}`}>
                                <div className={styles.rankCol}>
                                    {getRankIcon(index)}
                                </div>
                                <div className={styles.userCol}>
                                    <div className={styles.avatar}>
                                        {user.avatar || user.profile_photo ? (
                                            <img src={user.avatar || user.profile_photo} alt={user.full_name} />
                                        ) : (
                                            <span>{user.full_name.charAt(0)}</span>
                                        )}
                                    </div>
                                    <span className={styles.name}>{user.full_name}</span>
                                </div>
                                <div className={styles.pointsCol}>
                                    {user.points} pts
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Leaderboard;
