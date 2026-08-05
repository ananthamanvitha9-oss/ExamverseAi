import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Notes.module.css';
import api from '../services/api';
import { Plus, Trash2, Edit3, Bot, X, Sparkles, Save } from 'lucide-react';
import { toast } from 'react-toastify';

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [lastSaved, setLastSaved] = useState('');
    
    // AI Feature State
    const [showAiModal, setShowAiModal] = useState(false);
    const [selectedText, setSelectedText] = useState('');
    const [aiResponse, setAiResponse] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    const textAreaRef = useRef(null);

    // Load notes from local storage on mount
    useEffect(() => {
        const savedNotes = localStorage.getItem('examverse_notes');
        if (savedNotes) {
            const parsed = JSON.parse(savedNotes);
            setNotes(parsed);
            if (parsed.length > 0) {
                loadNote(parsed[0]);
            }
        } else {
            // Default first note
            handleCreateNote();
        }
    }, []);

    // Save to local storage whenever notes array changes
    useEffect(() => {
        if (notes.length > 0) {
            localStorage.setItem('examverse_notes', JSON.stringify(notes));
        }
    }, [notes]);

    // Auto-save active note content
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (activeNoteId) {
                setNotes(prevNotes => 
                    prevNotes.map(n => 
                        n.id === activeNoteId ? { ...n, title, content, updatedAt: new Date().toISOString() } : n
                    )
                );
                setLastSaved('Saved just now');
            }
        }, 1000);
        return () => clearTimeout(timeoutId);
    }, [title, content, activeNoteId]);

    const handleCreateNote = () => {
        const newNote = {
            id: Date.now().toString(),
            title: 'Untitled Note',
            content: '',
            updatedAt: new Date().toISOString()
        };
        setNotes([newNote, ...notes]);
        loadNote(newNote);
    };

    const loadNote = (note) => {
        setActiveNoteId(note.id);
        setTitle(note.title);
        setContent(note.content);
        setLastSaved('All changes saved');
    };

    const handleDeleteNote = (e, id) => {
        e.stopPropagation();
        const updatedNotes = notes.filter(n => n.id !== id);
        setNotes(updatedNotes);
        
        if (updatedNotes.length === 0) {
            localStorage.removeItem('examverse_notes');
            handleCreateNote();
        } else if (activeNoteId === id) {
            loadNote(updatedNotes[0]);
        }
    };

    const handleTextSelection = () => {
        const text = window.getSelection().toString().trim();
        if (text.length > 5) {
            setSelectedText(text);
        } else {
            setSelectedText('');
        }
    };

    const askAI = async (action) => {
        if (!selectedText) return;
        
        setShowAiModal(true);
        setIsAiLoading(true);
        setAiResponse('');

        const promptMap = {
            'explain': `Explain the following concept simply and clearly, as if I am studying for the UPSC exams: "${selectedText}"`,
            'summarize': `Summarize the following text into 3 bullet points: "${selectedText}"`
        };

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/chat', {
                message: promptMap[action]
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAiResponse(response.data.reply);
        } catch (error) {
            console.error("AI Error", error);
            setAiResponse("Sorry, I encountered an error while trying to process that. Please ensure your API keys are configured and try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                
                {/* Sidebar */}
                <div className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <h2>My Notes</h2>
                        <button className={styles.newNoteBtn} onClick={handleCreateNote}>
                            <Plus size={18} /> New
                        </button>
                    </div>
                    <div className={styles.notesList}>
                        {notes.map(note => (
                            <div 
                                key={note.id} 
                                className={`${styles.noteItem} ${activeNoteId === note.id ? styles.activeNote : ''}`}
                                onClick={() => loadNote(note)}
                            >
                                <div>
                                    <h4>{note.title || 'Untitled Note'}</h4>
                                    <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                                </div>
                                <button className={styles.deleteBtn} onClick={(e) => handleDeleteNote(e, note.id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className={styles.editorArea}>
                    <div className={styles.editorHeader}>
                        <input 
                            type="text" 
                            className={styles.titleInput} 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Note Title..."
                        />
                        <div className={styles.saveStatus}>
                            <Save size={14} /> {lastSaved}
                        </div>
                    </div>

                    <div className={styles.editorContent} onMouseUp={handleTextSelection}>
                        <textarea
                            ref={textAreaRef}
                            className={styles.textArea}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Start typing your notes here... Highlight any text to ask AI for help!"
                        ></textarea>
                    </div>

                    {/* Floating Action Bar when text is selected */}
                    {selectedText && !showAiModal && (
                        <div className={styles.floatingActionBar}>
                            <span>Text Selected ({selectedText.length} chars)</span>
                            <div className={styles.actionButtons}>
                                <button onClick={() => askAI('explain')}><Bot size={16} /> Explain</button>
                                <button onClick={() => askAI('summarize')}><Edit3 size={16} /> Summarize</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* AI Helper Modal */}
                {showAiModal && (
                    <div className={styles.modalOverlay} onClick={() => setShowAiModal(false)}>
                        <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                            <div className={styles.modalHeader}>
                                <h3><Sparkles size={20} className={styles.sparkleIcon}/> AI Tutor Notes Assistant</h3>
                                <button className={styles.closeBtn} onClick={() => setShowAiModal(false)}><X size={20}/></button>
                            </div>
                            
                            <div className={styles.selectedQuote}>
                                "{selectedText.substring(0, 150)}{selectedText.length > 150 ? '...' : ''}"
                            </div>

                            <div className={styles.aiResponseBox}>
                                {isAiLoading ? (
                                    <div className={styles.loadingState}>
                                        <div className={styles.spinner}></div>
                                        <p>Analyzing text...</p>
                                    </div>
                                ) : (
                                    <p className={styles.responseContent}>{aiResponse}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </DashboardLayout>
    );
};

export default Notes;
