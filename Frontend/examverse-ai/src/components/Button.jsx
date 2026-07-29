import React from 'react';
import styles from './Button.module.css';

const Button = ({ children, variant = 'primary', size = 'medium', onClick, type = 'button', className = '' }) => {
    return (
        <button 
            type={type} 
            className={`${styles.btn} ${styles[variant]} ${styles[size]} ${className}`}
            onClick={onClick}
        >
            {children}
        </button>
    );
};

export default Button;
