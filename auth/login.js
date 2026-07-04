import { auth } from '../firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const message = document.getElementById("message");

// 🔥 INSCRIPTION
function signup(){
    const email = emailInput.value;
    const password = passwordInput.value;

    if(!email || !password){
        message.textContent="Merci de remplir tous les champs !";
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
        message.style.color="green";
        message.textContent="Inscription réussie !";
    })
    .catch(error => {
        message.style.color="red";
        message.textContent=error.message;
    });
}

// 🔥 CONNEXION (CORRIGÉ REDIRECTION)
function login(){
    const email = emailInput.value;
    const password = passwordInput.value;

    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
        message.style.color="green";
        message.textContent="Connexion réussie !";

        setTimeout(()=>{
            window.location.href="../index.html"; // ✅ FIX

        },1000);
    })
    .catch(error => {
        message.style.color="red";
        message.textContent=error.message;
    });
}

// 🔥 DÉCONNEXION
function logout(){
    signOut(auth).then(() => {
        message.style.color="green";
        message.textContent="Déconnecté !";
    });
}

// 🔥 RENDRE GLOBAL (TRÈS IMPORTANT)
window.signup = signup;
window.login = login;
window.logout = logout;