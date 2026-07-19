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
const previewMain=document.getElementById("previewMain");
const descInput = document.getElementById("description");
const variantTypeInput = document.getElementById("variantType");

const variantValuesInput = document.getElementById("variantValues");
// ⭐ NOUVEAUX CHAMPS

const oldPriceInput = document.getElementById("oldPrice");

const stockInput = document.getElementById("stock");

const badgeInput = document.getElementById("badge");

const promoInput = document.getElementById("promo");

const featuredInput = document.getElementById("featured");

// ======================================================
// COULEURS
// ======================================================

const colorName = document.getElementById("colorName");
const colorPicker = document.getElementById("colorPicker");
const addColorBtn = document.getElementById("addColor");
const colorsList = document.getElementById("colorsList");

let colors = [];

// 🔥 MODE EDIT
let editId = null;
let allProducts = [];

// ======================================================
// 🔥 GALERIE DYNAMIQUE
// ======================================================

const galleryInputs = document.getElementById("galleryInputs");
const addImageBtn = document.getElementById("addImage");

let galleryCount = 1;

function createGalleryInput(value = "") {

    galleryCount++;

    const wrapper = document.createElement("div");

    wrapper.className = "gallery-item";

    wrapper.innerHTML = `

    <label>Photo n°${galleryCount}</label>

    <div class="gallery-row">

    <input
    type="text"
    class="gallery-image"
    value="${value}"
    placeholder="images/products/photo-${galleryCount}.jpg">

    <button
    type="button"
    class="remove-gallery">

    ❌

    </button>

    </div>

    <div class="preview-box">

    <img
    class="gallery-preview"
    src="">

    </div>

    `;

    wrapper
    .querySelector(".remove-gallery")
    .addEventListener("click", () => {

        wrapper.remove();

    });

    const input = wrapper.querySelector(".gallery-image");

    const preview = wrapper.querySelector(".gallery-preview");

    input.addEventListener("input",()=>{

    preview.src=input.value;

    });

    galleryInputs.appendChild(wrapper);

}

// ======================================================
// AJOUT IMAGE
// ======================================================

if(addImageBtn){

    addImageBtn.addEventListener("click",()=>{

        createGalleryInput();

    });

}

// ======================================================
// PREVIEW
// ======================================================

if(imgInput && previewMain){

    imgInput.addEventListener("input",()=>{

        previewMain.src = imgInput.value;

    });

}

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

// ======================================================
// 🔥 AFFICHAGE DES PRODUITS (STYLE MARKETPLACE)
// ======================================================

function renderProducts(products) {

    productsList.innerHTML = "";

    if(products.length===0){

        productsList.innerHTML="<p>Aucun produit trouvé.</p>";

        return;

    }

    products.forEach((p)=>{

        let stockColor="green";

        if((p.stock||0)<=0){

            stockColor="red";

        }else if((p.stock||0)<5){

            stockColor="orange";

        }

        const div=document.createElement("div");

        div.className="admin-product-card";

        div.innerHTML=`

            <div class="admin-image">

                <img src="${p.img}" alt="${p.name}">

                ${p.badge ? `<span class="badge">${p.badge}</span>` : ""}

                ${p.featured ? `<span class="featured">⭐ Vedette</span>` : ""}

            </div>

            <div class="admin-info">

                <h3>${p.name}</h3>

                <p>${p.category}</p>

                <div class="price-box">

                    ${
                        p.oldPrice
                        ? `<span class="old-price">${p.oldPrice} €</span>`
                        : ""
                    }

                    <span class="price">${p.price} €</span>

                </div>

                <div class="stock ${stockColor}">

                    Stock : ${p.stock ?? 0}

                </div>

                <div class="actions">

                    <button class="edit-btn"
                    onclick="editProduct('${p.id}')">

                    ✏️ Modifier

                    </button>

                    <button class="delete-btn"
                    onclick="deleteProduct('${p.id}')">

                    🗑️ Supprimer

                    </button>

                </div>

            </div>

        `;

        productsList.appendChild(div);

    });

}

// ======================================================
// RECHERCHE
// ======================================================

if(searchInput){

    searchInput.addEventListener("keyup",()=>{

        const value = searchInput.value.toLowerCase();

        const filtered = allProducts.filter(p=>

            p.name.toLowerCase().includes(value)

            ||

            p.category.toLowerCase().includes(value)

        );

        renderProducts(filtered);

    });

}

// ======================================================
// 🔥 AJOUT / MODIFICATION PRODUIT
// ======================================================

async function addOrUpdateProduct() {

    const name = nameInput.value.trim();

    const category = categoryInput.value;

    const price = parseFloat(priceInput.value);

    let img = imgInput.value.trim();

    // Corrige automatiquement les anciens chemins
    img = img.replace("../images/", "images/");
    img = img.replace("./images/", "images/");

    const description = descInput.value.trim();

    // ⭐ NOUVEAUX CHAMPS

    const oldPrice = parseFloat(oldPriceInput.value) || null;

    const stock = parseInt(stockInput.value) || 0;

    const badge = badgeInput.value;

    const promo = parseInt(promoInput.value) || 0;

    const featured = featuredInput.checked;

    if (!name || !category || !price || !img) {

        alert("Veuillez remplir les champs obligatoires.");

        return;

    }

    const variantType = variantTypeInput.value;

    const variantValues = variantValuesInput.value.split(",").map(v=>v.trim()).filter(v=>v!="");

    const productColors = colors;

    // ======================================================
    // 🔥 GALERIE
    // ======================================================

    const images = [];

    let image = input.value.trim();

    image = image.replace("../images/", "images/");
    image = image.replace("./images/", "images/");

    images.push(image);

    document.querySelectorAll(".gallery-image")

    .forEach(input=>{

        if(input.value.trim()!=""){

            images.push(

                input.value.trim()

            );

        }

    });

    const productData = {

        name,

        category,

        price,

        img,

        images,

        description,

        oldPrice,

        stock,

        badge,

        promo,

        featured,

        variantType,

        variantValues,

        colors:productColors,

    };

    try{

        if(editId){

            await updateDoc(

                doc(db,"products",editId),

                productData

            );

            alert("Produit modifié.");

            editId = null;

        }

        else{

            await addDoc(

                productsCollection,

                productData

            );

            alert("Produit ajouté.");

        }

        resetForm();

        displayProducts();

    }

    catch(error){

        console.error(error);

        alert("Erreur Firebase.");

    }

}

// ======================================================
// 🔥 MODIFIER PRODUIT
// ======================================================

function editProduct(id){

    const product = allProducts.find(

        p => p.id === id

    );

    if(!product) return;

    nameInput.value = product.name || "";

    categoryInput.value = product.category || "";

    priceInput.value = product.price || "";

    imgInput.value = product.img || "";

    previewMain.src=product.img  || "";

    // ======================================================
    // 🔥 CHARGER LA GALERIE
    // ======================================================

    galleryInputs.innerHTML="";

    galleryCount=1;

    if(product.images){

        product.images.slice(1)

        .forEach(img=>{

            createGalleryInput(img);

        });

    }

    descInput.value = product.description || "";

    oldPriceInput.value = product.oldPrice || "";

    stockInput.value = product.stock || 0;

    badgeInput.value = product.badge || "";

    promoInput.value = product.promo || "";

    featuredInput.checked = product.featured || false;

    variantTypeInput.value = product.variantType || "";

    variantValuesInput.value = (product.variantValues || []).join(",");

    editId = id;

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

    colors = product.colors || [];

    renderColors();

}

// 🔥 SUPPRIMER
async function deleteProduct(id) {
    if(confirm("Supprimer ce produit ?")){
        await deleteDoc(doc(db, "products", id));
        displayProducts();
    }
}

// ======================================================
// AFFICHER LES COULEURS
// ======================================================

function renderColors(){

    colorsList.innerHTML = "";

    colors.forEach((color,index)=>{

        colorsList.innerHTML += `

        <div class="color-item">

            <span
            class="color-circle"
            style="background:${color.code};">
            </span>

            <span>${color.name}</span>

            <span
            class="delete-color"
            onclick="removeColor(${index})">

            ❌

            </span>

        </div>

        `;

    });

}

// ======================================================
// AJOUTER UNE COULEUR
// ======================================================

function addColor(){

    const name = colorName.value.trim();

    if(name===""){

        alert("Entrez un nom de couleur.");

        return;

    }

    colors.push({

        name:name,

        code:colorPicker.value

    });

    colorName.value="";

    colorPicker.value = "";

    renderColors();

}

// ======================================================
// SUPPRIMER UNE COULEUR
// ======================================================

function removeColor(index){

    colors.splice(index,1);

    renderColors();

}



// ======================================================
// 🔥 RESET
// ======================================================

function resetForm(){

    nameInput.value = "";

    categoryInput.selectedIndex = 0;

    priceInput.value = "";

    imgInput.value = "";

    descInput.value = "";

    oldPriceInput.value = "";

    stockInput.value = 0;

    badgeInput.selectedIndex = 0;

    promoInput.value = "";

    featuredInput.checked = false;

    galleryInputs.innerHTML="";

    galleryCount=1;

    previewMain.src="";

    editId = null;

    variantTypeInput.selectedIndex = 0;

    variantValuesInput.value = "";

    colors = [];

    renderColors();

    colorName.value = "";
    colorPicker.value = "";
}

// 🔥 GLOBAL
window.deleteProduct = deleteProduct;
window.editProduct = editProduct;
window.addOrUpdateProduct = addOrUpdateProduct;

addColorBtn.addEventListener("click",addColor);

window.removeColor=removeColor;

// 🔥 INIT
displayProducts();
