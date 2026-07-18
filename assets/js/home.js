// ======================================================
// BOUTIQUE FASHION
// HOME.JS
// MODULE 1
// Base professionnelle
// ======================================================

let allProducts = [];

let cart =
JSON.parse(localStorage.getItem("cart")) || [];

// ======================================================
// CONTAINERS
// ======================================================

const productsContainer =
document.getElementById("products");

const filtersContainer =
document.getElementById("filters");

const cartCounter =
document.getElementById("cart-count");

const cartCounterMobile =
document.getElementById("cart-count-mobile");

// ======================================================
// INITIALISATION
// ======================================================

updateCartCounter();

// ======================================================
// FORMAT PRIX
// ======================================================

export function formatPrice(price){

    if(price==null) return "";

    return Number(price).toLocaleString("fr-FR")+" €";

}

// ======================================================
// OUVRIR PAGE PRODUIT
// ======================================================

export function openProduct(id){

    window.location.href="product.html?id="+id;

}

// ======================================================
// AJOUT PANIER
// ======================================================

export function addToCart(product){

    const existing=cart.find(

        p=>p.id===product.id

    );

    if(existing){

        existing.quantity++;

    }

    else{

        cart.push({

            id:product.id,

            name:product.name,

            price:product.price,

            img:product.img,

            category:product.category,

            quantity:1

        });

    }

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    updateCartCounter();

    showToast(

        product.name+" ajouté au panier"

    );

}

// ======================================================
// SUPPRIMER PANIER
// ======================================================

export function removeCart(id){

    cart=cart.filter(

        p=>p.id!==id

    );

    localStorage.setItem(

        "cart",

        JSON.stringify(cart)

    );

    updateCartCounter();

}

// ======================================================
// COMPTEUR PANIER
// ======================================================

export function updateCartCounter(){

    const total=cart.reduce(

        (sum,item)=>sum+item.quantity,

        0

    );

    if(cartCounter){

        cartCounter.textContent=total;

    }

    if(cartCounterMobile){

        cartCounterMobile.textContent=total;

    }

}


// ======================================================
// ETOILES
// ======================================================

export function stars(){

    return `

<div class="stars">

⭐⭐⭐⭐⭐

</div>

`;

}

// ======================================================
// TOAST
// ======================================================

export function showToast(message){

    let toast=document.getElementById("toast");

    if(!toast){

        toast=document.createElement("div");

        toast.id="toast";

        document.body.appendChild(toast);

    }

    toast.textContent=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

// ======================================================
// CARTE PRODUIT PROFESSIONNELLE
// ======================================================

export function createProductCard(product){

    const badge = product.badge
    ? `<span class="product-badge">${product.badge}</span>`
    : "";

    const reduction = promoBadge(product);
    const promo = reduction>0
    ? `<span class="promo-badge">-${reduction}%</span>`
    : "";

    const oldPrice = product.oldPrice
        ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>`
        : "";
    
    const stock = product.stock>0
    ? `<span class="stock in-stock">

        En stock

      </span>`
    : `<span class="stock out-stock">

        Rupture

      </span>`;

    return `

<div class="product-card">

<div class="product-image">

${badge}

${promo}

<img
src="${product.img}"
alt="${product.name}"
onclick="openProduct('${product.id}')">

</div>

<div class="product-content">

<div class="product-category">

${product.category}

</div>

<h3
class="product-title"
onclick="openProduct('${product.id}')">

${product.name}

</h3>

${stars()}

<div class="price-box">

            ${oldPrice}

            <div class="current-price">

                ${formatPrice(product.price)}

            </div>

        </div>

<div class="delivery">

🚚 Livraison disponible

</div>

${stock}

<button
class="cart-button"
onclick='homeAddToCart(${JSON.stringify(product)})'>

🛒 Ajouter au panier

</button>

</div>

</div>

`;

}

// ======================================================
// CALCUL POURCENTAGE
// ======================================================

export function discount(product){

    if(!product.oldPrice) return "";

    const value=Math.round(

        ((product.oldPrice-product.price)

        /product.oldPrice)*100

    );

    return value;

}

// ======================================================
// BADGE PROMO AUTO
// ======================================================

export function promoBadge(product){

    if(product.promo>0){

        return product.promo;

    }

    if(product.oldPrice){

        return discount(product);

    }

    return 0;

}

// ======================================================
// CRÉATION D'UNE SECTION
// ======================================================

export function createSection(title, products, container){

    if(!products.length) return;

    const id = title
        .replace(/[^\w]/g,"")
        .toLowerCase();

    const section = document.createElement("section");

    section.className = "home-section";

    section.innerHTML = `

        <div class="section-header">

            <h2>${title}</h2>

            <a href="#" class="see-all">

                Voir tout >

            </a>

        </div>

        <div class="slider-wrapper">

            <button
                class="slider-btn left"
                data-target="${id}">

                ❮

            </button>

            <div
                id="${id}"
                class="products-slider">

                ${products.map(createProductCard).join("")}

            </div>

            <button
                class="slider-btn right"
                data-target="${id}">

                ❯

            </button>

        </div>

    `;

    container.appendChild(section);

}

// ======================================================
// INITIALISATION DES CARROUSELS
// ======================================================

export function initSliders(){

    document

    .querySelectorAll(".slider-btn")

    .forEach(button=>{

        button.onclick=()=>{

            const slider=document.getElementById(

                button.dataset.target

            );

            if(!slider) return;

            const distance=350;

            slider.scrollBy({

                left:

                button.classList.contains("right")

                ? distance

                : -distance,

                behavior:"smooth"

            });

        };

    });

}

// ======================================================
// CONSTRUCTION DE LA PAGE D'ACCUEIL
// ======================================================

export function buildHomePage(products){

    allProducts = products;

    if(!productsContainer) return;

    productsContainer.innerHTML="";

    // ==========================================
    // PROMOTIONS
    // ==========================================

    createSection(

        "🔥 Promotions",

        products.filter(

            p=>promoBadge(p)>0

        ),

        productsContainer

    );

    // ==========================================
    // NOUVEAUTÉS
    // ==========================================

    createSection(

        "🆕 Nouveautés",

        products.filter(

            p=>p.badge==="Nouveau"

        ),

        productsContainer

    );

    // ==========================================
    // VEDETTES
    // ==========================================

    createSection(

        "⭐ Produits vedettes",

        products.filter(

            p=>p.featured===true

        ),

        productsContainer

    );

    // ==========================================
    // CATÉGORIES
    // ==========================================

    const categories=[

        ...new Set(

            products.map(

                p=>p.category

            )

        )

    ];

    categories.forEach(category=>{

        createSection(

            "🛍 " + category,

            products.filter(

                p=>p.category===category

            ),

            productsContainer

        );

    });

    initSliders();

}

// ======================================================
// RENDRE GLOBAL
// ======================================================

window.openProduct=openProduct;

window.homeAddToCart=addToCart;
