// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "mern-market-64685.firebaseapp.com",
    projectId: "mern-market-64685",
    storageBucket: "mern-market-64685.appspot.com",
    messagingSenderId: "610705197870",
    appId: "1:610705197870:web:3e912e85080d9dec9ac8bf"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);