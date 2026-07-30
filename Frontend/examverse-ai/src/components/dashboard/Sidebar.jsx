import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';
import PaymentModal from './PaymentModal';

const Sidebar = () => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: "🏠" },
        { name: "Analytics", path: "/dashboard/analytics", icon: "📈" },
        { name: "Courses", path: "/dashboard/courses", icon: "📚" },
        { name: "Mock Tests", path: "/dashboard/tests", icon: "📝" },
        { name: "AI Tutor", path: "/dashboard/ai-tutor", icon: "🤖" },
        { name: "Current Affairs", path: "/dashboard/news", icon: "📰" },
        { name: "Notes", path: "/dashboard/notes", icon: "📖" },
        { name: "Profile", path: "/dashboard/profile", icon: "👤" },
        { name: "Settings", path: "/dashboard/settings", icon: "⚙️" },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <h2>Examverse<span>AI</span></h2>
            </div>
            <nav className={styles.navMenu}>
                {navItems.map((item, index) => (
                    <NavLink 
                        key={index} 
                        to={item.path} 
                        end={item.path === "/dashboard"}
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
    );
};

export default Sidebar;
