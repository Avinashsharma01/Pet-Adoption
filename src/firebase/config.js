// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAaTItdNwJjW1gTzPBPxFfn3865ok1E6mA",
    authDomain: "pet-adoption-4eafa.firebaseapp.com",
    projectId: "pet-adoption-4eafa",
    storageBucket: "pet-adoption-4eafa.firebasestorage.app",
    messagingSenderId: "230744225417",
    appId: "1:230744225417:web:5cab1f0fee0e8481be3858",
    measurementId: "G-TCR7FQGD42"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };