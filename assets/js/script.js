
// 🔥 IMPORT FIREBASE
import { db } from './firebase-config.js';

import { collection, getDocs } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

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
            name: data.name,
            category: data.category,
            price: data.price,
            img: data.img,
            description: data.description || "Pas de description"
        });
    });

    displayProducts(allProducts);
    generateCategories();
}

// 🔥 AFFICHAGE
function displayProducts(products) {
    productsContainer.innerHTML = "";

    if (products.length === 0) {
        productsContainer.innerHTML = "<p>Aucun produit trouvé 😢</p>";
        return;
    }

    products.forEach(product => {
        const card = document.createElement("div");
        card.classList.add("product-card");

        card.innerHTML = `
            <img src="${product.img}" class="product-img">
            <h3>${product.name}</h3>
            <p>${product.category}</p>
            <div class="price">${product.price} €</div>
            <button class="add-btn">Ajouter au panier</button>
        `;

        // 🔥 EVENTS (plus propre)
        card.querySelector(".product-img")
            .addEventListener("click", () => goToProduct(product.id));

        card.querySelector(".add-btn")
            .addEventListener("click", () =>
                addToCart(product.id, product.name, product.price, product.img, product.category)
            );

        productsContainer.appendChild(card);
    });

    updateCartCount();
}

// 🔥 NAVIGATION
function goToProduct(id) {
    window.location.href = `product.html?id=${id}`;
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

    displayProducts(filtered);
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
    if (category === "all") displayProducts(allProducts);
    else displayProducts(allProducts.filter(p => p.category === category));
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
