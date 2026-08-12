import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './AITutor.module.css';
import api from '../services/api';
import { Send, Bot, User, Loader2 } from 'lucide-react';

const AiTutor = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                // Fetching history from the backend
                const response = await api.get('/ai/history');
                const historyData = response.data;
                
                // Format history into our chat array structure
                const formattedMessages = [];
                historyData.forEach(item => {
                    formattedMessages.push({ id: `q-${item.id}`, type: 'user', text: item.prompt });
                    formattedMessages.push({ id: `a-${item.id}`, type: 'bot', text: item.response });
                });
                
                if (formattedMessages.length === 0) {
                    formattedMessages.push({
                        id: 'welcome',
                        type: 'bot',
                        text: 'Hello! I am your ExamVerseAI Tutor. How can I help you prepare for your exams today?'
                    });
                }
                
                setMessages(formattedMessages);
            } catch (error) {
                console.error("Failed to fetch chat history:", error);
                setMessages([{
                    id: 'error-msg',
                    type: 'bot',
                    text: 'Hello! I am your ExamVerseAI Tutor. How can I help you prepare for your exams today?'
                }]);
            }
        };

        fetchHistory();
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setInput('');
        
        // Add user message to UI immediately
        setMessages(prev => [...prev, { id: Date.now().toString(), type: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setTimeout(() => {
                    setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: 'You must be logged in to use the AI Tutor. Please login and try again.' }]);
                    setIsLoading(false);
                }, 1000);
                return;
            }
            const response = await api.post('/ai/chat', { message: userMessage });
            setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: response.data.reply }]);
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { id: Date.now().toString(), type: 'bot', text: 'Sorry, I encountered an error connecting to the brain.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>🤖 AI Tutor</h1>
                    <p>Your personal expert for Indian Competitive Exams</p>
                </div>

                <div className={styles.chatWindow}>
                    <div className={styles.messagesContainer}>
                        {messages.map((msg, index) => (
                            <div key={msg.id || index} className={`${styles.messageWrapper} ${msg.type === 'user' ? styles.userWrapper : styles.botWrapper}`}>
                                {msg.type === 'bot' && (
                                    <div className={styles.avatarBot}>
                                        <Bot size={20} />
                                    </div>
                                )}
                                
                                <div className={`${styles.messageBubble} ${msg.type === 'user' ? styles.userBubble : styles.botBubble}`}>
                                    {/* Handle line breaks correctly */}
                                    {msg.text.split('\\n').map((line, i) => (
                                        <React.Fragment key={i}>
                                            {line}
                                            {i < msg.text.split('\\n').length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </div>

                                {msg.type === 'user' && (
                                    <div className={styles.avatarUser}>
                                        <User size={20} />
                                    </div>
                                )}
                            </div>
                        ))}

                        {isLoading && (
                            <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                                <div className={styles.avatarBot}>
                                    <Bot size={20} />
                                </div>
                                <div className={`${styles.messageBubble} ${styles.botBubble} ${styles.loadingBubble}`}>
                                    <Loader2 className={styles.spinner} size={20} />
                                    <span>Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSend} className={styles.inputArea}>
                        <input 
                            type="text" 
                            className={styles.inputField} 
                            placeholder="Ask me to explain a concept or generate a quiz..." 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                        />
                        <button type="submit" className={styles.sendBtn} disabled={isLoading || !input.trim()}>
                            <Send size={20} />
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AiTutor;
