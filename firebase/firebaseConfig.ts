// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCE0t0Y5qdIvLrPejQjwOFh2Pz3blZymcA",
  authDomain: "stylish-e26cd.firebaseapp.com",
  projectId: "stylish-e26cd",
  storageBucket: "stylish-e26cd.firebasestorage.app",
  messagingSenderId: "527712290787",
  appId: "1:527712290787:web:dfd5826e23a2e34ca8c2d6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
export { auth };
export const db = getFirestore(app);
