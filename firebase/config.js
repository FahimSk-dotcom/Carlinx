// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFG2Fjxs1OE346erCdVaM3-MFHjNAZPxA",
  authDomain: "carlinx-86dd0.firebaseapp.com",
  projectId: "carlinx-86dd0",
  storageBucket: "carlinx-86dd0.firebasestorage.app",
  messagingSenderId: "1012129786633",
  appId: "1:1012129786633:web:45d10f356fc8e07ee101d8",
  measurementId: "G-J6L039EDB1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);