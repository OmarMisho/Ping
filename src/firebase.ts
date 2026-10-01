import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// ⚠️ REPLACE THESE WITH YOUR ACTUAL FIREBASE CONFIG
// Get from: Firebase Console → Project Settings → General → Your Apps → Web App
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "saferch-app.firebaseapp.com",
  projectId: "saferch-app",
  storageBucket: "saferch-app.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return firebaseConfig.apiKey !== "YOUR_API_KEY";
};
