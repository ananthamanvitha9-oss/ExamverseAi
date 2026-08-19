import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage for preference, default to 'system'
    const getInitialTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        return savedTheme ? savedTheme : 'system';
    };

    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        const root = document.documentElement;
        const body = document.body;
        
        const applyTheme = (currentTheme) => {
            const isDark = 
                currentTheme === 'dark' || 
                (currentTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
            
            if (isDark) {
                root.classList.add('dark');
                body.classList.add('dark');
            } else {
                root.classList.remove('dark');
                body.classList.remove('dark');
            }
        };

        applyTheme(theme);
        localStorage.setItem('theme', theme);

        // Listen for system changes if set to system
        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme('system');
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    return useContext(ThemeContext);
};
