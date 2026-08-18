import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Resources.module.css';
import api from '../services/api';

const Resources = () => {
    const [resourcesData, setResourcesData] = useState([]);
    
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                setResourcesData(response.data);
            } catch (err) {
                console.error("Failed to load resources", err);
            }
        };
        fetchResources();
    }, []);
    
    const getYouTubeSearchUrl = (query) => {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' UPSC')}`;
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Curated Study Resources 📚</h1>
                    <p>A hand-picked selection of the best free YouTube resources covering the UPSC Civil Services syllabus from beginner to advanced.</p>
                </div>

                <div className={styles.bannersGrid}>
                    <div className={styles.routineBanner}>
                        <h3>Suggested Daily Routine</h3>
                        <ul>
                            <li><span>2 hours</span> Subject lecture</li>
                            <li><span>2 hours</span> NCERT/Standard books</li>
                            <li><span>1 hour</span> Current affairs</li>
                            <li><span>1 hour</span> Revision</li>
                            <li><span>30 mins</span> PYQs</li>
                            <li><span>30 mins</span> Answer writing (after 2–3 months)</li>
                        </ul>
                    </div>
                    <div className={styles.beginnerBanner}>
                        <h3>Beginner Order (First 3 Months)</h3>
                        <ol>
                            <li>NCERT History (Class 6–12) & Geography (Class 6–12)</li>
                            <li>NCERT Polity (basics) & M. Laxmikanth</li>
                            <li>Modern History (Spectrum)</li>
                            <li>Economy basics (Mrunal/StudyIQ)</li>
                            <li>Environment (PMF IAS)</li>
                            <li>Current Affairs (daily) & PYQs every weekend</li>
                        </ol>
                    </div>
                </div>

                <div className={styles.resourcesGrid}>
                    {resourcesData.map((section, idx) => (
                        <div key={idx} className={styles.resourceCard}>
                            <div className={styles.cardHeader}>
                                <span className={styles.icon}>{section.icon}</span>
                                <h2>{section.category}</h2>
                            </div>
                            
                            {section.desc && <p className={styles.sectionDesc}>{section.desc}</p>}
                            
                            {section.topics && section.topics.length > 0 && (
                                <div className={styles.topics}>
                                    <strong>Key Topics:</strong> {section.topics.join(', ')}
                                </div>
                            )}

                            <div className={styles.channelsList}>
                                <strong>Recommended Channels:</strong>
                                <ul>
                                    {section.channels.map((channel, cIdx) => (
                                        <li key={cIdx}>
                                            <a 
                                                href={getYouTubeSearchUrl(channel.name)} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className={styles.channelLink}
                                            >
                                                {channel.name} <span>📺</span>
                                            </a>
                                            {channel.desc && <p className={styles.channelDesc}>{channel.desc}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className={styles.footerNote}>
                    <p>💡 <strong>Pro Tip:</strong> These channels are widely used by UPSC aspirants and are sufficient to build a strong foundation without paid coaching. Consistency, revision, and regular practice matter more than the number of resources you follow.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Resources;
