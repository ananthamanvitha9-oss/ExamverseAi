import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Brain, Target, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './Hero.module.css';

const Hero = () => {
    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className={styles.heroSection}>
            {/* Animated Background Elements */}
            <div className={styles.bgGlow1}></div>
            <div className={styles.bgGlow2}></div>

            <div className={styles.container}>
                <motion.div 
                    className={styles.textContent}
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className={styles.badge}>
                        <Sparkles size={16} className={styles.badgeIcon} />
                        <span>The Future of Learning is Here</span>
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className={styles.title}>
                        Crack Your <span className={styles.highlight}>Dream Exam</span> With AI
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className={styles.subtitle}>
                        Examverse AI analyzes your weaknesses, generates custom mock tests, and provides an elite voice-enabled AI tutor to guide your preparation for UPSC, SSC, and JEE.
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className={styles.ctaGroup}>
                        <Link to="/register" className={styles.primaryBtn}>
                            Start Learning for Free
                            <ArrowRight size={20} className={styles.btnIcon} />
                        </Link>
                        <Link to="/login" className={styles.secondaryBtn}>
                            See How It Works
                        </Link>
                    </motion.div>

                    <motion.div variants={itemVariants} className={styles.socialProof}>
                        <div className={styles.avatars}>
                            <img src="https://i.pravatar.cc/100?img=1" alt="User 1" />
                            <img src="https://i.pravatar.cc/100?img=2" alt="User 2" />
                            <img src="https://i.pravatar.cc/100?img=3" alt="User 3" />
                            <img src="https://i.pravatar.cc/100?img=4" alt="User 4" />
                        </div>
                        <p>Join <strong>10,000+</strong> students actively preparing</p>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className={styles.visualContent}
                    initial={{ opacity: 0, x: 50, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                >
                    {/* Glassmorphism Dashboard Preview */}
                    <div className={styles.dashboardMock}>
                        <div className={styles.mockHeader}>
                            <div className={styles.dots}><span></span><span></span><span></span></div>
                        </div>
                        
                        <div className={styles.mockBody}>
                            <motion.div 
                                className={styles.featureCard}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Brain className={styles.cardIcon} color="#3b82f6" />
                                <div>
                                    <h4>Multi-Model AI</h4>
                                    <p>Powered by Claude & Llama-3</p>
                                </div>
                            </motion.div>
                            
                            <motion.div 
                                className={styles.featureCard}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Target className={styles.cardIcon} color="#10b981" />
                                <div>
                                    <h4>Custom Mock Tests</h4>
                                    <p>AI generated quizzes on demand</p>
                                </div>
                            </motion.div>

                            <motion.div 
                                className={styles.featureCard}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <ShieldCheck className={styles.cardIcon} color="#8b5cf6" />
                                <div>
                                    <h4>Global Study Room</h4>
                                    <p>Chat with top aspirants live</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default Hero;

export default Hero;
