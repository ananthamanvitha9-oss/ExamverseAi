import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ 
    title = 'Examverse AI - Your Smart Study Companion', 
    description = 'AI-powered study companion for competitive exams like UPSC, SSC, and JEE. Generate mock tests, study planners, and chat with your AI Tutor.',
    image = 'https://examverse-ai.com/logo512.png',
    url = 'https://examverse-ai.com'
}) => {
    return (
        <Helmet>
            {/* Standard Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />

            {/* OpenGraph / Facebook */}
            <meta property="og:type" content="website" />
            <meta property="og:url" content={url} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={url} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={image} />
        </Helmet>
    );
};

export default SEO;
