import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, BookOpen, Map, Library, GraduationCap, 
    PenTool, FileText, CalendarHeart, BrainCircuit,
    Bot, Calendar, FileQuestion, Globe, Bookmark, Edit3, 
    User, Settings, Crown, Trophy, Users, Clock, Flame
} from 'lucide-react';
import styles from './Sidebar.module.css';
import PaymentModal from './PaymentModal';

const Sidebar = ({ isOpen, onClose }) => {
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

    const navGroups = [
        {
            title: "LEARN",
            items: [
                { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard size={20} /> },
                { name: "My Learning", path: "/dashboard/courses", icon: <GraduationCap size={20} /> },
                { name: "Explore Exams", path: "/dashboard/syllabus", icon: <Map size={20} /> },
                { name: "Study Explorer", path: "/dashboard/study-explorer", icon: <Library size={20} /> },
                { name: "Global Room", path: "/dashboard/study-room", icon: <Users size={20} /> },
                { name: "Leaderboard", path: "/dashboard/leaderboard", icon: <Trophy size={20} /> },
            ]
        },
        {
            title: "PRACTICE",
            items: [
                { name: "Practice Quiz", path: "/dashboard/practice-quiz", icon: <PenTool size={20} /> },
                { name: "Mock Tests", path: "/dashboard/tests", icon: <FileText size={20} /> },
                { name: "Daily Quiz", path: "/dashboard/daily-quiz", icon: <Flame size={20} /> },
                { name: "Focus Timer", path: "/dashboard/focus", icon: <Clock size={20} /> },
            ]
        },
        {
            title: "AI & TOOLS",
            items: [
                { name: "AI Tutor", path: "/dashboard/ai-tutor", icon: <Bot size={20} /> },
                { name: "Study Planner", path: "/dashboard/study-planner", icon: <Calendar size={20} /> },
                { name: "Flashcards", path: "/dashboard/flashcards", icon: <BrainCircuit size={20} /> },
            ]
        },
        {
            title: "RESOURCES",
            items: [
                { name: "Current Affairs", path: "/dashboard/news", icon: <Globe size={20} /> },
                { name: "Study Materials", path: "/dashboard/resources", icon: <Bookmark size={20} /> },
                { name: "Geopolitics Map", path: "/dashboard/map", icon: <Globe size={20} /> },
                { name: "My Notes", path: "/dashboard/notes", icon: <Edit3 size={20} /> },
            ]
        },
        {
            title: "ACCOUNT",
            items: [
                { name: "Profile", path: "/dashboard/profile", icon: <User size={20} /> },
                { name: "Settings", path: "/dashboard/settings", icon: <Settings size={20} /> },
            ]
        }
    ];

    return (
        <>
            {isOpen && <div className={styles.overlay} onClick={onClose}></div>}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                <div className={styles.logo}>
                    <h2>ExamVerse<span>AI</span></h2>
                </div>
                
                <div className={styles.navContainer}>
                    {navGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className={styles.navGroup}>
                            <h3 className={styles.groupTitle}>{group.title}</h3>
                            <nav className={styles.navMenu}>
                                {group.items.map((item, index) => (
                                    <NavLink 
                                        key={index} 
                                        to={item.path} 
                                        end={item.path === "/dashboard"}
                                        onClick={onClose}
                                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                                    >
                                        <span className={styles.icon}>{item.icon}</span>
                                        <span className={styles.linkText}>{item.name}</span>
                                    </NavLink>
                                ))}
                            </nav>
                        </div>
                    ))}
                </div>

                <div className={styles.upgradeSection}>
                    <button 
                        className={styles.upgradeBtn}
                        onClick={() => setIsPaymentModalOpen(true)}
                    >
                        <Crown size={18} />
                        <span>Upgrade to Pro</span>
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
