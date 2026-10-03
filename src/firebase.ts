import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqmnV9LX8UWseQuZnJ2vEpnBUl35YIttQ",
  authDomain: "safereach-2a838.firebaseapp.com",
  projectId: "safereach-2a838",
  storageBucket: "safereach-2a838.firebasestorage.app",
  messagingSenderId: "483887675543",
  appId: "1:483887675543:web:0b89bdfeb61f31574d11d2",
  measurementId: "G-7JWT28C5F2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Firebase Authentication
export const auth = getAuth(app);

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};

/*
 * Sign in the visitor anonymously.
 *
 * If the browser already has an anonymous Firebase
 * session, Firebase restores it automatically.
 */
export async function signInAnonymousUser(): Promise<User> {
  if (!isFirebaseConfigured()) {
    throw new Error('Firebase is not configured.');
  }

  if (auth.currentUser) {
    return auth.currentUser;
  }

  const result = await signInAnonymously(auth);

  return result.user;
}

/*
 * Get the current Firebase visitor UID.
 */
export function getCurrentUserId(): string | null {
  return auth.currentUser?.uid || null;
}