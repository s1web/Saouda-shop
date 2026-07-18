import { db } from '/firebase-config.js';
import { doc, getDoc,collection, addDoc, getDocs, query, orderBy } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

import { createProductCard } from "./home.js";

const container = document.getElementById("product-detail");
const reviewsContainer = document.getElementById("reviews");
const reviewInput = document.getElementById("reviewInput");
const sendReviewBtn = document.getElementById("sendReviewBtn");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const similarContainer =
document.getElementById("similarProducts");

const popularContainer =
document.getElementById("popularProducts");

const recommendedContainer =
document.getElementById("recommendedProducts");

const randomContainer =
document.getElementById("randomProducts");

const historyContainer =
document.getElementById("historyProducts");


let selectedColorCode = null;
let selectedColor = null;

async function loadProduct() {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const p = docSnap.data();

        const gallery = document.getElementById("galleryImages");
        const mainImage = document.getElementById("mainProductImage");
        mainImage.src = p.img;
        gallery.innerHTML = "";
        const images = p.images || [p.img];
        images.forEach(image=>{
            const thumb=document.createElement("img");
            thumb.src=image;
            thumb.className="thumb";
            thumb.addEventListener("click",()=>{
                mainImage.src=image;

            });

            gallery.appendChild(thumb);
        
        });

        container.querySelector("#productInfo").innerHTML=`
        ${p.badge ? `<div class="product-badge">${p.badge}</div>` : ""}
        
        <h1>${p.name}</h1>

        <div class="stars">

            ⭐⭐⭐⭐⭐
            <span>(0 avis)</span>

        </div>

        <div class="prices">
            ${
            p.oldPrice
            ?
            `<span class="old-price">${p.oldPrice} €</span>`
            :
            ""
            }

            <span class="new-price">
                ${p.price} €
            </span>

        </div>

        <p class="stock">
            ${
            (p.stock||0)>0

            ?

            "✅ En stock"

            :

            "❌ Rupture"
            }

        </p>

        <p class="delivery">

            🚚 Livraison estimée :

            2 à 5 jours

        </p>

        <div id="sizeSelector"></div>

        <div id="variantContainer"></div>
        <!-- ====================================================== -->
        <!-- COULEURS -->
        <!-- ====================================================== -->

        <div id="colorsContainer" class="product-colors"></div>

        <div class="buy-buttons">

        <button id="addBtn">

           Ajouter au panier

        </button>

        <button id="buyNow">

           Acheter maintenant

        </button>

        </div>

        <div class="description">

        <h3>Description</h3>

        <p>${p.description}</p>

        </div>

        `;

        buildVariants(p);

        buildColors(p);

         // 🔥 ICI on ajoute l'événement (IMPORTANT)
        document.getElementById("addBtn").addEventListener("click", () => {

            let selectedVariant = null;

            const active =
            document.querySelector(".variant-btn.selected");

            if(p.variantType){

                if(!active){

                    alert("Veuillez choisir une option.");

                    return;

                }

                selectedVariant =
                active.dataset.value;

            }

            if(p.colors && p.colors.length>0){

                if(!selectedColor){

                    alert("Veuillez choisir une couleur.");

                    return;

                }

            }

            addToCart({
                id: id,
                name: p.name,
                price: p.price,
                img: p.img,
                category: p.category,
                variant:selectedVariant,
                color:selectedColor,
                colorCode:selectedColorCode,
            });
        });

        buildRecommendations(p);
    }

    let history=

    JSON.parse(

    localStorage.getItem("historyProducts")

    )||[];

    history.unshift(id);

    history=[...new Set(history)];

    history=history.slice(0,15);

    localStorage.setItem(

    "historyProducts",

    JSON.stringify(history)

    );
}

function buildVariants(product){

    const container =
    document.getElementById("variantContainer");

    if(!container) return;

    if(
        !product.variantType ||
        !product.variantValues ||
        product.variantValues.length===0
    ){

        container.innerHTML="";

        return;

    }

    let title="";

    switch(product.variantType){

        case "size":
            title="Choisissez votre taille";
            break;

        case "shoe":
            title="Choisissez votre pointure";
            break;

        case "dimension":
            title="Choisissez la dimension";
            break;

        default:
            title="Choisissez une option";

    }

    container.innerHTML=`

<h3>${title}</h3>

<div class="variant-list">

${product.variantValues.map(value=>`

<button
class="variant-btn"
data-value="${value}">

${value}

</button>

`).join("")}

</div>

`;

    container
    .querySelectorAll(".variant-btn")
    .forEach(btn=>{

        btn.onclick=()=>{

            document
            .querySelectorAll(".variant-btn")
            .forEach(b=>b.classList.remove("selected"));

            btn.classList.add("selected");

        };

    });

}

function addToCart(product) {

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find(item =>

        item.id===product.id &&

        item.variant===product.variant &&

        item.color===product.color

    );

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Produit ajouté au panier !");
}

async function buildRecommendations(currentProduct){

    const snap=await getDocs(collection(db,"products"));

    let products=[];

    snap.forEach(doc=>{

        products.push({

            id:doc.id,

            ...doc.data()

        });

    });



    // similaires

    const similarProducts = products.filter(p =>

        p.category === currentProduct.category &&

        p.id !== id

    );

    similarContainer.innerHTML =

    similarProducts

    .slice(0,8)

    .map(createProductCard)

    .join("");

    if(similarProducts.length===0){

        document
        .getElementById("similarSection")
        .style.display="none";

    }

    // populaires

   const popularProducts=

   [...products]

   .sort((a,b)=>

   (b.stock||0)-(a.stock||0)

   );

   popularContainer.innerHTML=

   popularProducts

   .slice(0,8)

   .map(createProductCard)

   .join("");

    // recommandés

    const recommended = products.filter(p =>

        p.category === currentProduct.category &&

        p.id !== id &&

        Math.abs(

            (p.price||0) -

            (currentProduct.price||0)

        ) <= 30

    );

    recommendedContainer.innerHTML=

    recommended

    .slice(0,8)

    .map(createProductCard)
    .join("");

    // aléatoires

    const suggestions=

    products.filter(p=>

    p.id!==id

    );

    suggestions.sort(

    ()=>Math.random()-0.5

    );

    randomContainer.innerHTML=

    suggestions

    .slice(0,8)

    .map(createProductCard)

    .join("");

    // ======================================================
    // HISTORIQUE
    // ======================================================

    const history =

    JSON.parse(

    localStorage.getItem("historyProducts")

    )||[];

    const historyProducts=

    history

    .map(historyId=>

    products.find(

    p=>p.id===historyId

    )

    )

    .filter(Boolean)

    .filter(p=>p.id!==id);

    historyContainer.innerHTML=

    historyProducts

    .slice(0,8)

    .map(createProductCard)

    .join("");

}

//======================================================
// COULEURS
//======================================================

function buildColors(product){

    const colorsContainer =
    document.getElementById("colorsContainer");

    if(!colorsContainer) return;

    // Si le produit n'a pas de couleurs
    if (!product.colors || product.colors.length === 0) {
        colorsContainer.innerHTML = "";
        return;
    }

    colorsContainer.innerHTML=`

    <h3>Couleur</h3>

    <div class="colors-grid">

    ${product.colors.map(color=>`

        <div

        class="color-option"

        data-name="${color.name}"

        style="background:${color.code};"

        title="${color.name}">

        </div>

    `).join("")}

    </div>

    `;

    const options=

    colorsContainer.querySelectorAll(

        ".color-option"

    );

    options.forEach(option=>{

        option.addEventListener(

            "click",

            ()=>{

                options.forEach(

                    c=>c.classList.remove(

                        "selected"

                    )

                );

                option.classList.add(

                    "selected"

                );

                selectedColor=
                option.dataset.name;

                selectedColorCode =
                option.style.background;

            }

        );

    });

}

// ==============================
// ⭐ AVIS CLIENTS
// ==============================
async function addReview() {

    const text = reviewInput.value;

    if (!text) {
        alert("Écris un avis !");
        return;
    }

    await addDoc(collection(db, "reviews"), {
        productId: id,
        text: text,
        date: new Date()
    });

    reviewInput.value = "";
    loadReviews();
}

// 🔥 bouton avis
sendReviewBtn.addEventListener("click", addReview);

// 🔥 CHARGER AVIS
async function loadReviews() {

    reviewsContainer.innerHTML = "";

    const q = query(collection(db, "reviews"), orderBy("date", "desc"));
    const snap = await getDocs(q);

    snap.forEach(docItem => {

        const r = docItem.data();

        if (r.productId === id) {

            const div = document.createElement("div");
            div.classList.add("cart-item");

            div.innerHTML = `<p>💬 ${r.text}</p>`;

            reviewsContainer.appendChild(div);
        }
    });
}

document

.querySelectorAll(".slide-left")

.forEach(btn=>{

btn.onclick=()=>{

const slider=

document.getElementById(

btn.dataset.target

);

slider.scrollBy({

left:-700,

behavior:"smooth"

});

};

});

document

.querySelectorAll(".slide-right")

.forEach(btn=>{

btn.onclick=()=>{

const slider=

document.getElementById(

btn.dataset.target

);

slider.scrollBy({

left:700,

behavior:"smooth"

});

};

});

loadProduct();
loadReviews();