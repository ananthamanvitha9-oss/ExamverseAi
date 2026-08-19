import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Resources.module.css';
import api from '../services/api';

const DEFAULT_RESOURCES = [
    {
        category: "Complete UPSC Strategy",
        icon: "🎯",
        channels: [
            { name: "Vision IAS", desc: "Exam strategy, current affairs, Mains answer writing, mock discussions." },
            { name: "Drishti IAS (English)", desc: "Concept classes, current affairs, editorials, answer writing." },
            { name: "Next IAS", desc: "Subject-wise lectures and strategy sessions." },
            { name: "ForumIAS", desc: "Mains guidance, interview guidance, PYQ analysis." }
        ]
    },
    {
        category: "Indian Polity",
        icon: "🏛️",
        topics: ["Constitution", "Fundamental Rights & Duties", "Parliament", "President & Prime Minister", "Judiciary", "Local Government"],
        channels: [{ name: "StudyIQ IAS" }, { name: "Drishti IAS (English)" }, { name: "Vision IAS" }]
    },
    {
        category: "History",
        icon: "📜",
        topics: ["Ancient India", "Medieval India", "Modern India", "Freedom Struggle", "Art & Culture"],
        channels: [{ name: "StudyIQ IAS" }, { name: "Vision IAS" }, { name: "Drishti IAS" }]
    },
    {
        category: "Geography",
        icon: "🌍",
        topics: ["Physical Geography", "Indian Geography", "World Geography", "Environment basics"],
        channels: [{ name: "PMF IAS" }, { name: "StudyIQ IAS" }, { name: "Vision IAS" }]
    },
    {
        category: "Economy",
        icon: "📈",
        topics: ["GDP", "Inflation", "Budget", "Banking", "RBI", "Fiscal & Monetary Policy"],
        channels: [{ name: "Mrunal Patel" }, { name: "StudyIQ IAS" }, { name: "Vision IAS" }]
    },
    {
        category: "Science & Technology",
        icon: "🔬",
        topics: ["Space", "Biotechnology", "AI", "Robotics", "Defence Technology"],
        channels: [{ name: "StudyIQ IAS" }, { name: "Drishti IAS" }, { name: "Vision IAS" }]
    }
];

const Resources = () => {
    const [resourcesData, setResourcesData] = useState([]);
    
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await api.get('/resources');
                if (response.data && response.data.length > 0) {
                    setResourcesData(response.data);
                } else {
                    setResourcesData(DEFAULT_RESOURCES);
                }
            } catch (err) {
                console.error("Failed to load resources", err);
                setResourcesData(DEFAULT_RESOURCES);
            }
        };
        fetchResources();
    }, []);
    
    const getYouTubeSearchUrl = (query) => {
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(query + ' UPSC')}`;
    };

    const getGoogleSearchUrl = (query) => {
        return `https://www.google.com/search?q=${encodeURIComponent(query + ' UPSC study material free')}`;
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Curated Study Resources 📚</h1>
                    <p>A hand-picked selection of the best free YouTube and Google resources covering the exam syllabus from beginner to advanced.</p>
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
                                <strong>Recommended Resources:</strong>
                                <ul>
                                    {section.channels.map((channel, cIdx) => (
                                        <li key={cIdx}>
                                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                                <strong>{channel.name}</strong>
                                                <a 
                                                    href={getYouTubeSearchUrl(channel.name)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className={styles.channelLink}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none' }}
                                                >
                                                    YouTube 📺
                                                </a>
                                                <a 
                                                    href={getGoogleSearchUrl(channel.name)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className={styles.channelLink}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', textDecoration: 'none' }}
                                                >
                                                    Google 🔍
                                                </a>
                                            </div>
                                            {channel.desc && <p className={styles.channelDesc} style={{ marginTop: '5px' }}>{channel.desc}</p>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
                
                <div className={styles.footerNote}>
                    <p>💡 <strong>Pro Tip:</strong> These channels are widely used by aspirants and are sufficient to build a strong foundation without paid coaching. Consistency, revision, and regular practice matter more than the number of resources you follow.</p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Resources;
