import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CourseCard from '../components/dashboard/CourseCard';
import styles from './Courses.module.css';

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
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Course Catalog</h1>
                    <p className={styles.subtitle}>Explore all available courses and enroll to start learning.</p>
                </div>
                
                {loading ? (
                    <div className={styles.loading}>
                        <div className="spinner" style={{width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '1rem'}}></div>
                        Loading catalog...
                    </div>
                ) : (
                    <div className={styles.courseGrid}>
                        {courses.length > 0 ? courses.map((course) => (
                            <CourseCard 
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                chapter={course.chapter}
                                progress={course.progress}
                                status={course.status}
                            />
                        )) : (
                            <div className={styles.emptyState}>
                                <h3>No courses available right now.</h3>
                                <p>Check back later for new content!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default Courses;
