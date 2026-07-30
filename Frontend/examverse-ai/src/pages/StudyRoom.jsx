import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './StudyRoom.module.css';

const StudyRoom = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([
        { id: 1, senderName: "System", text: "Welcome to the Global Study Room! Ask doubts, share notes, and study together.", timestamp: new Date().toISOString(), isSystem: true }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Simulate real-time incoming messages for the demo
    useEffect(() => {
        const interval = setInterval(() => {
            const mockUsers = ["Rahul_UPSC", "Priya_SSC", "Amit99", "Neha_IAS"];
            const mockTexts = ["Does anyone have notes for modern history?", "Just finished my mock test!", "Can someone explain the repo rate?", "Good luck everyone for the upcoming exams!"];
            
            if (Math.random() > 0.7) {
                const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
                const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)];
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    senderName: randomUser,
                    text: randomText,
                    timestamp: new Date().toISOString(),
                    isSystem: false
                }]);
            }
        }, 8000); // Check every 8 seconds

        return () => clearInterval(interval);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const newMsg = {
            id: Date.now(),
            senderName: user?.full_name?.split(' ')[0] || "You",
            text: inputValue,
            timestamp: new Date().toISOString(),
            isSystem: false,
            isMe: true
        };

        setMessages(prev => [...prev, newMsg]);
        setInputValue('');
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h2>🌍 Global Study Room</h2>
                    <p>Live discussion with thousands of aspirants.</p>
                </div>

                <div className={styles.chatBox}>
                    <div className={styles.messagesList}>
                        {messages.map((msg) => {
                            if (msg.isSystem) {
                                return (
                                    <div key={msg.id} className={styles.systemMessage}>
                                        <span>{msg.text}</span>
                                    </div>
                                );
                            }

                            return (
                                <div key={msg.id} className={`${styles.messageWrapper} ${msg.isMe ? styles.myMessage : styles.otherMessage}`}>
                                    {!msg.isMe && <span className={styles.senderName}>{msg.senderName}</span>}
                                    <div className={styles.messageBubble}>
                                        {msg.text}
                                        <span className={styles.timestamp}>{formatTime(msg.timestamp)}</span>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className={styles.inputArea}>
                        <input 
                            type="text" 
                            className={styles.input} 
                            placeholder="Type a message to the global room..." 
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                        <button type="submit" className={styles.sendBtn} disabled={!inputValue.trim()}>
                            Send
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default StudyRoom;
