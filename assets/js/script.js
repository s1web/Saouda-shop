
// 🔥 IMPORT FIREBASE
import { db } from './firebase-config.js';

import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import { buildHomePage } from "./home.js";
// 🔥 VARIABLES
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsContainer = document.getElementById("products");
const cartCount = document.getElementById("cart-count");

// 🔍 NOUVEAUX INPUTS (AJOUT)
const searchInput = document.getElementById("search");
const priceMinInput = document.getElementById("price-min");
const priceMaxInput = document.getElementById("price-max");

let allProducts = [];

// 🔥 CHARGEMENT PRODUITS
async function loadProducts() {
    const querySnapshot = await getDocs(collection(db, "products"));

    allProducts = [];

    querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        allProducts.push({

            id: docItem.id,

            ...data,

            images:data.images || [data.img],

            oldPrice:data.oldPrice || null,

            promo:data.promo || 0,

            badge:data.badge || "",

            stock:data.stock || 0,

            featured:data.featured || false

         });
    });

    buildHomePage(allProducts);
    generateCategories();
}

// 🔥 🔍 RECHERCHE AVANCÉE (NOUVEAU)
function advancedSearch() {

    const searchValue = searchInput.value.toLowerCase();
    const min = parseFloat(priceMinInput.value) || 0;
    const max = parseFloat(priceMaxInput.value) || Infinity;

    const filtered = allProducts.filter(p => {
        const matchText =
            p.name.toLowerCase().includes(searchValue) ||
            p.category.toLowerCase().includes(searchValue);

        const matchPrice = p.price >= min && p.price <= max;

        return matchText && matchPrice;
    });

    buildHomePage(filtered);
}

// 🔥 CATÉGORIES
function generateCategories() {
    const filtersContainer = document.getElementById("filters");

    const categories = [...new Set(allProducts.map(p => p.category))];

    filtersContainer.innerHTML = `<button data-cat="all">Tous</button>`;

    categories.forEach(cat => {
        filtersContainer.innerHTML += `
            <button data-cat="${cat}">${cat}</button>
        `;
    });

    filtersContainer.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("click", () => {
            const category = btn.dataset.cat;
            filterProducts(category);
        });
    });
}

// 🔥 FILTRE CATÉGORIE
function filterProducts(category) {
    if(category==="all"){

        buildHomePage(allProducts);

    }else{

        buildHomePage(

            allProducts.filter(

                p=>p.category===category

            )

        );

    }
}

// 🔥 PANIER PRO (MODIFIÉ : gestion quantité)
function addToCart(id, name, price, img, category) {

    // 🔍 Vérifier si produit déjà dans panier
    const existing = cart.find(item => item.id === id);

    if (existing) {
        existing.quantity += 1; // ✅ incrémenter
    } else {
        cart.push({ id, name, price, img, category, quantity: 1 }); // ✅ ajouter avec quantité
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();

    alert(name + " ajouté au panier !");
}

// 🔥 COMPTEUR
function updateCartCount() {
    if (cartCount) cartCount.textContent = cart.length;
}

// 🔥 INIT
loadProducts();

// 🔥 GLOBAL
window.advancedSearch = advancedSearch;

// ======================================================
// 🔥 AJOUT : MENU MOBILE STYLE JUMIA
// ======================================================

document.addEventListener("DOMContentLoaded", () => {

    // 🔥 Récupération des éléments
    const menuBtn = document.getElementById("menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");
    const overlay = document.getElementById("overlay");

    // Si on n'est pas sur une page avec ce header, on ne fait rien
    if (!menuBtn || !mobileMenu || !overlay) return;

    // ======================================================
    // 🔥 Ouvrir le menu
    // ======================================================
    menuBtn.addEventListener("click", () => {

        mobileMenu.classList.add("open");
        overlay.classList.add("show");

    });

    // ======================================================
    // 🔥 Fermer le menu
    // ======================================================
    function closeMenu() {

        mobileMenu.classList.remove("open");
        overlay.classList.remove("show");

    }

    // Cliquer sur le fond noir
    overlay.addEventListener("click", closeMenu);

    // Touche Échap
    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {

            closeMenu();

        }

    });

});

// recherches sur mobile
const mobileSearchBtn = document.getElementById("mobile-search-btn");

if (mobileSearchBtn) {

    mobileSearchBtn.addEventListener("click", () => {

        const value = document
            .getElementById("mobile-search")
            .value
            .toLowerCase();

        document.getElementById("search").value = value;

        advancedSearch();

    });

}
