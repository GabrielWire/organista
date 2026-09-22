import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyD-yjkPloG6u5qKllnAkF-yuFQGpqZ6_lc',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'organista-9f4b6.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'organista-9f4b6',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'organista-9f4b6.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '613215318990',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:613215318990:web:67268ae2d92c30fb75319f',
};

// Singleton initialization
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
