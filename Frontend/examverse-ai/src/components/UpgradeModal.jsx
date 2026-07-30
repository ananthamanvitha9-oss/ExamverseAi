import React, { useEffect } from 'react';
import styles from './UpgradeModal.module.css';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UpgradeModal = ({ isOpen, onClose, title = "Daily Limit Reached!" }) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleUpgradeClick = () => {
        onClose();
        navigate('/pricing');
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <button className={styles.closeBtn} onClick={onClose}>
                    <X size={24} />
                </button>
                
                <div className={styles.iconContainer}>
                    <Sparkles size={40} className={styles.sparkleIcon} />
                </div>
                
                <h2>{title}</h2>
                <p className={styles.subtitle}>
                    You've hit your free tier limit. Upgrade to Examverse Pro to unlock unlimited AI power.
                </p>

                <div className={styles.features}>
                    <div className={styles.featureItem}>
                        <CheckCircle2 size={20} className={styles.checkIcon} />
                        <span>Unlimited AI Mock Tests</span>
                    </div>
                    <div className={styles.featureItem}>
                        <CheckCircle2 size={20} className={styles.checkIcon} />
                        <span>Unlimited Study Plans</span>
                    </div>
                    <div className={styles.featureItem}>
                        <CheckCircle2 size={20} className={styles.checkIcon} />
                        <span>Advanced Analytics</span>
                    </div>
                </div>

                <button className={styles.upgradeBtn} onClick={handleUpgradeClick}>
                    View Pro Plans
                </button>
            </div>
        </div>
    );
};

export default UpgradeModal;
