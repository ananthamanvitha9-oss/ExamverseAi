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
    if (node.stages) { children = node.stages; badgeText = 'Exam'; }
    else if (node.papers) { children = node.papers; badgeText = 'Stage'; }
    else if (node.subjects) { children = node.subjects; badgeText = 'Paper'; }
    else if (node.topics) { children = node.topics; badgeText = 'Subject'; }
    else if (node.subtopics) { children = node.subtopics; badgeText = 'Topic'; }
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
    const [exams, setExams] = useState([]);
    const [selectedExamId, setSelectedExamId] = useState(null);
    const [hierarchy, setHierarchy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [hierarchyLoading, setHierarchyLoading] = useState(false);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await api.get('/exams');
                setExams(response.data);
                if (response.data.length > 0) {
                    setSelectedExamId(response.data[0].id);
                }
            } catch (error) {
                console.error("Failed to fetch exams", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExams();
    }, []);

    useEffect(() => {
        if (!selectedExamId) return;

        const fetchHierarchy = async () => {
            setHierarchyLoading(true);
            try {
                const response = await api.get(`/hierarchy/${selectedExamId}`);
                setHierarchy(response.data);
            } catch (error) {
                console.error("Failed to fetch hierarchy", error);
                setHierarchy(null);
            } finally {
                setHierarchyLoading(false);
            }
        };

        fetchHierarchy();
    }, [selectedExamId]);

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
                    ) : (
                        <>
                            <div style={{marginBottom: '1.5rem'}}>
                                <label style={{marginRight: '1rem', fontWeight: 'bold'}}>Select Exam:</label>
                                <select 
                                    style={{padding: '0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1'}}
                                    value={selectedExamId || ''} 
                                    onChange={(e) => setSelectedExamId(e.target.value)}
                                >
                                    {exams.map(exam => (
                                        <option key={exam.id} value={exam.id}>{exam.name}</option>
                                    ))}
                                </select>
                            </div>

                            {hierarchyLoading ? (
                                <div style={{textAlign: 'center', padding: '2rem'}}>
                                    <BrainCircuit className={styles.spinner} size={40} style={{color: '#8b5cf6', animation: 'spin 2s linear infinite'}} />
                                    <p style={{marginTop: '1rem', color: 'var(--text-secondary)'}}>Loading curriculum matrix...</p>
                                </div>
                            ) : hierarchy ? (
                                <TreeNode node={hierarchy} />
                            ) : (
                                <div style={{textAlign: 'center', padding: '3rem 1rem'}}>
                                    <p>No Curriculum Found for this Exam.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudyExplorer;
