import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import api from '../services/api';
import styles from './AdminDashboard.module.css'; // Reusing dashboard styles for consistency

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'UPSC',
        duration: 60,
        status: 'active'
    });

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await api.get('/admin/courses');
            setCourses(response.data);
        } catch (error) {
            console.error("Failed to fetch courses", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const openModal = (course = null) => {
        if (course) {
            setEditingCourse(course);
            setFormData({
                name: course.name,
                description: course.description || '',
                category: course.category,
                duration: course.duration,
                status: course.status
            });
        } else {
            setEditingCourse(null);
            setFormData({
                name: '',
                description: '',
                category: 'UPSC',
                duration: 60,
                status: 'active'
            });
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingCourse(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingCourse) {
                await api.put(`/admin/courses/${editingCourse.id}`, formData);
            } else {
                await api.post('/admin/courses', formData);
            }
            closeModal();
            fetchCourses();
        } catch (error) {
            console.error("Failed to save course", error);
            alert("Error saving course. Please check the console.");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
            try {
                await api.delete(`/admin/courses/${id}`);
                fetchCourses();
            } catch (error) {
                console.error("Failed to delete course", error);
                alert("Error deleting course.");
            }
        }
    };

    if (loading) return <div className={styles.loading}>Loading Courses...</div>;

    return (
        <div className={styles.coursesContainer} style={{ width: '100%' }}>
            <div className={styles.header} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Course Management</h2>
                <button onClick={() => openModal()} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '10px 20px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
                    <Plus size={18} /> Add New Course
                </button>
            </div>

            <div className={styles.tableCard}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Duration (Mins)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.length > 0 ? (
                            courses.map(course => (
                                <tr key={course.id}>
                                    <td style={{ fontWeight: '500' }}>{course.name}</td>
                                    <td><span style={{ background: 'var(--bg-hover)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px' }}>{course.category}</span></td>
                                    <td>
                                        <span style={{ 
                                            color: course.status === 'active' ? 'var(--success)' : course.status === 'draft' ? 'var(--warning)' : 'var(--error)',
                                            fontWeight: 'bold',
                                            textTransform: 'capitalize'
                                        }}>
                                            {course.status}
                                        </span>
                                    </td>
                                    <td>{course.duration}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button onClick={() => openModal(course)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer' }} title="Edit Course">
                                                <Edit2 size={18} />
                                            </button>
                                            <button onClick={() => handleDelete(course.id)} style={{ background: 'transparent', border: 'none', color: 'var(--error)', cursor: 'pointer' }} title="Delete Course">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No courses found. Create one!</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Course Form Modal */}
            {isModalOpen && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(5px)' }}>
                    <div style={{ background: 'var(--surface)', width: '90%', maxWidth: '500px', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{editingCourse ? 'Edit Course' : 'Create New Course'}</h3>
                            <button onClick={closeModal} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Course Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleInputChange} 
                                    required 
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Description</label>
                                <textarea 
                                    name="description" 
                                    value={formData.description} 
                                    onChange={handleInputChange} 
                                    rows="3"
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                                ></textarea>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Category</label>
                                    <select 
                                        name="category" 
                                        value={formData.category} 
                                        onChange={handleInputChange}
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                                    >
                                        <option value="UPSC">UPSC</option>
                                        <option value="SSC">SSC</option>
                                        <option value="Banking">Banking</option>
                                        <option value="Railways">Railways</option>
                                        <option value="State PSC">State PSC</option>
                                    </select>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Duration (Mins)</label>
                                    <input 
                                        type="number" 
                                        name="duration" 
                                        value={formData.duration} 
                                        onChange={handleInputChange} 
                                        required 
                                        style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)' }}>Status</label>
                                <select 
                                    name="status" 
                                    value={formData.status} 
                                    onChange={handleInputChange}
                                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-primary)', border: '1px solid var(--border-light)', color: 'var(--text-primary)' }}
                                >
                                    <option value="active">Active</option>
                                    <option value="draft">Draft</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '14px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                                {editingCourse ? 'Save Changes' : 'Create Course'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminCourses;
