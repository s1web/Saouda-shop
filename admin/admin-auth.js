// ======================================================
// admin-auth.js
// Sécurisation des pages d'administration
// ======================================================

// ==============================
// IMPORT FIREBASE
// ==============================

import { auth } from "../firebase-config.js";

import {
    onAuthStateChanged
}
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";


// ======================================================
// MODIFICATION
// 👉 Remplace cette adresse par TON adresse administrateur
// ======================================================

const ADMIN_EMAIL = "admin@gmail.com";


// ==============================
// VÉRIFICATION DE CONNEXION
// ==============================

onAuthStateChanged(auth, (user) => {

    // ---------------------------------
    // Aucun utilisateur connecté
    // ---------------------------------

    if (!user) {

        alert("Vous devez vous connecter.");

        window.location.href = "../auth/login.html";

        return;

    }


    // ---------------------------------
    // Utilisateur connecté
    // Vérification administrateur
    // ---------------------------------

    if (user.email !== ADMIN_EMAIL) {

        alert("Accès refusé.");

        window.location.href = "../index.html";

        return;

    }


    // ---------------------------------
    // Administrateur autorisé
    // ---------------------------------

    console.log("✅ Administrateur connecté :", user.email);

});