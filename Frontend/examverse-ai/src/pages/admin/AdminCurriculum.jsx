import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from './AdminCurriculum.module.css';
import { Plus, FolderPlus, Edit, Trash2 } from 'lucide-react';

const AdminCurriculum = () => {
    // This would typically be fetched from your new AdminCurriculumController API
    const [exams, setExams] = useState([
        { id: 1, name: "UPSC Civil Services", subjects: [
            { id: 1, name: "Indian History", units: [
                { id: 1, name: "Ancient India" }
            ]}
        ]}
    ]);

    return (
        <AdminLayout>
            <div className={styles.header}>
                <div>
                    <h1>Curriculum Builder</h1>
                    <p>Manage Exams, Subjects, Units, Chapters, and Topics visually.</p>
                </div>
                <button className={styles.addBtn}><Plus size={20}/> Add New Exam</button>
            </div>

            <div className={styles.builderContainer}>
                {exams.map(exam => (
                    <div key={exam.id} className={styles.examCard}>
                        <div className={styles.nodeHeader}>
                            <h3>📚 {exam.name}</h3>
                            <div className={styles.actions}>
                                <button className={styles.actionBtn}><FolderPlus size={16}/></button>
                                <button className={styles.actionBtn}><Edit size={16}/></button>
                                <button className={styles.deleteBtn}><Trash2 size={16}/></button>
                            </div>
                        </div>

                        <div className={styles.childrenList}>
                            {exam.subjects.map(subject => (
                                <div key={subject.id} className={styles.subjectCard}>
                                    <div className={styles.nodeHeader}>
                                        <h4>📘 {subject.name}</h4>
                                        <div className={styles.actions}>
                                            <button className={styles.actionBtn}><FolderPlus size={16}/></button>
                                            <button className={styles.actionBtn}><Edit size={16}/></button>
                                            <button className={styles.deleteBtn}><Trash2 size={16}/></button>
                                        </div>
                                    </div>

                                    <div className={styles.childrenList}>
                                        {subject.units.map(unit => (
                                            <div key={unit.id} className={styles.unitCard}>
                                                <div className={styles.nodeHeader}>
                                                    <h5>📁 {unit.name}</h5>
                                                    <div className={styles.actions}>
                                                        <button className={styles.actionBtn}><FolderPlus size={16}/></button>
                                                        <button className={styles.actionBtn}><Edit size={16}/></button>
                                                        <button className={styles.deleteBtn}><Trash2 size={16}/></button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
};

export default AdminCurriculum;
