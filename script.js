/* ============================================================
   Fresh Bite by Raptor – Main JavaScript
   Handles: Products, Cart, Wishlist, Search, Checkout, Modals
   ============================================================ */

// ---------- PRODUCT DATA ----------
const products = [
  { id: 1, name: 'Whole Wheat Bread', category: 'breads', price: 45, unit: 'per loaf', image: 'images/bread.jpg', tag: 'Best Seller', dietary: 'eggless', rating: 4.8 },
  { id: 2, name: 'Garlic Buns', category: 'buns', price: 25, unit: 'per piece', image: 'images/bun.jpg', tag: 'New', dietary: 'eggful', rating: 4.5 },
  { id: 3, name: 'Chocolate Chip Cookies', category: 'cookies', price: 120, unit: 'box of 6', image: 'images/cookies.jpg', tag: 'Popular', dietary: 'eggful', rating: 4.9 },
  { id: 4, name: 'Butter Croissant', category: 'pastries', price: 60, unit: 'per piece', image: 'images/croissant.jpg', tag: '', dietary: 'eggful', rating: 4.7 },
  { id: 5, name: 'Red Velvet Cake', category: 'cakes', price: 550, unit: 'per kg', image: 'images/red-velvet.jpg', tag: 'Best Seller', dietary: 'eggless', rating: 4.9 },
  { id: 6, name: 'Vanilla Cream Roll', category: 'cream-rolls', price: 40, unit: 'per piece', image: 'images/cream-roll.jpg', tag: '', dietary: 'eggful', rating: 4.4 },
  { id: 7, name: 'Blueberry Muffin', category: 'muffins', price: 70, unit: 'per piece', image: 'images/muffin.jpg', tag: 'New', dietary: 'eggless', rating: 4.6 },
  { id: 8, name: 'Strawberry Cupcake', category: 'cupcakes', price: 85, unit: 'per piece', image: 'images/cupcake.jpg', tag: 'Seasonal', dietary: 'eggful', rating: 4.7 },
  { id: 9, name: 'Plum Cake (Slice)', category: 'plum-cake', price: 90, unit: 'per slice', image: 'images/plum-cake.jpg', tag: 'Festive', dietary: 'eggful', rating: 4.8 },
  { id: 10, name: 'Sourdough Loaf', category: 'breads', price: 70, unit: 'per loaf', image: 'images/sourdough.jpg', tag: 'Artisan', dietary: 'eggless', rating: 4.9 },
  { id: 11, name: 'Cinnamon Bun', category: 'buns', price: 35, unit: 'per piece', image: 'images/cinnamon-bun.jpg', tag: '', dietary: 'eggful', rating: 4.3 },
  { id: 12, name: 'Oatmeal Raisin Cookies', category: 'cookies', price: 110, unit: 'box of 6', image: 'images/oatmeal-cookies.jpg', tag: '', dietary: 'eggless', rating: 4.2 },
  { id: 13, name: 'Chocolate Éclair', category: 'pastries', price: 75, unit: 'per piece', image: 'images/eclair.jpg', tag: '', dietary: 'eggful', rating: 4.6 },
  { id: 14, name: 'Pineapple Cake', category: 'cakes', price: 480, unit: 'per kg', image: 'images/pineapple-cake.jpg', tag: '', dietary: 'eggless', rating: 4.5 },
  { id: 15, name: 'Choco Chip Muffin', category: 'muffins', price: 75, unit: 'per piece', image: 'images/choco-muffin.jpg', tag: 'Popular', dietary: 'eggful', rating: 4.7 },
];

// ---------- DOM REFERENCES ----------
const productGrid = document.getElementById('productGrid');
const categoryStrip = document.querySelector('.category-strip');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const subtotalEl = document.getElementById('subtotal');
const deliveryEl = document.getElementById('deliveryCharge');
const totalEl = document.getElementById('totalPrice');
const cartBadge = document.getElementById('cartBadge');
const wishlistBadge = document.getElementById('wishlistBadge');
const wishlistSidebar = document.getElementById('wishlistSidebar');
const wishlistOverlay = document.getElementById('wishlistOverlay');
const wishlistItems = document.getElementById('wishlistItems');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutOverlay = document.getElementById('checkoutOverlay');
const cakeModal = document.getElementById('cakeModal');
const cakeOverlay = document.getElementById('cakeOverlay');
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const priceLabel = document.getElementById('priceLabel');
const clearFiltersBtn = document.getElementById('clearFilters');
const searchBar = document.getElementById('searchBar');

// ---------- CART ----------
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  // Badge
  const count = cart.reduce((sum, item) => sum + item.qty, 0);
  cartBadge.textContent = count;
  // Sidebar items
  renderCartItems();
  // Totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const delivery = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;
  const total = subtotal + delivery;
  subtotalEl.textContent = `₹${subtotal}`;
  deliveryEl.textContent = `₹${delivery}`;
  totalEl.textContent = `₹${total}`;
}

function renderCartItems() {
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="color: var(--fb-text-muted);">Your cart is empty.</p>';
    return;
  }
  cartItems.innerHTML = cart.map(item => `
    <div class="cart-item" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <span class="price">₹${item.price}</span>
        <div class="qty-control">
          <button class="qty-dec">-</button>
          <span>${item.qty}</span>
          <button class="qty-inc">+</button>
        </div>
      </div>
      <button class="remove-item" style="background:none;border:none;color:var(--fb-error);cursor:pointer;"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  // Attach events
  document.querySelectorAll('.cart-item').forEach(el => {
    const id = parseInt(el.dataset.id);
    const dec = el.querySelector('.qty-dec');
    const inc = el.querySelector('.qty-inc');
    const remove = el.querySelector('.remove-item');
    dec.addEventListener('click', () => updateQty(id, -1));
    inc.addEventListener('click', () => updateQty(id, 1));
    remove.addEventListener('click', () => removeFromCart(id));
  });
}

function addToCart(productId, qty = 1) {
  const product = products.find(p => p.id === productId);
  if (!product) return;
  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    cart.push({ ...product, qty });
  }
  saveCart();
}

function updateQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    cart = cart.filter(i => i.id !== id);
  }
  saveCart();
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart();
}

// ---------- WISHLIST ----------
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

function saveWishlist() {
  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  wishlistBadge.textContent = wishlist.length;
  renderWishlistItems();
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  if (index > -1) {
    wishlist.splice(index, 1);
  } else {
    wishlist.push(productId);
  }
  saveWishlist();
  updateWishlistButtons();
}

function updateWishlistButtons() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = parseInt(btn.dataset.id);
    btn.classList.toggle('active', wishlist.includes(id));
  });
}

function renderWishlistItems() {
  if (wishlist.length === 0) {
    wishlistItems.innerHTML = '<p style="color: var(--fb-text-muted);">Your wishlist is empty.</p>';
    return;
  }
  const items = wishlist.map(id => {
    const p = products.find(prod => prod.id === id);
    if (!p) return '';
    return `
      <div class="wishlist-item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}" />
        <div class="wishlist-item-info">
          <h4>${p.name}</h4>
          <span>₹${p.price}</span>
        </div>
        <button class="move-to-cart" data-id="${p.id}">Add to Cart</button>
        <button class="remove-wishlist" data-id="${p.id}"><i class="fas fa-times"></i></button>
      </div>
    `;
  }).join('');
  wishlistItems.innerHTML = items;
  // Events
  wishlistItems.querySelectorAll('.move-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      toggleWishlist(id); // remove from wishlist after adding
    });
  });
  wishlistItems.querySelectorAll('.remove-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      toggleWishlist(id);
    });
  });
}

// ---------- RENDER PRODUCTS ----------
function renderProducts(filteredProducts = products) {
  productGrid.innerHTML = filteredProducts.map(p => `
    <div class="product-card" data-id="${p.id}" data-category="${p.category}" data-price="${p.price}">
      <button class="wishlist-btn ${wishlist.includes(p.id) ? 'active' : ''}" data-id="${p.id}"><i class="fas fa-heart"></i></button>
      <img src="${p.image}" alt="${p.name}" loading="lazy" />
      ${p.tag ? `<span class="product-tag">${p.tag}</span>` : ''}
      <h3>${p.name}</h3>
      <div class="product-price">₹${p.price} <span class="product-unit">${p.unit}</span></div>
      <button class="add-to-cart" data-id="${p.id}">Add to Cart</button>
    </div>
  `).join('');

  // Attach events for wishlist and add-to-cart
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = parseInt(btn.dataset.id);
      toggleWishlist(id);
    });
  });

  document.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = parseInt(btn.dataset.id);
      addToCart(id);
      // temporary feedback
      btn.textContent = 'Added!';
      setTimeout(() => btn.textContent = 'Add to Cart', 1000);
    });
  });
}

// ---------- CATEGORY TILES ----------
function renderCategories() {
  const cats = [...new Set(products.map(p => p.category))];
  categoryStrip.innerHTML = cats.map(cat => `
    <div class="category-tile" data-category="${cat}">
      <img src="images/${cat}.jpg" alt="${cat}" />
      <span>${cat.replace('-', ' ').toUpperCase()}</span>
    </div>
  `).join('');

  // Click to filter
  categoryStrip.querySelectorAll('.category-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const cat = tile.dataset.category;
      categoryFilter.value = cat;
      applyFilters();
      // scroll to shop
      document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
      // highlight active
      document.querySelectorAll('.category-tile').forEach(t => t.classList.remove('active'));
      tile.classList.add('active');
    });
  });
}

// ---------- SEARCH / FILTERS ----------
function applyFilters() {
  const searchTerm = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;
  const maxPrice = parseInt(priceFilter.value);

  let filtered = products.filter(p => {
    const matchName = p.name.toLowerCase().includes(searchTerm);
    const matchCat = cat === 'all' || p.category === cat;
    const matchPrice = p.price <= maxPrice;
    return matchName && matchCat && matchPrice;
  });

  renderProducts(filtered);
}

// ---------- SIDEBAR TOGGLES ----------
function openCart() {
  cartSidebar.classList.add('open');
  cartOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  cartSidebar.classList.remove('open');
  cartOverlay.classList.remove('active');
  document.body.style.overflow = '';
}
function openWishlist() {
  wishlistSidebar.classList.add('open');
  wishlistOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeWishlist() {
  wishlistSidebar.classList.remove('open');
  wishlistOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function openCheckout() {
  checkoutModal.classList.add('open');
  checkoutOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCheckout() {
  checkoutModal.classList.remove('open');
  checkoutOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

function openCakeModal() {
  cakeModal.classList.add('open');
  cakeOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closeCakeModal() {
  cakeModal.classList.remove('open');
  cakeOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

// ---------- EVENT LISTENERS ----------
// Cart toggle
document.querySelector('.cart-toggle').addEventListener('click', openCart);
document.getElementById('closeCart').addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);
document.getElementById('continueShopping').addEventListener('click', closeCart);

// Wishlist toggle
document.querySelector('.wishlist-toggle').addEventListener('click', openWishlist);
document.getElementById('closeWishlist').addEventListener('click', closeWishlist);
wishlistOverlay.addEventListener('click', closeWishlist);

// Checkout
document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
document.getElementById('closeCheckout').addEventListener('click', closeCheckout);
checkoutOverlay.addEventListener('click', closeCheckout);

// Custom cake
document.getElementById('openCakeModal').addEventListener('click', openCakeModal);
document.getElementById('closeCake').addEventListener('click', closeCakeModal);
cakeOverlay.addEventListener('click', closeCakeModal);

// Mobile menu
document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('navMobile').classList.toggle('open');
});

// Search toggle
document.querySelector('.search-toggle').addEventListener('click', () => {
  searchBar.classList.toggle('open');
  if (searchBar.classList.contains('open')) {
    searchInput.focus();
  }
});

// Price filter display
priceFilter.addEventListener('input', () => {
  priceLabel.textContent = `₹0 – ₹${priceFilter.value}`;
});

// Filter triggers
searchInput.addEventListener('input', applyFilters);
categoryFilter.addEventListener('change', applyFilters);
priceFilter.addEventListener('input', applyFilters);
clearFiltersBtn.addEventListener('click', () => {
  searchInput.value = '';
  categoryFilter.value = 'all';
  priceFilter.value = '500';
  priceLabel.textContent = '₹0 – ₹500';
  applyFilters();
  document.querySelectorAll('.category-tile').forEach(t => t.classList.remove('active'));
});

// Checkout form submit (dummy)
document.getElementById('checkoutForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Order placed successfully! (Demo)');
  cart = [];
  saveCart();
  closeCheckout();
});

// Cake form submit
document.getElementById('cakeForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Custom cake request sent! We\'ll contact you within 24 hours.');
  closeCakeModal();
  document.getElementById('cakeForm').reset();
});

// Newsletter form
document.getElementById('newsletterForm').addEventListener('submit', (e) => {
  e.preventDefault();
  alert('Thank you for subscribing!');
  e.target.reset();
});

// ---------- INIT ----------
renderCategories();
renderProducts();
updateCartUI();
updateWishlistButtons();
saveWishlist(); // ensure badge shows