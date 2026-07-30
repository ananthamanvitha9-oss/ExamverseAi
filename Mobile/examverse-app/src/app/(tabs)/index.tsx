import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { IconSymbol } from '@/components/ui/IconSymbol';

import { Link } from 'expo-router';

export default function DashboardScreen() {
    const { user } = useAuth();
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            const response = await api.get('/exams');
            setExams(response.data);
        } catch (error) {
            console.error("Error fetching exams", error);
        } finally {
            setLoading(false);
        }
    };

    const renderExamItem = ({ item }: { item: any }) => (
        <Link href={`/exam/${item.id}`} asChild>
            <TouchableOpacity style={styles.examCard}>
                <View style={styles.examIconContainer}>
                    <IconSymbol name="doc.text.fill" size={24} color="#6366f1" />
                </View>
                <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{item.topic}</Text>
                    <Text style={styles.examDetails}>Difficulty: {item.difficulty}</Text>
                </View>
                <IconSymbol name="chevron.right" size={20} color="#9ca3af" />
            </TouchableOpacity>
        </Link>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.greeting}>Hello, {user?.full_name?.split(' ')[0] || 'Student'} 👋</Text>
                <Text style={styles.subGreeting}>Ready to conquer your next exam?</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>{exams.length}</Text>
                    <Text style={styles.statLabel}>Total Exams</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statValue}>100%</Text>
                    <Text style={styles.statLabel}>Completion</Text>
                </View>
            </View>

            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recent Exams</Text>
                <TouchableOpacity>
                    <Text style={styles.seeAll}>See All</Text>
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#6366f1" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={exams.slice(0, 5)}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderExamItem}
                    contentContainerStyle={styles.listContainer}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No exams yet. Tap + to create one!</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    header: {
        padding: 24,
        paddingBottom: 16,
    },
    greeting: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
    },
    subGreeting: {
        fontSize: 16,
        color: '#6b7280',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 24,
        gap: 16,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#6366f1',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    statLabel: {
        fontSize: 14,
        color: '#e0e7ff',
        marginTop: 4,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
    },
    seeAll: {
        color: '#6366f1',
        fontWeight: '600',
    },
    listContainer: {
        paddingHorizontal: 24,
        paddingBottom: 24,
    },
    examCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    examIconContainer: {
        width: 48,
        height: 48,
        backgroundColor: '#e0e7ff',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    examInfo: {
        flex: 1,
    },
    examTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        textTransform: 'capitalize',
    },
    examDetails: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 4,
        textTransform: 'capitalize',
    },
    emptyContainer: {
        padding: 24,
        alignItems: 'center',
    },
    emptyText: {
        color: '#6b7280',
        fontSize: 16,
    },
});
