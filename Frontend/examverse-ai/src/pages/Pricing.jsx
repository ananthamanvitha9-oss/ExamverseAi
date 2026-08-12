import React, { useState } from 'react';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import styles from './Pricing.module.css';
import { Check, Star, Zap } from 'lucide-react';
import api from '../services/api';

const Pricing = () => {
    const [loading, setLoading] = useState(false);

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // 1. Create order on backend
            const orderRes = await api.post('/payment/create-order', { amount: 999 });
            const { order_id, amount, currency, key_id } = orderRes.data;

            // 2. Initialize Razorpay Checkout
            const options = {
                key: key_id,
                amount: amount,
                currency: currency,
                name: 'ExamVerseAI',
                description: 'Upgrade to PRO Subscription',
                image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png', // Dummy logo
                order_id: order_id,
                handler: async function (response) {
                    // 3. Verify payment on backend
                    try {
                        const verifyRes = await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: 999
                        });
                        if (verifyRes.data.success) {
                            alert("Payment Successful! You are now a PRO member.");
                            window.location.href = '/dashboard';
                        }
                    } catch (error) {
                        alert("Payment verification failed.");
                        console.error(error);
                    }
                },
                prefill: {
                    name: 'Student Name', // ideally fetch from user profile
                    email: 'student@example.com',
                    contact: '9999999999'
                },
                theme: {
                    color: '#3b82f6'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed: " + response.error.description);
            });
            rzp.open();
            
        } catch (error) {
            console.error("Error initiating payment", error);
            alert("Could not initialize payment gateway. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Upgrade to ExamVerseAI Pro 🚀</h1>
                    <p>Unlock the full power of AI and ace your competitive exams.</p>
                </div>

                <div className={styles.pricingCards}>
                    {/* Free Plan */}
                    <div className={styles.card}>
                        <h2>Basic</h2>
                        <div className={styles.price}>
                            <span className={styles.currency}>₹</span>0<span className={styles.period}>/forever</span>
                        </div>
                        <p className={styles.desc}>For students just getting started.</p>
                        
                        <ul className={styles.features}>
                            <li><Check size={18} color="#10b981" /> Access to Syllabus Viewer</li>
                            <li><Check size={18} color="#10b981" /> Daily Current Affairs</li>
                            <li><Check size={18} color="#10b981" /> 1 Mock Test per month</li>
                            <li className={styles.disabled}><Check size={18} color="#94a3b8" /> <s>Unlimited AI Tutor Chat</s></li>
                            <li className={styles.disabled}><Check size={18} color="#94a3b8" /> <s>Personalized AI Study Plans</s></li>
                        </ul>
                        
                        <button className={styles.btnSecondary} disabled>Current Plan</button>
                    </div>

                    {/* Pro Plan */}
                    <div className={`${styles.card} ${styles.proCard}`}>
                        <div className={styles.badge}>RECOMMENDED <Star size={14} /></div>
                        <h2>Pro Tier</h2>
                        <div className={styles.price}>
                            <span className={styles.currency}>₹</span>999<span className={styles.period}>/year</span>
                        </div>
                        <p className={styles.desc}>Everything you need to crack the exam.</p>
                        
                        <ul className={styles.features}>
                            <li><Check size={18} color="#3b82f6" /> Access to Syllabus Viewer</li>
                            <li><Check size={18} color="#3b82f6" /> Daily Current Affairs</li>
                            <li><Check size={18} color="#3b82f6" /> <strong>Unlimited</strong> Mock Tests</li>
                            <li><Check size={18} color="#3b82f6" /> <strong>Unlimited</strong> AI Tutor Chat</li>
                            <li><Check size={18} color="#3b82f6" /> <strong>Personalized</strong> AI Study Plans</li>
                            <li><Check size={18} color="#3b82f6" /> Detailed Performance Analytics</li>
                        </ul>
                        
                        <button 
                            className={styles.btnPrimary} 
                            onClick={handleUpgrade}
                            disabled={loading}
                        >
                            {loading ? 'Initializing Secure Payment...' : <><Zap size={18} /> Upgrade Now</>}
                        </button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Pricing;
