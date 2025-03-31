// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDivsUWtNBDjSlo7dKqSzcJeVz-GmsOCRg",
  authDomain: "stylish-d9f4f.firebaseapp.com",
  projectId: "stylish-d9f4f",
  storageBucket: "stylish-d9f4f.firebasestorage.app",
  messagingSenderId: "594142675816",
  appId: "1:594142675816:web:f73973b96a4c552be3ccdd",
  measurementId: "G-ZMVV5XQZMN",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();
export { auth };
export const db = getFirestore(app);
