// ================= PRODUCTS =================
const products = [
    {
        id: 1,
        name: "ISO100 Hydrolyzed",
        price: 1300,
        img: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800",
        desc: "بروتين معزول ومحلل سريع الامتصاص، مثالي لبناء عضلات صافية وتسريع الاستشفاء.",
        featured: true
    },
    {
        id: 2,
        name: "Creatine Monohydrate",
        price: 250,
        img: "https://images.unsplash.com/photo-1594400202073-77d34bc65ee8?w=800",
        desc: "كرياتين نقي 100% لزيادة القوة والانفجار العضلي.",
        featured: true
    },
    {
        id: 3,
        name: "Pre-Workout Extreme",
        price: 400,
        img: "https://images.unsplash.com/photo-1571019613914-85f342c1d4b6?w=800",
        desc: "طاقة وتركيز عالي وضخ دموي قوي قبل التمرين.",
        featured: true
    },
    {
        id: 4,
        name: "Hydrolyzed Whey Isolate",
        price: 1200,
        img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800",
        desc: "بروتين عالي الجودة سريع الهضم لنتائج احترافية.",
        featured: false
    },
    {
        id: 5,
        name: "RUL 1 Whey Blend",
        price: 850,
        img: "https://images.unsplash.com/photo-1617649387527-75ad0df5ec4c?w=800",
        desc: "مزيج بروتين متوازن لدعم نمو العضلات.",
        featured: false
    },
    {
        id: 6,
        name: "Casein Night Protein",
        price: 800,
        img: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800",
        desc: "بروتين بطيء الامتصاص مثالي لفترة النوم.",
        featured: false
    }
];

// ================= STATE =================
let cart = [];
let currentProduct = null;
let currentQty = 1;

// ================= INIT =================
function init() {
    renderShop();
    renderFeatured();
}

// ================= RENDER BEST SELLER =================
function renderFeatured() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.filter(p => p.featured);

    container.innerHTML = featured.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box">
                <span class="badge">🔥 Best Seller</span>
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

// ================= RENDER SHOP =================
function renderShop() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;

    const normalProducts = products.filter(p => !p.featured);

    grid.innerHTML = normalProducts.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div class="product-info">
                <h3>${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

// ================= MODAL =================
function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    currentQty = 1;

    document.getElementById('qty').innerText = 1;
    document.getElementById('m-img').src = currentProduct.img;
    document.getElementById('m-name').innerText = currentProduct.name;
    document.getElementById('m-price').innerText = currentProduct.price + " MAD";
    document.getElementById('m-desc').innerText = currentProduct.desc;
    document.getElementById('modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// ================= QTY =================
function updateQty(val) {
    if (currentQty + val >= 1 && currentQty + val <= 10) {
        currentQty += val;
        document.getElementById('qty').innerText = currentQty;
        document.getElementById('m-price').innerText =
            (currentProduct.price * currentQty) + " MAD";
    }
}

// ================= CART =================
function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);

    if (existing) {
        existing.qty += currentQty;
    } else {
        cart.push({ ...currentProduct, qty: currentQty });
    }

    updateCart();
    closeModal();
    toggleCart(true);
}

function updateCart() {
    const container = document.getElementById('cartItems');

    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}">
            <div class="cart-info">
                <h4>${item.name}</h4>
                <p>${item.price * item.qty} MAD (x${item.qty})</p>
            </div>
            <button onclick="removeFromCart(${index})">حذف</button>
        </div>
    `).join('');

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    document.getElementById('cartTotal').innerText = total + " MAD";
    document.getElementById('cartCount').innerText = cart.length;
}

function removeFromCart(i) {
    cart.splice(i, 1);
    updateCart();
}

function toggleCart(show) {
    document.getElementById('cartDrawer').classList.toggle('open', show);
}

// ================= CHECKOUT =================
function checkout() {
    const name = document.getElementById('uName').value.trim();
    const city = document.getElementById('uCity').value.trim();

    if (!name || !city || cart.length === 0)
        return alert("المرجو ملئ البيانات وإضافة منتج");

    let msg = `*طلب جديد - La FabricaUsa*%0A%0A`;

    cart.forEach(i => {
        msg += `- ${i.name} (x${i.qty}) = ${i.price * i.qty} MAD%0A`;
    });

    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);

    msg += `%0A*المجموع:* ${total} MAD`;
    msg += `%0A*الزبون:* ${name}`;
    msg += `%0A*المدينة:* ${city}`;

    window.open(`https://wa.me/212603852896?text=${msg}`, '_blank');
}

init();