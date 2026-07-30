import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ExamsScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>All Exams</Text>
            <Text style={styles.subtitle}>Feature coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    subtitle: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 8,
    },
});
