import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CourseCard from '../components/dashboard/CourseCard';
import styles from './Dashboard.module.css';

const MyCourses = () => {
    // 1. Initialize State to hold our data
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Fetch data from Laravel API
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                // Connect to the real Laravel backend!
                const response = await axios.get('http://127.0.0.1:8000/api/courses');
                
                // Map the Laravel database structure to our React component's expected props
                const formattedCourses = response.data.map(course => ({
                    id: course.id,
                    title: course.name,
                    // Just grabbing the first chapter of the first subject as a placeholder for current chapter
                    chapter: course.subjects?.[0]?.chapters?.[0]?.name || 'Introduction',
                    progress: 0, // Hardcoded for now until we build student progress tracking
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
            <div>
                <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>My Courses</h2>
                <p style={{ color: '#6b7280', marginBottom: '2rem' }}>Pick up right where you left off or explore new subjects.</p>
                
                {loading ? (
                    <p>Loading courses...</p>
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

export default MyCourses;
