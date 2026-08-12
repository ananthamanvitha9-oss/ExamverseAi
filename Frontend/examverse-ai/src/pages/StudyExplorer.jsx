import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './StudyExplorer.module.css';
import api from '../services/api';
import { ChevronRight, ChevronDown, Folder, Book, FileText, Video, HelpCircle, BrainCircuit } from 'lucide-react';

const materialIcons = {
    'note': <FileText size={18} className={styles.icon} style={{color: '#8b5cf6'}}/>,
    'video': <Video size={18} className={styles.icon} style={{color: '#ef4444'}}/>,
    'mcq': <HelpCircle size={18} className={styles.icon} style={{color: '#f59e0b'}}/>,
    'pyq': <HelpCircle size={18} className={styles.icon} style={{color: '#10b981'}}/>,
    'quiz': <HelpCircle size={18} className={styles.icon} style={{color: '#3b82f6'}}/>,
    'ai_prompt': <BrainCircuit size={18} className={styles.icon} style={{color: '#ec4899'}}/>
};

const TreeNode = ({ node, level = 0 }) => {
    const [isOpen, setIsOpen] = useState(false);

    // If it's a material node
    if (node.type) {
        return (
            <div className={styles.materialNode}>
                {materialIcons[node.type] || <FileText size={18} />}
                <span className={styles.materialTitle}>{node.title}</span>
            </div>
        );
    }

    // Determine children based on level
    let children = [];
    let badgeText = '';
    if (node.subjects) { children = node.subjects; badgeText = 'Exam'; }
    else if (node.units) { children = node.units; badgeText = 'Subject'; }
    else if (node.chapters) { children = node.chapters; badgeText = 'Unit'; }
    else if (node.topics) { children = node.topics; badgeText = 'Chapter'; }
    else if (node.sub_topics) { children = node.sub_topics; badgeText = 'Topic'; }
    else if (node.learning_materials) { children = node.learning_materials; badgeText = 'Sub Topic'; }

    return (
        <div className={styles.node}>
            <div className={styles.nodeHeader} onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <ChevronDown size={20} className={styles.icon}/> : <ChevronRight size={20} className={styles.icon}/>}
                <Folder size={20} className={styles.icon} style={{color: level === 0 ? '#3b82f6' : '#64748b'}} />
                <span className={styles.title}>{node.name}</span>
                <span className={styles.badge}>{badgeText}</span>
            </div>
            {isOpen && children.length > 0 && (
                <div className={styles.nodeContent}>
                    {children.map((child, idx) => (
                        <TreeNode key={idx} node={child} level={level + 1} />
                    ))}
                </div>
            )}
            {isOpen && children.length === 0 && (
                <div className={styles.nodeContent}>
                    <p style={{color: '#94a3b8', fontSize: '0.9rem', fontStyle: 'italic'}}>No content available yet.</p>
                </div>
            )}
        </div>
    );
};

const StudyExplorer = () => {
    const [hierarchy, setHierarchy] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHierarchy = async () => {
            try {
                // Fetch Exam ID 1 (Assuming UPSC is seeded as 1)
                const response = await api.get('/hierarchy/1');
                setHierarchy(response.data);
            } catch (error) {
                console.error("Failed to fetch hierarchy", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHierarchy();
    }, []);

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>🌳 Deep Learning Explorer</h1>
                    <p>Navigate the official exam structure down to the microscopic sub-topics!</p>
                </div>
                
                <div className={styles.explorerCard}>
                    {loading ? (
                        <div style={{textAlign: 'center', padding: '2rem'}}>
                            <BrainCircuit className={styles.spinner} size={40} style={{color: '#8b5cf6', animation: 'spin 2s linear infinite'}} />
                            <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>Loading curriculum matrix...</p>
                        </div>
                    ) : hierarchy ? (
                        <TreeNode node={hierarchy} />
                    ) : (
                        <div style={{textAlign: 'center', padding: '3rem 1rem'}}>
                            <Folder size={48} style={{color: 'rgba(255,255,255,0.2)', marginBottom: '1rem'}} />
                            <h3 style={{color: 'var(--text-primary)', marginBottom: '0.5rem'}}>No Curriculum Found</h3>
                            <p style={{color: 'var(--text-secondary)'}}>The syllabus matrix hasn't been initialized yet. Check back once the admin populates the database.</p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudyExplorer;
