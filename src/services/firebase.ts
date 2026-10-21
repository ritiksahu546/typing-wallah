import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  Firestore
} from 'firebase/firestore';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Suppress internal @firebase/firestore console.error spam when client operates in offline fallback mode
try {
  setLogLevel('silent');
} catch {
  // ignore
}

// Configuration from generated applet config with optional Vite env override
const env = (import.meta as { env?: Record<string, string | undefined> }).env || {};

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || firebaseAppletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || firebaseAppletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || firebaseAppletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || firebaseAppletConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseAppletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || firebaseAppletConfig.appId,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);

// Initialize Firestore: use custom database ID from config/env with long-polling auto-detection for iframe/proxy resilience
const databaseId =
  env.VITE_FIREBASE_FIRESTORE_DATABASE_ID ||
  firebaseAppletConfig.firestoreDatabaseId;

let firestoreInstance: Firestore;
try {
  firestoreInstance = initializeFirestore(
    app,
    { experimentalAutoDetectLongPolling: true },
    databaseId
  );
} catch {
  firestoreInstance = getFirestore(app, databaseId);
}

export const db = firestoreInstance;

/**
 * Wraps a Firestore operation with a fast timeout so offline/slow connections
 * immediately fall back to local storage without blocking the UI.
 */
export function withFirestoreTimeout<T>(promise: Promise<T>, timeoutMs: number = 3500): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Firestore operation timed out (operating in offline mode)'));
    }, timeoutMs);

    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

export default app;

