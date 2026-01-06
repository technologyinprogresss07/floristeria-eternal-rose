// Admin Credentials
const ADMIN_USER = 'Ysabelkarla64@gmail.com';
const ADMIN_PASSWORD = 'EternalR6446';

// Default Products
const DEFAULT_PRODUCTS = [
    {
        id: 1,
        name: 'Rosa Eterna Individual',
        price: '€45',
        image: 'https://images.unsplash.com/photo-1587371921769-eda287cc0209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcmVzZXJ2ZWQlMjByb3NlcyUyMHBpbmt8ZW58MXx8fHwxNzY2NjkxNTUyfDA&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Rosa preservada en cúpula de cristal'
    },
    {
        id: 2,
        name: 'Bouquet Romántico',
        price: '€89',
        image: 'https://images.unsplash.com/photo-1672243691196-9b7f64cce1c0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwaW5rJTIwcm9zZXMlMjBib3VxdWV0fGVufDF8fHx8MTc2NjY0MDg1OHww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Ramo de rosas eternas en tonos rosa'
    },
    {
        id: 3,
        name: 'Arreglo Premium',
        price: '€120',
        image: 'https://images.unsplash.com/photo-1655034895588-6a74d0c8e7e2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxldGVybmFsJTIwZmxvd2VycyUyMGFycmFuZ2VtZW50fGVufDF8fHx8MTc2NjY5MTU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Arreglo floral eterno en caja elegante'
    },
    {
        id: 4,
        name: 'Jardín Eterno',
        price: '€75',
        image: 'https://images.unsplash.com/photo-1653117243289-34ff9eb237d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkcmllZCUyMGZsb3dlcnMlMjBkZWNvcmF0aW9ufGVufDF8fHx8MTc2NjY5MTU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
        description: 'Composición de flores secas y preservadas'
    }
];

// State
let products = [];
let cart = [];
let favorites = new Set();
let isAdminAuthenticated = false;
let editingProductId = null;

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    loadCart();
    loadFavorites();
    renderProducts();
    updateCartCount();
    initEventListeners();
});

// Load/Save Products
function loadProducts() {
    const saved = localStorage.getItem('eternalrose_products');
    if (saved) {
        try {
            products = JSON.parse(saved);
        } catch (e) {
            products = [...DEFAULT_PRODUCTS];
        }
    } else {
        products = [...DEFAULT_PRODUCTS];
    }
}

function saveProducts() {
    localStorage.setItem('eternalrose_products', JSON.stringify(products));
}

// Load/Save Cart
function loadCart() {
    const saved = localStorage.getItem('eternalrose_cart');
    if (saved) {
        try {
            cart = JSON.parse(saved);
        } catch (e) {
            cart = [];
        }
    }
}

function saveCart() {
    localStorage.setItem('eternalrose_cart', JSON.stringify(cart));
}

// Load/Save Favorites
function loadFavorites() {
    const saved = localStorage.getItem('eternalrose_favorites');
    if (saved) {
        try {
            favorites = new Set(JSON.parse(saved));
        } catch (e) {
            favorites = new Set();
        }
    }
}

function saveFavorites() {
    localStorage.setItem('eternalrose_favorites', JSON.stringify([...favorites]));
}

// Render Products
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    const noProducts = document.getElementById('noProducts');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        noProducts.classList.remove('hidden');
        return;
    }
    
    noProducts.classList.add('hidden');
    grid.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <button class="favorite-btn ${favorites.has(product.id) ? 'active' : ''}" onclick="toggleFavorite(${product.id})">
                    <svg viewBox="0 0 24 24" fill="${favorites.has(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">${product.price}</span>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <path d="M16 10a4 4 0 01-8 0"></path>
                        </svg>
                        <span>Añadir</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Toggle Favorite
function toggleFavorite(productId) {
    if (favorites.has(productId)) {
        favorites.delete(productId);
    } else {
        favorites.add(productId);
    }
    saveFavorites();
    renderProducts();
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Visual feedback
    const buttons = document.querySelectorAll('.add-to-cart-btn');
    buttons.forEach(btn => {
        if (btn.onclick && btn.onclick.toString().includes(productId)) {
            btn.classList.add('added');
            btn.querySelector('span').textContent = '¡Añadido!';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.querySelector('span').textContent = 'Añadir';
            }, 1000);
        }
    });
}

// Update Cart Count
function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countEl = document.getElementById('cartCount');
    if (count > 0) {
        countEl.textContent = count;
        countEl.classList.remove('hidden');
    } else {
        countEl.classList.add('hidden');
    }
}

// Render Cart
function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 01-8 0"></path>
                </svg>
                <p>Tu carrito está vacío</p>
            </div>
        `;
        cartFooter.classList.add('hidden');
        return;
    }
    
    cartFooter.classList.remove('hidden');
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p class="cart-item-price">${item.price}</p>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <span class="quantity-display">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-btn" onclick="removeFromCart(${item.id})">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => {
        const price = parseFloat(item.price.replace('€', ''));
        return sum + (price * item.quantity);
    }, 0);
    
    document.getElementById('cartTotal').textContent = `€${total.toFixed(2)}`;
}

// Update Quantity
function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) return;
    
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity = newQuantity;
        saveCart();
        updateCartCount();
        renderCart();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
}

// Scroll to Section
function scrollToSection(sectionId) {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
}

// Modal Functions
function openCartModal() {
    renderCart();
    document.getElementById('cartModal').classList.add('active');
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
}

function openOrderModal() {
    document.getElementById('orderForm').reset();
    document.getElementById('orderSuccess').classList.add('hidden');
    document.getElementById('orderForm').classList.remove('hidden');
    document.getElementById('orderModal').classList.add('active');
}

function closeOrderModal() {
    document.getElementById('orderModal').classList.remove('active');
}

function openAdminModal() {
    isAdminAuthenticated = false;
    document.getElementById('adminLogin').classList.remove('hidden');
    document.getElementById('adminPanel').classList.add('hidden');
    document.getElementById('adminLoginForm').reset();
    document.getElementById('adminModal').classList.add('active');
}

function closeAdminModal() {
    document.getElementById('adminModal').classList.remove('active');
}

// Admin Functions
function adminLogin(e) {
    e.preventDefault();
    const user = document.getElementById('adminUser').value;
    const password = document.getElementById('adminPassword').value;
    
    if (user === ADMIN_USER && password === ADMIN_PASSWORD) {
        isAdminAuthenticated = true;
        document.getElementById('adminLogin').classList.add('hidden');
        document.getElementById('adminPanel').classList.remove('hidden');
        showProductList();
    } else {
        alert('Usuario o contraseña incorrectos');
        document.getElementById('adminLoginForm').reset();
    }
}

function showProductList() {
    document.getElementById('productListView').classList.remove('hidden');
    document.getElementById('productEditView').classList.add('hidden');
    renderAdminProducts();
}

function showProductEdit(productId = null) {
    editingProductId = productId;
    document.getElementById('productListView').classList.add('hidden');
    document.getElementById('productEditView').classList.remove('hidden');
    
    if (productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('editViewTitle').textContent = 'Editar Producto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productImage').value = product.image;
            document.getElementById('productDescription').value = product.description;
            showImagePreview(product.image);
        }
    } else {
        document.getElementById('editViewTitle').textContent = 'Agregar Producto';
        document.getElementById('productForm').reset();
        document.getElementById('productId').value = '';
        document.getElementById('imagePreview').classList.add('hidden');
    }
}

function renderAdminProducts() {
    const list = document.getElementById('adminProductsList');
    const noProducts = document.getElementById('noAdminProducts');
    const countEl = document.getElementById('productCount');
    
    countEl.textContent = products.length;
    
    if (products.length === 0) {
        list.innerHTML = '';
        noProducts.classList.remove('hidden');
        return;
    }
    
    noProducts.classList.add('hidden');
    list.innerHTML = products.map(product => `
        <div class="admin-product-item">
            <img src="${product.image}" alt="${product.name}">
            <div class="admin-product-info">
                <h4>${product.name}</h4>
                <p class="admin-product-price">${product.price}</p>
                <p class="admin-product-description">${product.description}</p>
            </div>
            <div class="admin-product-actions">
                <button class="btn-edit" onclick="showProductEdit(${product.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                    </svg>
                    Editar
                </button>
                <button class="btn-delete" onclick="deleteProduct(${product.id})">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                    Eliminar
                </button>
            </div>
        </div>
    `).join('');
}

function saveProduct(e) {
    e.preventDefault();
    
    const id = document.getElementById('productId').value;
    const productData = {
        id: id ? parseInt(id) : Date.now(),
        name: document.getElementById('productName').value,
        price: document.getElementById('productPrice').value,
        image: document.getElementById('productImage').value,
        description: document.getElementById('productDescription').value
    };
    
    if (id) {
        const index = products.findIndex(p => p.id === parseInt(id));
        if (index >= 0) {
            products[index] = productData;
        }
    } else {
        products.push(productData);
    }
    
    saveProducts();
    renderProducts();
    showProductList();
}

function deleteProduct(productId) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        products = products.filter(p => p.id !== productId);
        saveProducts();
        renderProducts();
        renderAdminProducts();
    }
}

function showImagePreview(url) {
    const preview = document.getElementById('imagePreview');
    preview.src = url;
    preview.classList.remove('hidden');
}

// Event Listeners
function initEventListeners() {
    // Header
    document.getElementById('cartBtn').addEventListener('click', openCartModal);
    document.getElementById('orderBtn').addEventListener('click', openOrderModal);
    document.getElementById('orderBtnMobile').addEventListener('click', () => {
        document.getElementById('mobileNav').classList.add('hidden');
        openOrderModal();
    });
    document.getElementById('menuBtn').addEventListener('click', () => {
        document.getElementById('mobileNav').classList.toggle('hidden');
    });
    
    // Mobile nav links
    document.querySelectorAll('#mobileNav a').forEach(link => {
        link.addEventListener('click', () => {
            document.getElementById('mobileNav').classList.add('hidden');
        });
    });
    
    // Contact Form
    document.getElementById('contactForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('contactForm').classList.add('hidden');
        document.getElementById('contactSuccess').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('contactSuccess').classList.add('hidden');
            document.getElementById('contactForm').classList.remove('hidden');
            document.getElementById('contactForm').reset();
        }, 3000);
    });
    
    // Newsletter
    document.getElementById('newsletterForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('newsletterForm').classList.add('hidden');
        document.getElementById('newsletterSuccess').classList.remove('hidden');
        setTimeout(() => {
            document.getElementById('newsletterSuccess').classList.add('hidden');
            document.getElementById('newsletterForm').classList.remove('hidden');
            document.getElementById('newsletterForm').reset();
        }, 3000);
    });
    
    // Order Form
    document.getElementById('orderForm').addEventListener('submit', (e) => {
        e.preventDefault();
        document.getElementById('orderForm').classList.add('hidden');
        document.getElementById('orderSuccess').classList.remove('hidden');
        setTimeout(() => {
            closeOrderModal();
        }, 2000);
    });
    
    // Admin
    document.getElementById('adminBtn').addEventListener('click', openAdminModal);
    document.getElementById('adminLoginForm').addEventListener('submit', adminLogin);
    document.getElementById('togglePassword').addEventListener('click', () => {
        const input = document.getElementById('adminPassword');
        const eyeIcon = document.getElementById('eyeIcon');
        const eyeOffIcon = document.getElementById('eyeOffIcon');
        
        if (input.type === 'password') {
            input.type = 'text';
            eyeIcon.classList.add('hidden');
            eyeOffIcon.classList.remove('hidden');
        } else {
            input.type = 'password';
            eyeIcon.classList.remove('hidden');
            eyeOffIcon.classList.add('hidden');
        }
    });
    
    document.getElementById('addProductBtn').addEventListener('click', () => showProductEdit());
    document.getElementById('cancelEditBtn').addEventListener('click', showProductList);
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    
    document.getElementById('productImage').addEventListener('input', (e) => {
        const url = e.target.value;
        if (url) {
            showImagePreview(url);
        }
    });
    
    // Close modals on background click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}
