// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDqDDbKqBpAPkcdqWLwx7lzmI-epk7TFvk",
    authDomain: "boutique-fashion-4.firebaseapp.com",
    projectId: "boutique-fashion-4",
    storageBucket: "boutique-fashion-4.firebasestorage.app",
    messagingSenderId: "97186557316",
    appId: "1:97186557316:web:2a24215be7ba31a31041d1"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
