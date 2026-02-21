/* 
   LA FABRICAUSA - SUPREME ENGINE v2.0
   Features: Category Filtering, Smart Cart, Dynamic Pricing
*/

// 1. قاعدة بيانات المنتجات الستة (كاملة مع التصنيفات والأوسمة)
const products = [
    { 
        id: 1, 
        name: "ISO100 Hydrolyzed", 
        price: 1300, 
        category: "Protein", 
        badge: "🔥 الأكثر مبيعاً",
        img: "https://images.unsplash.com/photo-1605296867424-35fc25c9212a?w=800", 
        desc: "أقوى بروتين هيدروليزيد في العالم للامتصاص الفائق وبناء العضلات الصافية." 
    },
    { 
        id: 2, 
        name: "Creatine Monohydrate", 
        price: 250, 
        category: "Creatine", 
        badge: "Pure",
        img: "https://images.unsplash.com/photo-1594400202073-77d34bc65ee8?w=800", 
        desc: "كرياتين نقي 100% لزيادة القوة البدنية والانفجارية العضلية في التمرين." 
    },
    { 
        id: 3, 
        name: "Casein Night Protein", 
        price: 950, 
        category: "Protein", 
        badge: "Recovery",
        img: "https://images.unsplash.com/photo-1617649387527-75ad0df5ec4c?w=800", 
        desc: "بروتين بطيء الامتصاص يحمي عضلاتك من التكسر طوال الليل (8 ساعات)." 
    },
    { 
        id: 4, 
        name: "Vapor X5 Pre-Workout", 
        price: 600, 
        category: "Energy", 
        badge: "Promotion",
        img: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800", 
        desc: "طاقة انفجارية وتركيز حاد لكسر أرقامك القياسية في النادي." 
    },
    { 
        id: 5, 
        name: "Rule 1 Whey Blend", 
        price: 850, 
        category: "Protein", 
        badge: "Premium",
        img: "https://images.unsplash.com/photo-1617649387550-79a69e3d6b49?w=800", 
        desc: "مزيج عالي الجودة من الواي بروتين المركز والمعزول لنتائج مثالية." 
    },
    { 
        id: 6, 
        name: "BCAA Amino Performance", 
        price: 450, 
        category: "Amino", 
        badge: "Endurance",
        img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800", 
        desc: "أحماض أمينية لسرعة الاستشفاء العضلي ومنع الإرهاق أثناء الحصص التدريبية." 
    }
];

// 2. حالة المتجر (State Management)
let cart = JSON.parse(localStorage.getItem('laFabricaCart')) || [];
let currentProduct = null;
let currentQty = 1;

// 3. التشغيل الأولي
function init() {
    const grid = document.getElementById('productsGrid');
    if (grid) renderProducts(products); // عرض الكل عند البدء
    updateCartUI();
}

// 4. دالة عرض المنتجات في الشبكة (Grid)
function renderProducts(items) {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    
    grid.innerHTML = items.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="badge">${p.badge}</div>
            <div class="img-box">
                <img src="${p.img}" alt="${p.name}" loading="lazy">
            </div>
            <div class="product-info">
                <span style="color:var(--primary); font-size:11px; font-weight:800; letter-spacing:1px">${p.category}</span>
                <h3 style="margin:5px 0; font-size:17px; color:#fff">${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

// 5. نظام الفلاتر (Category Filter)
function filterCategory(category, element) {
    // تحديث شكل الأزرار
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    element.classList.add('active');

    // تصفية المنتجات
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filtered = products.filter(p => p.category === category);
        renderProducts(filtered);
    }
}

// 6. المودال (Modal Logic)
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
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 7. التحكم في الكمية
function updateQty(val) {
    if (currentQty + val >= 1 && currentQty + val <= 10) {
        currentQty += val;
        document.getElementById('modalQty').innerText = currentQty;
        // تحديث الثمن بناءً على الكمية
        document.getElementById('m-price').innerText = (currentProduct.price * currentQty) + " MAD";
    }
}

// 8. إضافة المنتج للسلة
function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);
    if (existing) {
        existing.qty = Math.min(existing.qty + currentQty, 10);
    } else {
        cart.push({...currentProduct, qty: currentQty});
    }
    saveCart();
    closeModal();
    toggleCart(true); // فتح السلة تلقائياً لرؤية النتيجة
}

// 9. تحديث واجهة السلة
function updateCartUI() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    container.innerHTML = cart.map((item, index) => `
        <div style="display:flex; gap:15px; margin-bottom:20px; align-items:center; background:#161616; padding:12px; border-radius:15px; border:1px solid #222">
            <img src="${item.img}" style="width:60px; height:60px; object-fit:contain; border-radius:10px">
            <div style="flex:1">
                <h4 style="font-size:13px; font-weight:600; color:#fff">${item.name}</h4>
                <p style="color:var(--accent); font-weight:800; font-size:14px">${item.price * item.qty} MAD (x${item.qty})</p>
            </div>
            <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#ff4d4d; cursor:pointer; font-size:14px; padding:10px"></i>
        </div>
    `).join('');
    
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const cartTotal = document.getElementById('cartTotal');
    const cartCount = document.getElementById('cartCount');

    if(cartTotal) cartTotal.innerText = total + " MAD";
    if(cartCount) cartCount.innerText = cart.length;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
}

function saveCart() {
    localStorage.setItem('laFabricaCart', JSON.stringify(cart));
    updateCartUI();
}

function toggleCart(show) {
    const drawer = document.getElementById('cartDrawer');
    if(drawer) drawer.classList.toggle('open', show);
}

// 10. إرسال الطلبية النهائية عبر الواتساب (احترافي جداً)
function sendOrder() {
    const name = document.getElementById('custName').value.trim();
    const city = document.getElementById('custCity').value.trim();
    
    if (cart.length === 0) return alert("السلة فارغة، المرجو اختيار منتج");
    if (!name || !city) return alert("المرجو إدخال اسمك ومدينتك لتأكيد الطلب");

    let text = `*طلب جديد من موقع LA FABRICAUSA*%0A`;
    text += `━━━━━━━━━━━━━━━%0A`;
    cart.forEach(i => {
        text += `• *${i.name}*%0A   الكمية: ${i.qty} | الثمن: ${i.price * i.qty} MAD%0A`;
    });
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    text += `━━━━━━━━━━━━━━━%0A`;
    text += `*المجموع الكلي:* ${total} MAD%0A%0A`;
    text += `*معلومات الزبون:*%0A`;
    text += `👤 الاسم: ${name}%0A`;
    text += `📍 المدينة: ${city}%0A`;
    text += `━━━━━━━━━━━━━━━%0A`;
    text += `المرجو تأكيد الطلب لإرساله في أقرب وقت.`;

    window.open(`https://wa.me/212603852896?text=${text}`, '_blank');
}

// 11. البحث الفوري (Live Search)
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term));
    renderProducts(filtered);
});

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', init);