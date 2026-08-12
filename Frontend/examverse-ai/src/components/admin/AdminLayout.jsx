import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './AdminLayout.module.css';
import { LayoutDashboard, BookOpen, Users, Settings, LogOut, ArrowLeft } from 'lucide-react';

const AdminLayout = ({ children }) => {
    return (
        <div className={styles.adminLayout}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <h2>Admin Panel</h2>
                </div>
                
                <nav className={styles.nav}>
                    <NavLink to="/admin" end className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <LayoutDashboard size={20} />
                        Dashboard
                    </NavLink>
                    <NavLink to="/admin/curriculum" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <BookOpen size={20} />
                        Curriculum Builder
                    </NavLink>
                    <NavLink to="/admin/users" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Users size={20} />
                        Users
                    </NavLink>
                    <NavLink to="/admin/settings" className={({isActive}) => isActive ? `${styles.navItem} ${styles.active}` : styles.navItem}>
                        <Settings size={20} />
                        Settings
                    </NavLink>
                </nav>

                <div className={styles.bottomNav}>
                    <NavLink to="/dashboard" className={styles.navItem}>
                        <ArrowLeft size={20} />
                        Exit Admin
                    </NavLink>
                    <button className={styles.logoutBtn}>
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
