import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyB-DBdxn5mwLyu96aThoobK-le2fly6POs",
  authDomain: "let-s-play-96cc0.firebaseapp.com",
  projectId: "let-s-play-96cc0",
  storageBucket: "let-s-play-96cc0.firebasestorage.app",
  messagingSenderId: "593560493743",
  appId: "1:593560493743:web:663a7b83d95e15fdc77e5a",
  measurementId: "G-H5NSM1VB7L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// In teeno ko sirf EK-EK baar export karein
export const auth = getAuth(app); 
export const db = getFirestore(app);
export const storage = getStorage(app); 

export default app;
