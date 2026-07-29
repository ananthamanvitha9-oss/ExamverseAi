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
            <div className={styles.header}>
                <h1>Current Affairs & News</h1>
                <p>Stay updated with daily insights, weekly recaps, and monthly magazines.</p>
            </div>

            <div className={styles.tabs}>
                {['Daily', 'Weekly', 'Monthly'].map(tab => (
                    <button 
                        key={tab}
                        className={`${styles.tabBtn} ${activeTab === tab ? styles.activeTab : ''}`}
                        onClick={() => setActiveTab(tab)}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading news...</p>
            ) : (
                <div className={styles.newsGrid}>
                    {filteredArticles.length > 0 ? filteredArticles.map(article => (
                        <div key={article.id} className={styles.newsCard}>
                            <div className={styles.date}>
                                {new Date(article.created_at).toLocaleDateString()}
                            </div>
                            <h3 className={styles.cardTitle}>{article.title}</h3>
                            <p className={styles.cardExcerpt}>
                                {article.content.substring(0, 100)}...
                            </p>
                            <div className={styles.cardActions}>
                                <button className={styles.readBtn} onClick={() => openModal(article)}>
                                    Read More &rarr;
                                </button>
                                {article.pdf_url && (
                                    <a href={article.pdf_url} target="_blank" rel="noreferrer" className={styles.downloadBtn}>
                                        Download PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    )) : (
                        <p>No {activeTab.toLowerCase()} articles found.</p>
                    )}
                </div>
            )}

            {/* Reading Modal */}
            {selectedArticle && (
                <div className={styles.modalOverlay} onClick={closeModal}>
                    <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
                        <span className={styles.modalCategory}>{selectedArticle.category}</span>
                        <h2 className={styles.modalTitle}>{selectedArticle.title}</h2>
                        <div className={styles.date}>Published on {new Date(selectedArticle.created_at).toLocaleDateString()}</div>
                        <div className={styles.modalBody}>
                            <p>{selectedArticle.content}</p>
                        </div>
                        {selectedArticle.pdf_url && (
                            <div style={{ marginTop: '30px' }}>
                                <a href={selectedArticle.pdf_url} target="_blank" rel="noreferrer" style={{ background: '#2563eb', color: 'white', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', display: 'inline-block' }}>
                                    Download Full PDF Magazine
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default CurrentAffairs;
