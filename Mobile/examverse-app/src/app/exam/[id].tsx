import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../../services/api';

export default function ExamScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    
    const [exam, setExam] = useState<any>(null);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchExamDetails();
    }, [id]);

    const fetchExamDetails = async () => {
        try {
            const response = await api.get(`/exams/${id}`);
            setExam(response.data.exam);
            setQuestions(response.data.questions);
        } catch (error) {
            console.error("Failed to load exam", error);
            Alert.alert("Error", "Could not load exam details.");
            router.back();
        } finally {
            setLoading(false);
        }
    };

    const handleSelectOption = (option: string) => {
        const currentQuestion = questions[currentQuestionIndex];
        setAnswers({
            ...answers,
            [currentQuestion.id]: option
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        // Validate all answered
        if (Object.keys(answers).length < questions.length) {
            Alert.alert("Incomplete", "Please answer all questions before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            const formattedAnswers = Object.keys(answers).map(questionId => ({
                question_id: parseInt(questionId),
                selected_option: answers[parseInt(questionId)]
            }));

            const response = await api.post(`/exams/${id}/submit`, {
                answers: formattedAnswers
            });
            
            Alert.alert(
                "Exam Complete!",
                `You scored ${response.data.score}/${response.data.total_questions}`,
                [{ text: "OK", onPress: () => router.back() }]
            );
        } catch (error) {
            console.error("Submit error", error);
            Alert.alert("Error", "Failed to submit exam.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={styles.loadingText}>Loading Mock Test...</Text>
            </SafeAreaView>
        );
    }

    if (!exam || questions.length === 0) return null;

    const currentQuestion = questions[currentQuestionIndex];
    const options = ['option_a', 'option_b', 'option_c', 'option_d'];
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Cancel</Text>
                </TouchableOpacity>
                <View style={styles.progressContainer}>
                    <Text style={styles.progressText}>Question {currentQuestionIndex + 1} of {questions.length}</Text>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }]} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.questionCard}>
                    <Text style={styles.questionText}>{currentQuestion.question_text}</Text>
                </View>

                <View style={styles.optionsContainer}>
                    {options.map((opt, index) => {
                        const optionValue = currentQuestion[opt];
                        const isSelected = answers[currentQuestion.id] === optionValue;
                        
                        return (
                            <TouchableOpacity 
                                key={index} 
                                style={[styles.optionButton, isSelected && styles.selectedOption]}
                                onPress={() => handleSelectOption(optionValue)}
                            >
                                <View style={[styles.optionLabelContainer, isSelected && styles.selectedLabelContainer]}>
                                    <Text style={[styles.optionLabelText, isSelected && styles.selectedLabelText]}>
                                        {optionLabels[index]}
                                    </Text>
                                </View>
                                <Text style={[styles.optionText, isSelected && styles.selectedOptionText]}>
                                    {optionValue}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity 
                    style={[styles.navButton, currentQuestionIndex === 0 && styles.disabledButton]} 
                    onPress={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                >
                    <Text style={[styles.navText, currentQuestionIndex === 0 && styles.disabledText]}>Previous</Text>
                </TouchableOpacity>

                {currentQuestionIndex === questions.length - 1 ? (
                    <TouchableOpacity 
                        style={styles.submitButton} 
                        onPress={handleSubmit}
                        disabled={submitting}
                    >
                        {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Exam</Text>}
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.navButtonPrimary} onPress={handleNext}>
                        <Text style={styles.navTextPrimary}>Next</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
    },
    loadingText: {
        marginTop: 16,
        color: '#6b7280',
        fontSize: 16,
    },
    header: {
        padding: 20,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
    },
    backButton: {
        marginBottom: 16,
    },
    backText: {
        color: '#ef4444',
        fontSize: 16,
        fontWeight: '600',
    },
    progressContainer: {
        gap: 8,
    },
    progressText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    progressBarBg: {
        height: 6,
        backgroundColor: '#e5e7eb',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6366f1',
    },
    content: {
        flex: 1,
        padding: 20,
    },
    questionCard: {
        backgroundColor: '#ffffff',
        padding: 24,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    questionText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        lineHeight: 28,
    },
    optionsContainer: {
        gap: 16,
        paddingBottom: 40,
    },
    optionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#f3f4f6',
    },
    selectedOption: {
        borderColor: '#6366f1',
        backgroundColor: '#e0e7ff',
    },
    optionLabelContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    selectedLabelContainer: {
        backgroundColor: '#6366f1',
    },
    optionLabelText: {
        fontWeight: 'bold',
        color: '#6b7280',
    },
    selectedLabelText: {
        color: '#ffffff',
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        color: '#374151',
    },
    selectedOptionText: {
        color: '#111827',
        fontWeight: '600',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: '#ffffff',
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    navButton: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
    },
    disabledButton: {
        opacity: 0.5,
    },
    navText: {
        color: '#4b5563',
        fontWeight: '600',
        fontSize: 16,
    },
    disabledText: {
        color: '#9ca3af',
    },
    navButtonPrimary: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor: '#6366f1',
    },
    navTextPrimary: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
    submitButton: {
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor: '#10b981',
    },
    submitText: {
        color: '#ffffff',
        fontWeight: '600',
        fontSize: 16,
    },
});
