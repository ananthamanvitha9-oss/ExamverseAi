import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './CurrentAffairs.module.css';
import { newsData as dummyNews } from '../data/news'; // Importing Dummy Data

const CurrentAffairs = () => {
    const [activeTab, setActiveTab] = useState("Today's News");
    const [newsData, setNewsData] = useState([]);
    const [loading, setLoading] = useState(true);

    const tabs = ["Today's News", "Weekly News", "Monthly Magazine", "Editorial Analysis", "Bookmarks"];

    // Simulate Backend API Fetch
    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            setNewsData(dummyNews);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [activeTab]); // Re-fetch when tab changes (simulating fetching different categories)

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <h2 className={styles.pageTitle}>Current Affairs</h2>
                
                {/* Navigation Tabs */}
                <div className={styles.tabsContainer}>
                    {tabs.map((tab) => (
                        <button 
                            key={tab}
                            className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* News Cards Grid */}
                {loading ? (
                    <p>Loading news...</p>
                ) : (
                    <div className={styles.newsGrid}>
                        {newsData.map((news) => (
                            <div key={news.id} className={styles.newsCard}>
                                <div className={styles.cardHeader}>
                                    <span className={styles.categoryBadge}>{news.category}</span>
                                    <button className={styles.bookmarkBtn}>🔖</button>
                                </div>
                                <h3 className={styles.newsTitle}>{news.title}</h3>
                                <div className={styles.cardFooter}>
                                    <span>📅 {news.date}</span>
                                    <span>⏱️ {news.readTime} read</span>
                                </div>
                                <button className={styles.readMoreBtn}>Read Full Article ➔</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CurrentAffairs;
