import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCfRRCrYdrzjrGUqDSlTayTLeSMUnK4IzY",
  authDomain: "irontrack-6b118.firebaseapp.com",
  projectId: "irontrack-6b118",
  storageBucket: "irontrack-6b118.firebasestorage.app",
  messagingSenderId: "340809173107",
  appId: "1:340809173107:web:d193517642199367970206",
  measurementId: "G-TZZLNY9E5S"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const provider = new GoogleAuthProvider();

export { signInWithPopup, signInWithRedirect, onAuthStateChanged, signOut };
