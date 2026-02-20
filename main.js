const products = [
    { id: 1, name: "Whey Isolate Platinum", price: 1300, category: "Protein", img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800", desc: "نقاء تام بنسبة 100% لبناء عضلي سريع وقوي." },
    { id: 2, name: "Creatine Monohydrate Pro", price: 300, category: "Creatine", img: "https://images.unsplash.com/photo-1594400202073-77d34bc65ee8?w=800", desc: "زيادة القوة البدنية والتحمل في أقوى حصص التدريب." },
    { id: 3, name: "Casein Recovery Night", price: 950, category: "Protein", img: "https://images.unsplash.com/photo-1617649387527-75ad0df5ec4c?w=800", desc: "بروتين بطيء الامتصاص يحمي عضلاتك طوال الليل." },
    { id: 4, name: "Pre-Workout Explosion", price: 600, category: "Energy", img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800", desc: "طاقة انفجارية وتركيز حاد لكسر أرقامك القياسية." }
];

let cart = JSON.parse(localStorage.getItem('nike_cart')) || [];
let currentProduct = null;
let currentQty = 1;

function init() {
    renderGrid(products);
    updateCartUI();
}

function renderGrid(items) {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    grid.innerHTML = items.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box"><img src="${p.img}"></div>
            <div class="product-info">
                <span style="color:var(--primary); font-size:12px; font-weight:bold">${p.category}</span>
                <h3 style="margin:5px 0">${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    currentQty = 1;
    document.getElementById('m-img').src = currentProduct.img;
    document.getElementById('m-name').innerText = currentProduct.name;
    document.getElementById('m-price').innerText = currentProduct.price + " MAD";
    document.getElementById('m-desc').innerText = currentProduct.desc;
    document.getElementById('modalQty').innerText = currentQty;
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() { document.getElementById('productModal').style.display = 'none'; }

function updateQty(val) {
    if(currentQty + val >= 1 && currentQty + val <= 10) {
        currentQty += val;
        document.getElementById('modalQty').innerText = currentQty;
        document.getElementById('m-price').innerText = (currentProduct.price * currentQty) + " MAD";
    }
}

function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);
    if(existing) existing.qty += currentQty;
    else cart.push({...currentProduct, qty: currentQty});
    saveCart(); closeModal(); toggleCart(true);
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    if(!container) return;
    container.innerHTML = cart.map((item, index) => `
        <div style="display:flex; gap:20px; margin-bottom:25px; align-items:center; background:#1a1e24; padding:15px; border-radius:20px">
            <img src="${item.img}" style="width:70px; height:70px; object-fit:contain">
            <div style="flex:1">
                <h4 style="font-size:14px">${item.name}</h4>
                <p style="color:var(--primary); font-weight:800">${item.price * item.qty} MAD (x${item.qty})</p>
            </div>
            <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#ef4444; cursor:pointer"></i>
        </div>
    `).join('');
    
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cartTotal').innerText = total + " MAD";
    document.getElementById('cartCount').innerText = cart.length;
}

function removeFromCart(i) { cart.splice(i, 1); saveCart(); }
function saveCart() { localStorage.setItem('nike_cart', JSON.stringify(cart)); updateCartUI(); }
function toggleCart(show) { document.getElementById('cartDrawer').classList.toggle('open', show); }

function sendOrder() {
    const name = document.getElementById('custName').value;
    const city = document.getElementById('custCity').value;
    if(!name || !city || cart.length === 0) return alert("المرجو إكمال البيانات واختيار منتج");

    let text = `*طلب جديد - La FabricaUsa*%0A%0A`;
    cart.forEach(i => text += `• ${i.name} (x${i.qty})%0A`);
    text += `%0A*المجموع:* ${document.getElementById('cartTotal').innerText}%0A*الزبون:* ${name}%0A*المدينة:* ${city}`;
    window.open(`https://wa.me/212603852896?text=${text}`, '_blank');
}

// Search
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    renderGrid(products.filter(p => p.name.toLowerCase().includes(term)));
});

init();