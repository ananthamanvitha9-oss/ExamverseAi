import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import CourseCard from '../components/Dashboard/CourseCard';
import styles from './Dashboard.module.css'; // Reusing dashboard grid styles
import { coursesData } from '../data/courses'; // Importing Dummy Data

const MyCourses = () => {
    // 1. Initialize State to hold our data
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Use Effect to simulate a backend API fetch
    useEffect(() => {
        // Simulate a 500ms network delay to make it feel real
        const timer = setTimeout(() => {
            setCourses(coursesData);
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
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
