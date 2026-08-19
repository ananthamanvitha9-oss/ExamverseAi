import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ChevronRight, GraduationCap } from 'lucide-react';
import styles from './CourseCard.module.css';

const CourseCard = ({ id, title, chapter, progress, status = "Continue" }) => {
    const getInitials = (text) => {
        return text.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <div className={`card card-hover ${styles.courseCard}`}>
            <div className={styles.cardHeader}>
                <div className={styles.iconWrapper}>
                    <GraduationCap size={24} className={styles.icon} />
                </div>
                {progress > 0 && <span className={styles.progressBadge}>{progress}% Complete</span>}
            </div>
            
            <div className={styles.cardBody}>
                <h4 className={styles.title}>{title}</h4>
                <div className={styles.chapterInfo}>
                    <BookOpen size={14} className={styles.chapterIcon} />
                    <span>{chapter || 'General'}</span>
                </div>
            </div>

            <div className={styles.cardFooter}>
                <div className={styles.progressBar}>
                    <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
                </div>
                <Link to={`/dashboard/courses/${id}`} className={styles.actionBtn}>
                    {status} <ChevronRight size={16} />
                </Link>
            </div>
        </div>
    );
};

export default CourseCard;
