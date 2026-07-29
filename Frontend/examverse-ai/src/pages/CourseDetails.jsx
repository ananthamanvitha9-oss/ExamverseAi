import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './CourseDetails.module.css';

const CourseDetails = () => {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch all courses and find the one that matches this ID
        // Note: For a real app, we should add a `GET /api/courses/{id}` route to Laravel
        const fetchCourse = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/courses');
                const selectedCourse = response.data.find(c => c.id === parseInt(id));
                setCourse(selectedCourse);
                
                // Set the first lesson as active by default
                if (selectedCourse?.subjects?.[0]?.chapters?.[0]?.lessons?.[0]) {
                    setActiveLesson(selectedCourse.subjects[0].chapters[0].lessons[0]);
                }
            } catch (error) {
                console.error("Error fetching course details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCourse();
    }, [id]);

    if (loading) return <DashboardLayout><p>Loading curriculum...</p></DashboardLayout>;
    if (!course) return <DashboardLayout><p>Course not found.</p></DashboardLayout>;

    return (
        <DashboardLayout>
            <div className={styles.courseDetailsContainer}>
                {/* Left Side: Video/PDF Player */}
                <div className={styles.contentArea}>
                    {activeLesson ? (
                        <>
                            {activeLesson.video_url ? (
                                <div className={styles.videoWrapper}>
                                    <video src={activeLesson.video_url} controls autoPlay />
                                </div>
                            ) : (
                                <div className={styles.videoWrapper}>
                                    <iframe 
                                        src={activeLesson.pdf_url} 
                                        width="100%" 
                                        height="100%" 
                                        title={activeLesson.name}
                                    />
                                </div>
                            )}
                            <div className={styles.lessonInfo}>
                                <h2 className={styles.lessonTitle}>{activeLesson.name}</h2>
                                <p>Duration: {activeLesson.duration} mins</p>
                            </div>
                        </>
                    ) : (
                        <div className={styles.lessonInfo}>Select a lesson to begin.</div>
                    )}
                </div>

                {/* Right Side: Curriculum Sidebar */}
                <div className={styles.sidebar}>
                    <h3 className={styles.sidebarTitle}>{course.name}</h3>
                    
                    {course.subjects?.map(subject => (
                        <div key={subject.id}>
                            <h4 className={styles.subjectTitle}>{subject.name}</h4>
                            
                            {subject.chapters?.map(chapter => (
                                <div key={chapter.id}>
                                    <h5 className={styles.chapterTitle}>{chapter.name}</h5>
                                    <ul className={styles.lessonList}>
                                        {chapter.lessons?.map(lesson => (
                                            <li 
                                                key={lesson.id} 
                                                className={`${styles.lessonItem} ${activeLesson?.id === lesson.id ? styles.activeLesson : ''}`}
                                                onClick={() => setActiveLesson(lesson)}
                                            >
                                                {lesson.video_url ? '🎥' : '📄'} {lesson.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CourseDetails;
