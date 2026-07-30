import React from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Examverse AI | Crack UPSC, SSC & JEE with AI</title>
                <meta name="description" content="The ultimate AI-powered study companion. Generate dynamic mock tests, chat with our voice-enabled AI tutor, and join a global study room." />
                <meta property="og:title" content="Examverse AI | The Future of Learning" />
                <meta property="og:description" content="Generate dynamic mock tests, chat with our voice-enabled AI tutor, and join a global study room." />
                <meta property="og:image" content="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop" />
            </Helmet>
            <Navbar />
            <main>
                <Hero />
                <Features />
            </main>
            <Footer />
        </div>
    );
};

export default Home;
