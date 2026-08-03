import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import styles from './Topbar.module.css';

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();

    return (
        <header className={styles.topbar}>
            <div className={styles.leftSection}>
                <button className={styles.menuBtn} onClick={onMenuClick} title="Open Menu">
                    ☰
                </button>
                {/* Left: Search Bar */}
                <div className={styles.searchContainer}>
                    <span className={styles.searchIcon}>🔍</span>
                    <input 
                        type="text" 
                        placeholder="Search courses, tests..." 
                        className={styles.searchInput} 
                    />
                </div>
            </div>

            {/* Right: Actions */}
            <div className={styles.actionsContainer}>
                
                {/* Dark Mode Toggle */}
                <button className={styles.iconBtn} title="Dark Mode">
                    🌙
                </button>

                {/* Notifications */}
                <button className={styles.iconBtn} title="Notifications">
                    🔔
                    <span className={styles.badge}>3</span>
                </button>

                {/* Profile Link */}
                <Link to="/dashboard/profile" className={styles.profileLink}>
                    <div className={styles.avatar}>
                        {user?.full_name?.charAt(0) || 'S'}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Topbar;
