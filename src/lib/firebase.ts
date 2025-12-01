import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getAnalytics, Analytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Check if Firebase credentials are configured
const isFirebaseConfigured = firebaseConfig.apiKey && firebaseConfig.projectId;

if (!isFirebaseConfigured) {
  console.warn('Firebase credentials not configured. Authentication features will be disabled.');
}

// Initialize Firebase only if credentials are available
const app = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;

// Initialize Firebase Authentication and get a reference to the service
export const auth = app ? getAuth(app) : null;

// Google Auth Provider
export const googleProvider = app ? new GoogleAuthProvider() : null;

// Initialize Analytics (only in browser environment)
let analytics: Analytics | null = null;
if (app && typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
