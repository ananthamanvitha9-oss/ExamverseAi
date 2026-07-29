import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
    const navItems = [
        { name: "Dashboard", path: "/dashboard", icon: "🏠" },
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
        </aside>
    );
};

export default Sidebar;
