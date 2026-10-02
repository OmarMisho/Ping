import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG
// Get from: Firebase Console → Project Settings → General → Your Apps → Web App
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
export const db = getFirestore(app);

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};
