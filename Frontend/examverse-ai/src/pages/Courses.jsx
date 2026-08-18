import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CourseCard from '../components/dashboard/CourseCard';
import styles from './Dashboard.module.css';

const Courses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                const formattedCourses = response.data.map(course => ({
                    id: course.id,
                    title: course.name,
                    chapter: course.category,
                    progress: 0,
                    status: 'Enroll Now'
                }));
                setCourses(formattedCourses);
            } catch (error) {
                console.error("Error fetching courses", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <DashboardLayout>
            <div>
                <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>Course Catalog</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Explore all available courses and enroll to start learning.</p>
                
                {loading ? (
                    <p>Loading catalog...</p>
                ) : (
                    <div className={styles.courseGrid}>
                        {courses.map((course) => (
                            <CourseCard 
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                chapter={course.chapter}
                                progress={course.progress}
                                status={course.status}
                            />
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Courses;
