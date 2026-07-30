import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Target, Brain, ArrowUpRight, MessageSquare, Zap } from 'lucide-react';
import styles from './Features.module.css';

const Features = () => {
    const features = [
        {
            icon: <Brain className={styles.icon} />,
            title: "Multi-Model AI Engine",
            description: "Seamlessly switch between Gemini 1.5, Groq Llama-3, and Claude 3.5 for blazing fast or deep reasoning answers."
        },
        {
            icon: <Target className={styles.icon} />,
            title: "Dynamic Mock Tests",
            description: "Generate 100% unique, personalized quizzes on any topic instantly. Includes detailed AI explanations."
        },
        {
            icon: <MessageSquare className={styles.icon} />,
            title: "Voice-Enabled Tutor",
            description: "Don't just read—listen. Our AI tutor uses ElevenLabs technology to explain complex topics in a human-like voice."
        },
        {
            icon: <Zap className={styles.icon} />,
            title: "Global Study Room",
            description: "Connect with thousands of other aspirants in real-time. Share notes, ask doubts, and build a community."
        },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className={styles.featuresSection} id="features">
            <div className={styles.container}>
                <div className={styles.header}>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className={styles.title}
                    >
                        Everything you need to <br/> <span className={styles.highlight}>dominate the exam</span>
                    </motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className={styles.subtitle}
                    >
                        We've replaced outdated video lectures with interactive, AI-driven active recall.
                    </motion.p>
                </div>

                <motion.div 
                    className={styles.grid}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    {features.map((feature, index) => (
                        <motion.div key={index} variants={cardVariants} className={styles.card}>
                            <div className={styles.iconWrapper}>
                                {feature.icon}
                            </div>
                            <h3>{feature.title}</h3>
                            <p>{feature.description}</p>
                            <a href="#" className={styles.learnMore}>
                                Learn more <ArrowUpRight size={16} />
                            </a>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default Features;
