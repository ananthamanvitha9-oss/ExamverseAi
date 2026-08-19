import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';
import { Search, Bell, Menu, Sun, Moon, Monitor } from 'lucide-react';
import styles from './Topbar.module.css';

const Topbar = ({ onMenuClick }) => {
    const { user } = useAuth();
    const { theme, setTheme } = useTheme();
    const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);
    const themeMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
                setIsThemeMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const renderThemeIcon = () => {
        if (theme === 'dark') return <Moon size={20} />;
        if (theme === 'light') return <Sun size={20} />;
        return <Monitor size={20} />;
    };

    return (
        <header className={styles.topbar}>
            <div className={styles.leftSection}>
                <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Open Menu">
                    <Menu size={24} />
                </button>
                
                <div className={styles.searchContainer}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search courses, tests, topics..." 
                        className={styles.searchInput} 
                    />
                </div>
            </div>

            <div className={styles.actionsContainer}>
                {/* Theme Selector */}
                <div className={styles.themeSelector} ref={themeMenuRef}>
                    <button 
                        className={styles.iconBtn} 
                        onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
                        aria-label="Toggle theme"
                        title="Theme settings"
                    >
                        {renderThemeIcon()}
                    </button>
                    
                    {isThemeMenuOpen && (
                        <div className={styles.themeMenu}>
                            <button 
                                className={`${styles.themeOption} ${theme === 'light' ? styles.activeTheme : ''}`}
                                onClick={() => { setTheme('light'); setIsThemeMenuOpen(false); }}
                            >
                                <Sun size={16} /> Light
                            </button>
                            <button 
                                className={`${styles.themeOption} ${theme === 'dark' ? styles.activeTheme : ''}`}
                                onClick={() => { setTheme('dark'); setIsThemeMenuOpen(false); }}
                            >
                                <Moon size={16} /> Dark
                            </button>
                            <button 
                                className={`${styles.themeOption} ${theme === 'system' ? styles.activeTheme : ''}`}
                                onClick={() => { setTheme('system'); setIsThemeMenuOpen(false); }}
                            >
                                <Monitor size={16} /> System
                            </button>
                        </div>
                    )}
                </div>

                <button className={styles.iconBtn} aria-label="Notifications" title="Notifications">
                    <Bell size={20} />
                    <span className={styles.badge}>3</span>
                </button>

                <Link to="/dashboard/profile" className={styles.profileLink}>
                    <div className={styles.avatar}>
                        {user?.full_name?.charAt(0) || 'U'}
                    </div>
                </Link>
            </div>
        </header>
    );
};

export default Topbar;
