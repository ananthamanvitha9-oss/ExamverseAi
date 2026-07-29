import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './AITutor.module.css';

const AITutor = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const suggestions = [
        "Explain Fundamental Rights.",
        "Explain GDP.",
        "Create Quiz."
    ];

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        
        // Add user message to UI
        const newMsg = { text: inputValue, sender: 'user' };
        setMessages([...messages, newMsg]);
        setInputValue('');
        
        // Note: AI backend connection will happen in a future sprint!
    };

    return (
        <DashboardLayout>
            <div className={styles.tutorContainer}>
                
                {/* Left Sidebar: Chat History */}
                <div className={styles.historyPanel}>
                    <div className={styles.historyHeader}>
                        <h3>Chat History</h3>
                        <button className={styles.newChatBtn}>+ New Chat</button>
                    </div>
                    <div className={styles.historyList}>
                        <div className={styles.historyItem}>Explain Fundamental Rights</div>
                        <div className={styles.historyItem}>Trigonometry formulas</div>
                        <div className={styles.historyItem}>Indus Valley Civilization</div>
                    </div>
                </div>

                {/* Right Area: Main Chat UI */}
                <div className={styles.chatArea}>
                    <div className={styles.chatMessages}>
                        
                        {/* Empty State / Suggestions */}
                        {messages.length === 0 && (
                            <div className={styles.emptyState}>
                                <h2>Hello, {user?.full_name?.split(' ')[0] || 'Student'} 👋</h2>
                                <p>I am your AI Tutor. Ask me anything!</p>
                                <div className={styles.suggestions}>
                                    {suggestions.map((text, idx) => (
                                        <button 
                                            key={idx} 
                                            className={styles.suggestionChip}
                                            onClick={() => setInputValue(text)}
                                        >
                                            {text}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Render actual chat bubbles */}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`${styles.messageRow} ${styles[msg.sender]}`}>
                                <div className={`${styles.chatBubble} ${styles[msg.sender]}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className={styles.inputArea}>
                        <form className={styles.inputWrapper} onSubmit={handleSend}>
                            <input 
                                type="text" 
                                className={styles.chatInput} 
                                placeholder="Ask a question..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                            <button type="submit" className={styles.sendBtn}>
                                ↗
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
};

export default AITutor;
