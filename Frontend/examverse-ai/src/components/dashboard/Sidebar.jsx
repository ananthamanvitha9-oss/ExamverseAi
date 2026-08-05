import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import PaymentModal from './PaymentModal';

const Sidebar = ({ isOpen, onClose }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: "🏠" },
        { name: "Analytics", path: "/dashboard/analytics", icon: "📈" },
        { name: "Courses", path: "/dashboard/courses", icon: "📚" },
        { name: "Mock Tests", path: "/dashboard/tests", icon: "📝" },
        { name: "AI Tutor", path: "/dashboard/ai-tutor", icon: "🤖" },
        { name: "AI Study Planner", path: "/dashboard/study-planner", icon: "📅" },
        { name: "Resources", path: "/dashboard/resources", icon: "📚" },
        { name: "Global Room", path: "/dashboard/study-room", icon: "💬" },
        { name: "Leaderboard", path: "/dashboard/leaderboard", icon: "🏆" },
        { name: "Geopolitics Map", path: "/dashboard/map", icon: "🗺️" },
        { name: "Current Affairs", path: "/dashboard/news", icon: "📰" },
        { name: "Notes", path: "/dashboard/notes", icon: "📖" },
        { name: "Profile", path: "/dashboard/profile", icon: "👤" },
        { name: "Settings", path: "/dashboard/settings", icon: "⚙️" },
    ];

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <h2>Examverse<span>AI</span></h2>
                </div>
                <nav className={styles.navMenu}>
                    {navItems.map((item, index) => (
                        <NavLink 
                            key={index} 
                            to={item.path} 
                            end={item.path === "/dashboard"}
                            onClick={onClose}
                            className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        >
                            <span className={styles.icon}>{item.icon}</span>
                            {item.name}
                        </NavLink>
                    ))}
                </nav>

                <div className={styles.upgradeSection}>
                    <button 
                        className={styles.upgradeBtn}
                        onClick={() => setIsPaymentModalOpen(true)}
                    >
                        👑 Upgrade to Pro
                    </button>
                </div>

                <PaymentModal 
                    isOpen={isPaymentModalOpen} 
                    onClose={() => setIsPaymentModalOpen(false)} 
                />
            </aside>
        </>
    );
};

export default Sidebar;
