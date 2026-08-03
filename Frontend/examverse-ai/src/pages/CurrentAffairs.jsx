import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import api from '../services/api';
import styles from './CurrentAffairs.module.css';
const CurrentAffairs = () => {
    const [activeTab, setActiveTab] = useState('Daily');
    const [loading, setLoading] = useState(false);
    const [selectedArticle, setSelectedArticle] = useState(null);

    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true);
            try {
                const response = await api.get('/news');
                setArticles(response.data);
            } catch (error) {
                console.error("Failed to fetch news", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filteredArticles = articles.filter(a => a.category === activeTab);

    const openModal = (article) => setSelectedArticle(article);
    const closeModal = () => setSelectedArticle(null);

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Current Affairs & News</h1>
                    <p>Stay updated with daily insights, weekly recaps, and monthly magazines.</p>
                </div>

                <div className={styles.tabsContainer}>
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
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default CurrentAffairs;
