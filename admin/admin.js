import { db } from '../firebase-config.js';

import { 
    collection, getDocs, addDoc, deleteDoc, doc, updateDoc 
} from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// 🔥 COLLECTION
const productsCollection = collection(db, "products");

const productsList = document.getElementById("products-list");
const searchInput = document.getElementById("search-admin");

// 🔥 INPUTS
const nameInput = document.getElementById("name");
const categoryInput = document.getElementById("category");
const priceInput = document.getElementById("price");
const imgInput = document.getElementById("img");
const descInput = document.getElementById("description");

// 🔥 MODE EDIT
let editId = null;
let allProducts = [];

// 🔥 AFFICHER PRODUITS
async function displayProducts() {
    productsList.innerHTML = "";

    const querySnapshot = await getDocs(productsCollection);

    allProducts = [];

    querySnapshot.forEach((docItem) => {
        const data = docItem.data();

        const product = {
            id: docItem.id,
            ...data
        };

        allProducts.push(product);
    });

    renderProducts(allProducts);
}

// 🔥 AFFICHAGE HTML
function renderProducts(products) {
    productsList.innerHTML = "";

    products.forEach((p) => {

        const div = document.createElement("div");

        div.classList.add("cart-item"); // réutilisation style

        div.innerHTML = `
            <img src="${p.img}">
            <div>
                <h4>${p.name}</h4>
                <p>${p.category}</p>
                <div>${p.price} €</div>
            </div>

            <!-- 🔥 ACTIONS -->
            <div>
                <button onclick="editProduct('${p.id}')">Modifier</button>
                <button onclick="deleteProduct('${p.id}')">Supprimer</button>
            </div>
        `;

        productsList.appendChild(div);
    });
}

// 🔍 RECHERCHE ADMIN (NOUVEAU)
searchInput.addEventListener("keyup", () => {

    const value = searchInput.value.toLowerCase();

    const filtered = allProducts.filter(p =>
        p.name.toLowerCase().includes(value) ||
        p.category.toLowerCase().includes(value)
    );

    renderProducts(filtered);
});

// 🔥 AJOUT / MODIFICATION
async function addOrUpdateProduct() {

    const name = nameInput.value;
    const category = categoryInput.value;
    const price = parseFloat(priceInput.value);
    const img = imgInput.value;
    const description = descInput.value;

    if (!name || !category || !price || !img) {
        alert("Remplis tous les champs !");
        return;
    }

    if (editId) {
        // 🔥 UPDATE
        await updateDoc(doc(db, "products", editId), {
            name, category, price, img, description
        });

        alert("Produit modifié !");
        editId = null;

    } else {
        // 🔥 AJOUT
        await addDoc(productsCollection, {
            name, category, price, img, description
        });

        alert("Produit ajouté !");
    }

    resetForm();
    displayProducts();
}

// 🔥 REMPLIR FORMULAIRE (EDIT)
function editProduct(id) {

    const product = allProducts.find(p => p.id === id);

    nameInput.value = product.name;
    categoryInput.value = product.category;
    priceInput.value = product.price;
    imgInput.value = product.img;
    descInput.value = product.description;

    editId = id;
}

// 🔥 SUPPRIMER
async function deleteProduct(id) {
    if(confirm("Supprimer ce produit ?")){
        await deleteDoc(doc(db, "products", id));
        displayProducts();
    }
}

// 🔥 RESET FORM
function resetForm(){
    nameInput.value = "";
    categoryInput.value = "";
    priceInput.value = "";
    imgInput.value = "";
    descInput.value = "";
}

// 🔥 GLOBAL
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.addOrUpdateProduct = addOrUpdateProduct;

// 🔥 INIT
displayProducts();