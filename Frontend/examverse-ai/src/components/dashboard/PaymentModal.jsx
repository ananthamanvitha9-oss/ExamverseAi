import React, { useState } from 'react';
import styles from './PaymentModal.module.css';
import api from '../../services/api';

const PaymentModal = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handlePayment = async (amount, planName) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const authConfig = { headers: { Authorization: `Bearer ${token}` } };
            
            // 1. Create Order on Backend
            const { data } = await api.post('/payment/create-order', {
                amount: amount,
                type: planName
            }, authConfig);

            // 2. Load Razorpay Script
            const res = await loadRazorpayScript();
            if (!res) {
                alert('Razorpay SDK failed to load. Are you online?');
                setLoading(false);
                return;
            }

            // 3. Configure Razorpay
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
                amount: data.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                currency: data.currency,
                name: "Examverse AI",
                description: `Upgrade to ${planName}`,
                image: "https://example.com/your_logo",
                order_id: data.order_id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                handler: async function (response) {
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, authConfig);
                        alert(verifyRes.data.message);
                        onClose();
                    } catch (err) {
                        alert("Payment Verification Failed!");
                    }
                },
                prefill: {
                    name: "Examverse Student",
                    email: "student@example.com",
                    contact: "9999999999"
                },
                notes: {
                    address: "Examverse AI Head Office"
                },
                theme: {
                    color: "#3b82f6"
                }
            };
            
            const paymentObject = new window.Razorpay(options);
            paymentObject.on('payment.failed', function (response){
                alert(response.error.description);
            });
            paymentObject.open();

        } catch (error) {
            console.error("Payment initiation failed", error);
            alert("Error initiating payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeBtn} onClick={onClose}>×</button>
                <div className={styles.header}>
                    <h2>Unlock Premium AI Power 👑</h2>
                    <p>Get unlimited access to AI Tutor, personalized mock tests, and advanced analytics.</p>
                </div>
                
                <div className={styles.plans}>
                    <div className={styles.planCard}>
                        <h3>Pro Monthly</h3>
                        <div className={styles.price}>₹499<span>/month</span></div>
                        <ul className={styles.features}>
                            <li>✅ Unlimited AI Tutor Chat</li>
                            <li>✅ Custom Mock Tests</li>
                            <li>✅ Performance Analytics</li>
                        </ul>
                        <button 
                            className={styles.payBtn} 
                            disabled={loading}
                            onClick={() => handlePayment(499, 'monthly')}
                        >
                            {loading ? 'Processing...' : 'Subscribe Monthly'}
                        </button>
                    </div>

                    <div className={`${styles.planCard} ${styles.popular}`}>
                        <div className={styles.badge}>Most Popular</div>
                        <h3>Pro Yearly</h3>
                        <div className={styles.price}>₹3999<span>/year</span></div>
                        <ul className={styles.features}>
                            <li>✅ Everything in Monthly</li>
                            <li>✅ Priority Voice AI Access</li>
                            <li>✅ Offline Notes Download</li>
                        </ul>
                        <button 
                            className={styles.payBtn} 
                            disabled={loading}
                            onClick={() => handlePayment(3999, 'yearly')}
                        >
                            {loading ? 'Processing...' : 'Subscribe Yearly'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

export default PaymentModal;
