
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCgPvfma-_s9A7wxTzKQ-nAq6tHL2Nwj4Y",
  authDomain: "realtime-vocal-harmony.firebaseapp.com",
  projectId: "realtime-vocal-harmony",
  storageBucket: "realtime-vocal-harmony.appspot.com",
  messagingSenderId: "52980812745",
  appId: "1:52980812745:web:0d19f53093e28c8d6db618"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const database = getDatabase(app);
const auth = getAuth(app);

export { app, firestore, database, auth };
