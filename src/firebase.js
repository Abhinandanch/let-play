import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyB-DBdxn5mwLyu96aThoobK-le2fly6POs",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "let-s-play-96cc0.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "let-s-play-96cc0",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "let-s-play-96cc0.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "593560493743",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:593560493743:web:663a7b83d95e15fdc77e5a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-H5NSM1VB7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// In teeno ko sirf EK-EK baar export karein
export const auth = getAuth(app); 
export const db = getFirestore(app);
export const storage = getStorage(app); 

export default app;
