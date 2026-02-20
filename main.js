/* 
   LA FABRICAUSA - SUPREME ENGINE
   Logic: Shopping Cart / Dynamic Pricing / WhatsApp API
*/

// 1. بيانات المنتجات الستة (كاملة ومضبوطة)
const products = [
    { 
        id: 1, 
        name: "ISO100 Hydrolyzed", 
        price: 1300, 
        category: "Protein", 
        img: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800", 
        desc: "أقوى بروتين هيدروليزيد في العالم للامتصاص الفائق وبناء العضلات الصافية." 
    },
    { 
        id: 2, 
        name: "Creatine Monohydrate", 
        price: 250, 
        category: "Creatine", 
        img: "https://images.unsplash.com/photo-1594400202073-77d34bc65ee8?w=800", 
        desc: "كرياتين نقي 100% لزيادة القوة البدنية والانفجارية العضلية في التمرين." 
    },
    { 
        id: 3, 
        name: "Casein Night Protein", 
        price: 950, 
        category: "Protein", 
        img: "https://images.unsplash.com/photo-1617649387527-75ad0df5ec4c?w=800", 
        desc: "بروتين بطيء الامتصاص يحمي عضلاتك من التكسر طوال الليل (8 ساعات)." 
    },
    { 
        id: 4, 
        name: "Vapor X5 Pre-Workout", 
        price: 600, 
        category: "Energy", 
        img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800", 
        desc: "طاقة انفجارية وتركيز حاد لكسر أرقامك القياسية في النادي." 
    },
    { 
        id: 5, 
        name: "Rule 1 Whey Blend", 
        price: 850, 
        category: "Protein", 
        img: "https://images.unsplash.com/photo-1617649387550-79a69e3d6b49?w=800", 
        desc: "مزيج عالي الجودة من الواي بروتين المركز والمعزول لنتائج مثالية." 
    },
    { 
        id: 6, 
        name: "BCAA Amino Performance", 
        price: 450, 
        category: "Amino", 
        img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800", 
        desc: "أحماض أمينية لسرعة الاستشفاء العضلي ومنع الإرهاق أثناء الحصص التدريبية." 
    }
];

// 2. حالة المتجر (State)
let cart = JSON.parse(localStorage.getItem('supremeCart')) || [];
let currentProduct = null;
let currentQty = 1;

// 3. تهيئة الموقع عند التحميل
function init() {
    const grid = document.getElementById('productsGrid');
    if (grid) renderGrid(products);
    updateCartUI();
}

// 4. عرض المنتجات في الشبكة
function renderGrid(items) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = items.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box"><img src="${p.img}" loading="lazy"></div>
            <div class="product-info">
                <span style="color:var(--primary); font-size:12px; font-weight:bold; letter-spacing:1px">${p.category}</span>
                <h3 style="margin:5px 0; font-size:18px">${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

// 5. فتح نافذة المنتج (Modal)
function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    currentQty = 1;
    const modal = document.getElementById('productModal');
    if(!modal) return;

    document.getElementById('m-img').src = currentProduct.img;
    document.getElementById('m-name').innerText = currentProduct.name;
    document.getElementById('m-price').innerText = currentProduct.price + " MAD";
    document.getElementById('m-desc').innerText = currentProduct.desc;
    document.getElementById('modalQty').innerText = currentQty;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // منع التمرير في الخلفية
}

function closeModal() { 
    document.getElementById('productModal').style.display = 'none'; 
    document.body.style.overflow = 'auto';
}

// 6. التحكم في الكمية (داخل المودال)
function updateQty(val) {
    if(currentQty + val >= 1 && currentQty + val <= 10) {
        currentQty += val;
        document.getElementById('modalQty').innerText = currentQty;
        // تحديث الثمن في المودال فوراً
        document.getElementById('m-price').innerText = (currentProduct.price * currentQty) + " MAD";
    }
}

// 7. إضافة المنتج للسلة
function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);
    if(existing) {
        existing.qty = Math.min(existing.qty + currentQty, 10);
    } else {
        cart.push({...currentProduct, qty: currentQty});
    }
    saveCart(); 
    closeModal(); 
    toggleCart(true);
}

// 8. تحديث واجهة السلة الجانبية
function updateCartUI() {
    const container = document.getElementById('cartItems');
    const cartCountLabel = document.getElementById('cartCount');
    const cartTotalLabel = document.getElementById('cartTotal');

    if (container) {
        container.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.img}">
                <div style="flex:1">
                    <h4 style="font-size:14px; font-weight:600">${item.name}</h4>
                    <p style="color:var(--accent); font-weight:800; font-size:14px">${item.price * item.qty} MAD (x${item.qty})</p>
                </div>
                <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#ff4d4d; cursor:pointer; font-size:14px"></i>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    if(cartTotalLabel) cartTotalLabel.innerText = total + " MAD";
    if(cartCountLabel) cartCountLabel.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

// 9. وظائف إضافية للسلة
function removeFromCart(i) { cart.splice(i, 1); saveCart(); }
function saveCart() { localStorage.setItem('supremeCart', JSON.stringify(cart)); updateCartUI(); }
function toggleCart(show) { 
    const drawer = document.getElementById('cartDrawer');
    if(drawer) drawer.classList.toggle('open', show); 
}

// 10. إرسال الطلبية النهائية عبر الواتساب
function sendOrder() {
    const nameInput = document.getElementById('custName');
    const cityInput = document.getElementById('custCity');
    
    if(!nameInput || !cityInput) return; 
    
    const name = nameInput.value.trim();
    const city = cityInput.value.trim();

    if(!name || !city || cart.length === 0) return alert("المرجو إدخال اسمك ومدينتك واختيار منتجاتك.");

    let text = `*طلب جديد - LA FABRICAUSA*%0A%0A`;
    cart.forEach(i => text += `• *${i.name}* (x${i.qty}) = ${i.price * i.qty} MAD%0A`);
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    text += `%0A━━━━━━━━━━━━━━%0A*المجموع الكلي:* ${total} MAD%0A━━━━━━━━━━━━━━%0A%0A*الزبون:* ${name}%0A*المدينة:* ${city}%0A%0Aالمرجو تأكيد الطلب المرجو.`;
    
    window.open(`https://wa.me/212603852896?text=${text}`, '_blank');
}

// 11. البحث الفوري (Live Search)
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    renderGrid(filtered);
});

// التشغيل
document.addEventListener('DOMContentLoaded', init);