import React, { useState, useEffect } from 'react';
import api from '../services/api';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CourseCard from '../components/dashboard/CourseCard';
import { BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Courses.module.css';

const MyCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses');
                
                const formattedCourses = response.data.map(course => ({
                    id: course.id,
                    title: course.name,
                    chapter: course.subjects?.[0]?.chapters?.[0]?.name || 'Introduction',
                    progress: 0, 
                    status: 'Continue'
                }));
                
                setCourses(formattedCourses);
            } catch (error) {
                console.error("Error fetching courses from Laravel API:", error);
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
                    <h1 className={styles.title}>My Learning</h1>
                    <p className={styles.subtitle}>Pick up right where you left off or explore new subjects.</p>
                </div>
                
                {loading ? (
                    <div className={styles.loading}>
                        <div className="spinner" style={{width: '30px', height: '30px', border: '3px solid var(--border-color)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', marginRight: '1rem'}}></div>
                        Loading courses...
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
                                <BookOpen size={48} style={{ color: 'var(--text-muted)' }} />
                                <h3>You haven't enrolled in any courses yet.</h3>
                                <p style={{ marginBottom: '1.5rem' }}>Browse the course catalog to start your learning journey.</p>
                                <Link to="/dashboard/syllabus" className="btn btn-primary">Explore Catalog</Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyCourses;
