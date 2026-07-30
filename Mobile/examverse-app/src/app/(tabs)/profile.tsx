import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
    const { user, logout } = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarText}>{user?.full_name?.charAt(0) || 'U'}</Text>
            </View>
            <Text style={styles.name}>{user?.full_name || 'User'}</Text>
            <Text style={styles.email}>{user?.email || 'email@example.com'}</Text>

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        paddingTop: 80,
    },
    avatarContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    avatarText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#6366f1',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    email: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    logoutButton: {
        marginTop: 40,
        backgroundColor: '#fee2e2',
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 24,
    },
    logoutText: {
        color: '#ef4444',
        fontWeight: '600',
        fontSize: 16,
    },
});
