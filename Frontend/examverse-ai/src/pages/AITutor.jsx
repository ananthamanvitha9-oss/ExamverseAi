import React, { useState, useRef, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './AITutor.module.css';
import api from '../services/api';
import UpgradeModal from '../components/UpgradeModal';

const AITutor = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [selectedModel, setSelectedModel] = useState('gemini');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const suggestions = [
        "Explain Fundamental Rights.",
        "Explain GDP.",
        "Create Quiz."
    ];

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputValue.trim()) return;
        
        const userText = inputValue;
        const newMsg = { text: userText, sender: 'user' };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await api.post('/chat', {
                message: userText,
                model: selectedModel,
                voice: isVoiceMode
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const aiReply = response.data.reply;
            const audioData = response.data.audio;

            setMessages(prev => [...prev, { 
                text: aiReply, 
                sender: 'ai',
                audio: audioData 
            }]);

            if (audioData) {
                const audio = new Audio(audioData);
                audio.play();
            }

        } catch (error) {
            console.error("AI Chat Error", error);
            if (error.response && error.response.status === 402) {
                setShowUpgradeModal(true);
            } else {
                setMessages(prev => [...prev, { text: "Sorry, I am having trouble connecting to the server.", sender: 'ai' }]);
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <DashboardLayout>
            <UpgradeModal 
                isOpen={showUpgradeModal} 
                onClose={() => setShowUpgradeModal(false)} 
                title="AI Tutor Limit Reached"
            />
            <div className={styles.tutorContainer}>
                
                {/* Left Sidebar: Chat History */}
                <div className={styles.historyPanel}>
                    <div className={styles.historyHeader}>
                        <h3>Chat History</h3>
                        <button className={styles.newChatBtn}>+ New Chat</button>
                    </div>
                    <div className={styles.historyList}>
                        <div className={styles.historyItem}>Explain Fundamental Rights</div>
                    </div>
                </div>

                {/* Right Area: Main Chat UI */}
                <div className={styles.chatArea}>
                    <div className={styles.chatHeader}>
                        <div className={styles.modelSelector}>
                            <select 
                                value={selectedModel} 
                                onChange={(e) => setSelectedModel(e.target.value)}
                                className={styles.modelDropdown}
                            >
                                <option value="gemini">Gemini 1.5 (Standard)</option>
                                <option value="groq">Llama-3 70B (Groq - Fast)</option>
                                <option value="openrouter">Claude 3.5 (Pro Reasoning)</option>
                            </select>
                        </div>
                        <div className={styles.voiceToggle}>
                            <span>Voice Mode</span>
                            <label className={styles.switch}>
                                <input 
                                    type="checkbox" 
                                    checked={isVoiceMode} 
                                    onChange={(e) => setIsVoiceMode(e.target.checked)} 
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>

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
                            <div key={idx} className={`${styles.messageRow} ${msg.sender === 'user' ? styles.userRow : styles.aiRow}`}>
                                <div className={`${styles.messageBubble} ${msg.sender === 'user' ? styles.userMessage : styles.aiMessage}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`${styles.messageRow} ${styles.aiRow}`}>
                                <div className={`${styles.messageBubble} ${styles.aiMessage}`}>
                                    <div className={styles.loadingBubble}>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                        <span className={styles.dot}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className={styles.inputArea}>
                        <input 
                            type="text" 
                            className={styles.chatInput} 
                            placeholder="Ask a question about UPSC, SSC, or general knowledge..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            disabled={isLoading}
                        />
                        <button 
                            className={styles.sendButton} 
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                        >
                            {isLoading ? '...' : 'Send'}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AITutor;
