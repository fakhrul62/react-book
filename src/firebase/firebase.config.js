// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDhXiX8-lAqdHPuJwZ7jsaQoaXucB-KAr4",
  authDomain: "react-book-45cef.firebaseapp.com",
  projectId: "react-book-45cef",
  storageBucket: "react-book-45cef.appspot.com",
  messagingSenderId: "773344268117",
  appId: "1:773344268117:web:a12f2424a06292f64469dc",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export default auth;

