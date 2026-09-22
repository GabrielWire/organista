import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyDsRoghpf85nWRmoQ33vKWXvgbtxg-W3_M',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'ricci-5f4a6.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'ricci-5f4a6',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'ricci-5f4a6.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '1017354623282',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:1017354623282:web:f2dadd96f87d960b301f2b',
};

// Singleton initialization
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
