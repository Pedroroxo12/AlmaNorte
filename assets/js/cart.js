// cart.js - Functional Shopping Cart with Database

// Initialize cart and favorites
let cart = [];
let favorites = [];

// Sample products for testing
const sampleProducts = [
    { name: 'MEL DO BÓ', price: '12.50€', image: 'http://localhost/AlmaNorte/assets/images/gallery/MEL.jpeg', quantity: 1 },
    { name: 'Mel de Acácia', price: '15.00€', image: 'http://localhost/AlmaNorte/assets/images/gallery/MEL.jpeg', quantity: 1 }
];

// Function to load cart from server
function loadCart() {
    $.getJSON('./api/load_cart.php', function(data) {
        cart = data;
        updateCartCount();
        if (typeof renderCart === 'function') renderCart();
    }).fail(function() {
        // Fallback to localStorage if server fails
        cart = JSON.parse(localStorage.getItem('almaNorteCart')) || [];
        
        // Add sample products if cart is empty (for testing)
        if (cart.length === 0) {
            cart = JSON.parse(JSON.stringify(sampleProducts));
            localStorage.setItem('almaNorteCart', JSON.stringify(cart));
        }
        
        updateCartCount();
        if (typeof renderCart === 'function') renderCart();
    });
}

// Function to save cart to server
function saveCart() {
    $.ajax({
        url: './api/save_cart.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ cart: cart }),
        success: function() {
            localStorage.setItem('almaNorteCart', JSON.stringify(cart)); // Backup
        }
    });
}

// Function to load favorites from server
function loadFavorites() {
    $.getJSON('./api/load_favorites.php', function(data) {
        favorites = data;
        if (typeof renderFavorites === 'function') renderFavorites();
    }).fail(function() {
        // Fallback
        favorites = JSON.parse(localStorage.getItem('almaNorteFavorites')) || [];
        if (typeof renderFavorites === 'function') renderFavorites();
    });
}

// Function to save favorites to server
function saveFavorites() {
    $.ajax({
        url: './api/save_favorites.php',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ favorites: favorites }),
        success: function() {
            localStorage.setItem('almaNorteFavorites', JSON.stringify(favorites)); // Backup
        }
    });
}

// Function to add item to cart
function addToCart(product) {
    const existing = cart.find(item => item.name === product.name);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }
    saveCart();
    updateCartCount();
    alert(`${product.name} adicionado ao carrinho!`);
}

// Function to remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    renderCart();
}

// Function to update quantity
function updateQuantity(index, quantity) {
    if (quantity <= 0) {
        removeFromCart(index);
    } else {
        cart[index].quantity = quantity;
        saveCart();
        renderCart();
    }
}

// Function to get total price
function getTotal() {
    return cart.reduce((total, item) => total + (parseFloat(item.price.replace('€', '').replace(',', '.')) * item.quantity), 0).toFixed(2);
}

// Function to update cart count in header
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartBadge = document.getElementById('cart-count');
    if (cartBadge) {
        cartBadge.textContent = count;
        cartBadge.style.display = count > 0 ? 'inline' : 'none';
    }
}

// Function to render cart on cart page
function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartTotal = document.getElementById('cart-total');
    if (!cartItems || !cartTotal || !cartSubtotal) return;

    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<tr><td colspan="6">Carrinho vazio</td></tr>';
        cartSubtotal.textContent = '0.00 €';
        cartTotal.textContent = '0.00 €';
        return;
    }

    let subtotal = 0;
    cart.forEach((item, index) => {
        const row = document.createElement('tr');
        const itemPrice = parseFloat(item.price.replace('€', '').replace(',', '.'));
        const itemTotal = (itemPrice * item.quantity).toFixed(2);
        subtotal += itemPrice * item.quantity;
        row.innerHTML = `
            <td data-label="Imagem"><img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover;"></td>
            <td data-label="Nome">${item.name}</td>
            <td data-label="Preço">${item.price}</td>
            <td data-label="Quantidade">
                <input type="number" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)" style="width: 60px;">
            </td>
            <td data-label="Total">${itemTotal}€</td>
            <td data-label="Ação"><button onclick="removeFromCart(${index})" class="btn btn-danger btn-sm">Remover</button></td>
        `;
        cartItems.appendChild(row);
    });
    cartSubtotal.textContent = subtotal.toFixed(2) + ' €';
    cartTotal.textContent = subtotal.toFixed(2) + ' €';
}

// Function to add to favorites
function addToFavorites(product) {
    if (!favorites.find(item => item.name === product.name)) {
        favorites.push(product);
        saveFavorites();
        alert(`${product.name} adicionado aos favoritos!`);
    }
}

// Function to remove from favorites
function removeFromFavorites(index) {
    favorites.splice(index, 1);
    saveFavorites();
    renderFavorites();
}

// Function to render favorites
function renderFavorites() {
    const favoritesList = document.getElementById('favorites-list');
    if (!favoritesList) return;

    favoritesList.innerHTML = '';
    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="text-center">Nenhum favorito ainda.</p>';
        return;
    }

    favorites.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-4 mb-4';
        col.innerHTML = `
            <div class="card">
                <img src="${item.image}" class="card-img-top" alt="${item.name}">
                <div class="card-body">
                    <h5 class="card-title">${item.name}</h5>
                    <p class="card-text">${item.price}</p>
                    <button onclick="addToCart({name: '${item.name}', price: '${item.price}', image: '${item.image}'})" class="btn btn-primary">Adicionar ao Carrinho</button>
                    <button onclick="removeFromFavorites(${index})" class="btn btn-danger btn-sm ms-2">Remover</button>
                </div>
            </div>
        `;
        favoritesList.appendChild(col);
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
    loadFavorites();
});