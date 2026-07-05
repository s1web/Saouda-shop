// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// Configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCmTuhGASI47tCTM8K0kH4rSqq2UYFGirk",
    authDomain: "commerce-pro-a4164.firebaseapp.com",
    projectId: "commerce-pro-a4164",
    storageBucket: "commerce-pro-a4164.firebasestorage.app",
    messagingSenderId: "831984379293",
    appId: "1:831984379293:web:f4345faa088aa45d32bb74"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
