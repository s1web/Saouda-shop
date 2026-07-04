// 🔥 TON NUMÉRO (FORMAT INTERNATIONAL)
const PHONE = "2694456911"; // 🔴 mets ton numéro ici

let cartWA = JSON.parse(localStorage.getItem("cart")) || [];

let message = "🛍️ Bonjour, je souhaite commander :\n\n";

cartWA.forEach(item => {
    message += `${item.name} x${item.quantity} - ${item.price}€\n`;
});

// 🔥 ENCODER MESSAGE
const url = `https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`;

// 🔥 LIEN BOUTON
const btn = document.getElementById("whatsappBtn");
if(btn) btn.href = url;