import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "dummy-key",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "dummy-domain.firebaseapp.com",
    databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://dummy-domain.firebaseio.com",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "dummy-project",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "dummy-bucket.appspot.com",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "00000000",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:0000:web:0000"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);

// Initialize Messaging
const messaging = typeof window !== 'undefined' ? getMessaging(app) : null;

export const requestForToken = async () => {
    try {
        if (!messaging) return null;
        const currentToken = await getToken(messaging, { 
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY || 'dummy_vapid_key' 
        });
        if (currentToken) {
            return currentToken;
        } else {
            console.log('No registration token available. Request permission to generate one.');
            return null;
        }
    } catch (err) {
        console.log('An error occurred while retrieving token. ', err);
        return null;
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        if (!messaging) return;
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
