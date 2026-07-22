// 🔥 RÉCUPÉRATION PANIER
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");

// 🔥 AFFICHAGE PANIER
function displayCart(){
    if(!cartItemsContainer) return;

    cartItemsContainer.innerHTML="";

    // ✅ PANIER VIDE
    if(cart.length === 0){
        cartItemsContainer.innerHTML="<p>Votre panier est vide 🛒</p>";
        cartTotal.textContent = "0";
        return;
    }

    let total=0;

    cart.forEach((item,index)=>{

        const itemTotal = item.price * item.quantity; // ✅ total produit
        total += itemTotal;

        const div=document.createElement("div");
        div.classList.add("cart-item");

        // ======================================
        // VARIANTES DU PRODUIT
        // ======================================

        let variantsHTML = "";

        if(item.variants && item.variants.length){

            variantsHTML = `

            <div class="cart-variants">

            ${item.variants.map(v=>`

            <div class="cart-variant-card">

                <div class="variant-top">

                    <div class="variant-color-info">

                        <span
                        class="cart-color"
                        style="background:${v.colorCode};">

                        </span>

                        <span class="variant-color-name">

                            ${v.color}

                        </span>

                    </div>

                </div>

                <div class="variant-bottom">

                    <span class="variant-badge">

                        Taille ${v.size}

                    </span>

                    <span class="variant-badge qty-badge">

                        × ${v.quantity}

                    </span>

                </div>

            </div>

            `).join("")}

            </div>

            `;

        }

        div.innerHTML = `

        <div class="cart-card">

            <!-- ========================= -->
            <!-- IMAGE -->
            <!-- ========================= -->

            <div class="cart-image">

                <img src="${item.img}" alt="${item.name}">

            </div>

            <!-- ========================= -->
            <!-- INFORMATIONS -->
            <!-- ========================= -->

            <div class="cart-content">

                <h3 class="cart-title">

                    ${item.name}

                </h3>

                <p class="cart-category">

                    ${item.category || ""}

                </p>

                <!-- Variantes -->

                ${variantsHTML}

                <!-- Prix -->

                <div class="cart-price">

                    ${item.price} €

                </div>

                <!-- Quantité -->

                <div class="cart-qty">

                    <button
                    class="qty-btn"
                    onclick="decreaseQty(${index})">

                        −

                    </button>

                    <span class="qty-value" >

                        ${item.quantity}

                    </span>

                    <button
                    class="qty-btn"
                    onclick="increaseQty(${index})">

                        +

                    </button>

                </div>

                <!-- Supprimer -->

                <button
                class="cart-delete"

                onclick="removeFromCart(${index})">

                    🗑 Supprimer

                </button>

            </div>

        </div>

        `;

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total;
}

// 🔥 AUGMENTER QUANTITÉ
function increaseQty(index){
    cart[index].quantity += 1;
    updateCart();
}

// 🔥 DIMINUER QUANTITÉ
function decreaseQty(index){
    if(cart[index].quantity > 1){
        cart[index].quantity -= 1;
    } else {
        cart.splice(index,1); // supprimer si 0
    }
    updateCart();
}

// 🔥 SUPPRIMER PRODUIT
function removeFromCart(index){
    cart.splice(index,1);
    updateCart();
}

// 🔥 VIDER PANIER (NOUVEAU)
function clearCart(){
    if(confirm("Vider le panier ?")){
        localStorage.removeItem("cart");
        cart=[];
        displayCart();
    }
}

// 🔥 MISE À JOUR
function updateCart(){
    localStorage.setItem("cart", JSON.stringify(cart));
    displayCart();
}

// 🔥 INIT
displayCart();

// 🔥 GLOBAL
window.increaseQty = increaseQty;
window.decreaseQty = decreaseQty;
window.removeFromCart = removeFromCart;
window.clearCart = clearCart;
