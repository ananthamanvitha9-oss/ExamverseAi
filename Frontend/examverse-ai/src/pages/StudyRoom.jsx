import React, { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { useAuth } from '../context/AuthContext';
import styles from './StudyRoom.module.css';
import { database } from '../services/firebase';
import { ref, onValue, push, serverTimestamp } from 'firebase/database';

const StudyRoom = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const chatRef = ref(database, 'global-chat');

    useEffect(() => {
        // Subscribe to Firebase realtime updates
        const unsubscribe = onValue(chatRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert object to array and sort by timestamp
                const formattedMessages = Object.entries(data).map(([key, val]) => ({
                    id: key,
                    ...val
                }));
                // Sort chronologically
                formattedMessages.sort((a, b) => a.timestamp - b.timestamp);
                setMessages(formattedMessages);
            } else {
                setMessages([{ 
                    id: 1, 
                    senderName: "System", 
                    text: "Welcome to the Global Study Room! Ask doubts, share notes, and study together.", 
                    timestamp: Date.now(), 
                    isSystem: true 
                }]);
            }
        });

        return () => unsubscribe();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const currentInput = inputValue;
        setInputValue(''); // Clear immediately for UX

        try {
            await push(chatRef, {
                senderName: user?.full_name?.split(' ')[0] || "Student",
                userId: user?.id || "anonymous",
                text: currentInput,
                timestamp: serverTimestamp(),
                isSystem: false
            });
        } catch (error) {
            console.error("Firebase error", error);
        }
    };

    const formatTime = (ts) => {
        if (!ts) return '';
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const currentUserId = user?.id || "anonymous";

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

                            const isMe = msg.userId === currentUserId;

                            return (
                                <div key={msg.id} className={`${styles.messageWrapper} ${isMe ? styles.myMessage : styles.otherMessage}`}>
                                    {!isMe && <span className={styles.senderName}>{msg.senderName}</span>}
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
