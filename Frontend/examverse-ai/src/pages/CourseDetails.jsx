import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { BookOpen, Clock, Award, PlayCircle, Lock } from 'lucide-react';
import styles from './CourseDetails.module.css';

const CourseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeLesson, setActiveLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                // Connect to the real Python backend
                const response = await api.get(`/courses/${id}`);
                setCourse(response.data);
                
                // Set the first lesson as active by default if it exists
                if (response.data?.subjects?.[0]?.chapters?.[0]?.name) {
                    setActiveLesson({
                        id: 1, 
                        title: response.data.subjects[0].chapters[0].name, 
                        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" 
                    });
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
                                    <ReactPlayer 
                                        url={activeLesson.video_url} 
                                        width="100%" 
                                        height="100%" 
                                        controls={true} 
                                        playing={true}
                                    />
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
