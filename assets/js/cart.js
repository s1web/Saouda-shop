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

        div.innerHTML=`
            <img src="${item.img}">
            <div class="cart-info">

                <h4>${item.name}</h4>

                <p class="cart-category">

                    ${item.category || ""}

                </p>

                ${
                    item.variant
                    ?

                    `<p class="cart-variant">

                        Taille :
                        <strong>${item.variant}</strong>

                    </p>`

                    :

                    ""
                }

                ${
                    item.color
                    ?

                    `<div class="cart-color">

                        Couleur :

                        <span
                        class="cart-color-dot"
                        style="background:${item.colorCode || '#000'}">
                        </span>

                        <strong>${item.color}</strong>

                    </div>`

                   :

                   ""
                }

                <div class="cart-unit-price">

                    ${item.price} € × ${item.quantity}

                </div>

                <div class="cart-actions">

                    <button onclick="decreaseQty(${index})">

                        −

                    </button>

                    <button onclick="increaseQty(${index})">

                        +

                    </button>

                </div>

            </div>

            <div class="cart-right">

                <div class="price">

                    ${itemTotal.toFixed(2)} €

                </div>

                <button
                class="remove-btn"
                onclick="removeFromCart(${index})">

                    🗑 Supprimer

                </button>

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
