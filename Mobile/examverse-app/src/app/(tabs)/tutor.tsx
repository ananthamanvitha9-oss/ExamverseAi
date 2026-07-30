import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../services/api';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Message {
    id: string;
    text: string;
    isUser: boolean;
}

export default function TutorScreen() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm your AI Tutor. What would you like to study today?", isUser: false }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const flatListRef = useRef<FlatList>(null);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const userMsg = inputMessage.trim();
        const newMessage: Message = {
            id: Date.now().toString(),
            text: userMsg,
            isUser: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');
        setLoading(true);

        try {
            const response = await api.post('/chat', { message: userMsg });
            
            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: response.data.reply,
                isUser: false,
            };
            
            setMessages(prev => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat error", error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: "Sorry, I'm having trouble connecting to my brain right now.",
                isUser: false,
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View style={[styles.messageBubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.messageText, item.isUser ? styles.userText : styles.aiText]}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTitleContainer}>
                    <IconSymbol name="sparkles" size={24} color="#6366f1" />
                    <Text style={styles.headerTitle}>AI Tutor</Text>
                </View>
                <Text style={styles.headerStatus}>Always online</Text>
            </View>

            <KeyboardAvoidingView 
                style={styles.keyboardView} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item.id}
                    renderItem={renderMessage}
                    contentContainerStyle={styles.listContainer}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
                />
                
                {loading && (
                    <View style={styles.typingIndicator}>
                        <ActivityIndicator size="small" color="#6366f1" />
                        <Text style={styles.typingText}>AI is thinking...</Text>
                    </View>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={inputMessage}
                        onChangeText={setInputMessage}
                        placeholder="Ask me a question..."
                        placeholderTextColor="#9ca3af"
                        multiline
                        maxLength={500}
                    />
                    <TouchableOpacity 
                        style={[styles.sendButton, !inputMessage.trim() && styles.sendButtonDisabled]} 
                        onPress={sendMessage}
                        disabled={!inputMessage.trim() || loading}
                    >
                        <IconSymbol name="arrow.up.circle.fill" size={32} color={inputMessage.trim() ? "#6366f1" : "#9ca3af"} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 16,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        alignItems: 'center',
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerStatus: {
        fontSize: 12,
        color: '#10b981',
        marginTop: 2,
    },
    keyboardView: {
        flex: 1,
    },
    listContainer: {
        padding: 16,
        gap: 12,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 12,
        borderRadius: 16,
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#6366f1',
        borderBottomRightRadius: 4,
    },
    aiBubble: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 24,
    },
    userText: {
        color: '#ffffff',
    },
    aiText: {
        color: '#1f2937',
    },
    typingIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingBottom: 16,
        gap: 8,
    },
    typingText: {
        color: '#6b7280',
        fontSize: 14,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
        alignItems: 'center',
        gap: 12,
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 12,
        maxHeight: 100,
        fontSize: 16,
        color: '#111827',
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
