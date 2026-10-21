import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuration from Vite environment variables with fallback to generated applet config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyAM5HiICl57RcdcOAT3nSvxj4pn6J-GlIM",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "typingwallah-9e75b.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "typingwallah-9e75b",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "typingwallah-9e75b.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "397913050132",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:397913050132:web:3bad6821bd162679096b01",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore: use custom database ID from config/env
const databaseId =
  import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  "ai-studio-typingwallah-9f6ed824-1543-4d7b-b7a9-f0977f151110";

export const db = getFirestore(app, databaseId);

export default app;
