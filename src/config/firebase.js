import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDsHGM6uEUR1xb-G3QLvTo5r1LSzKvi5gE", // À remplacer par votre clé
  authDomain: "s2-formation-pwa.firebaseapp.com",
  projectId: "s2-formation-pwa",
  storageBucket: "s2-formation-pwa.appspot.com",
  messagingSenderId: "987072224384",
  appId: "1:987072224384:web:ae8f84df779e73b1e41a65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore
export const db = getFirestore(app);

// Storage
export const storage = getStorage(app);

export default app;
