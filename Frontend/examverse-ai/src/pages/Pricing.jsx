import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Check, X, Zap } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../services/api';
import styles from './Pricing.module.css';

const Pricing = () => {
    const handleUpgrade = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login?redirect=/pricing';
            return;
        }

        try {
            // Initiate Razorpay payment
            const res = await api.post('/payment/create-order', {
                amount: 499, // ₹499 for Pro
                currency: 'INR',
                receipt: 'receipt_pro_1'
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            const { order_id, amount, currency } = res.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
                amount: amount.toString(),
                currency: currency,
                name: "Examverse AI",
                description: "Examverse Pro Subscription",
                image: "/logo.png",
                order_id: order_id,
                handler: async function (response) {
                    try {
                        await api.post('/payment/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        alert("Payment successful! You are now a PRO user.");
                        window.location.href = '/dashboard';
                    } catch (err) {
                        alert("Payment verification failed. Contact support.");
                    }
                },
                theme: {
                    color: "#8b5cf6"
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            alert("Error initiating payment. Please try again later.");
        }
    };

    return (
        <div className={styles.pricingPage}>
            <Helmet>
                <title>Pricing | Examverse AI</title>
            </Helmet>

            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Simple, transparent pricing</h1>
                    <p>Invest in your future. Get access to the most powerful AI studying tools on the market.</p>
                </div>

                <div className={styles.pricingCards}>
                    {/* Free Tier */}
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h2>Free</h2>
                            <p>For casual learners</p>
                            <div className={styles.price}>
                                <span className={styles.currency}>₹</span>0<span className={styles.period}>/mo</span>
                            </div>
                        </div>
                        <ul className={styles.featuresList}>
                            <li><Check className={styles.check} /> 3 AI Mock Tests / day</li>
                            <li><Check className={styles.check} /> 3 AI Tutor Questions / day</li>
                            <li><Check className={styles.check} /> 3 AI Study Plans / day</li>
                            <li><Check className={styles.check} /> Global Study Room Access</li>
                            <li><X className={styles.cross} /> Priority Support</li>
                            <li><X className={styles.cross} /> Custom Mock Test Pdfs</li>
                        </ul>
                        <button className={styles.btnSecondary} onClick={() => window.location.href='/register'}>
                            Get Started
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className={`${styles.card} ${styles.proCard}`}>
                        <div className={styles.badge}><Zap size={16}/> MOST POPULAR</div>
                        <div className={styles.cardHeader}>
                            <h2>Examverse Pro</h2>
                            <p>For serious aspirants</p>
                            <div className={styles.price}>
                                <span className={styles.currency}>₹</span>499<span className={styles.period}>/mo</span>
                            </div>
                        </div>
                        <ul className={styles.featuresList}>
                            <li><Check className={styles.proCheck} /> Unlimited AI Mock Tests</li>
                            <li><Check className={styles.proCheck} /> Unlimited AI Tutor Access</li>
                            <li><Check className={styles.proCheck} /> Unlimited AI Study Plans</li>
                            <li><Check className={styles.proCheck} /> Global Study Room Access</li>
                            <li><Check className={styles.proCheck} /> Priority 24/7 Support</li>
                            <li><Check className={styles.proCheck} /> Download Mock Tests as PDF</li>
                        </ul>
                        <button className={styles.btnPrimary} onClick={handleUpgrade}>
                            Upgrade to Pro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
