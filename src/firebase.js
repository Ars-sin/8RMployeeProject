import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAsHmmUm1OYYzhFGyLjs8i1QeNEUHph4tU",
  authDomain: "rm-employee-system.firebaseapp.com",
  projectId: "rm-employee-system",
  storageBucket: "rm-employee-system.firebasestorage.app",
  messagingSenderId: "2956601752",
  appId: "1:2956601752:web:86346c1c694b72da87e3ed",
  measurementId: "G-Y15MZB01ST"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
