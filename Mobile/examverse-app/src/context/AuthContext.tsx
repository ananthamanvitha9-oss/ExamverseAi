import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import api from '../services/api';

interface AuthContextType {
    user: any | null;
    token: string | null;
    login: (token: string, userData: any) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<any | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const storedToken = await SecureStore.getItemAsync('token');
                const storedUser = await SecureStore.getItemAsync('user');
                
                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                }
            } catch (error) {
                console.error("Failed to load auth state", error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (newToken: string, userData: any) => {
        try {
            await SecureStore.setItemAsync('token', newToken);
            await SecureStore.setItemAsync('user', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
            router.replace('/(tabs)');
        } catch (error) {
            console.error("Error storing auth data", error);
        }
    };

    const logout = async () => {
        try {
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('user');
            setToken(null);
            setUser(null);
            router.replace('/(auth)/login');
        } catch (error) {
            console.error("Error removing auth data", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
