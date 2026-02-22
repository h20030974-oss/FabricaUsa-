/* 
   LA FABRICAUSA - SUPREME ENGINE
   Logic: 7 Products / Cart System / Category Filter / WhatsApp API
*/

// 1. قاعدة البيانات (المنتجات السبعة)
const products = [
    { 
        id: 1, 
        name: "Protein ISO100", 
        price: 1300, 
        category: "Protein", 
        img: "https://image2url.com/r2/default/images/1771659774036-46d8901f-d788-4054-9cb8-5a720026330e.png", 
        desc: "أقوى بروتين هيدروليزيد لبناء العضلات الصافية وسرعة الاستشفاء." 
    },
    { 
        id: 2, 
        name: "Creatine Monohydrate", 
        price: 250, 
        category: "Creatine", 
        img: "https://image2url.com/r2/default/images/1771682254023-a5faf561-9ece-472c-96ec-90152a9ab76f.png", 
        desc: "كرياتين نقي 100% لزيادة القوة البدنية والتحمل في التمرين." 
    },
    { 
        id: 3, 
        name: "Casein Night Protein", 
        price: 950, 
        category: "Protein", 
        img: "https://image2url.com/r2/default/images/1771659695650-8aa117c9-4ef9-4ef8-a813-128fac0b8ee7.png", 
        desc: "بروتين بطيء الامتصاص يحمي عضلاتك طوال الليل لمدة 8 ساعات." 
    },
    { 
        id: 4, 
        name: "BIOTECH USA Iso Whey Zero 1.8kg", 
        price: 1049, 
        category: "Protein", 
        img: "https://image2url.com/r2/default/images/1771740313674-c8c7ce97-dce4-4f7f-978f-0c82e601735a.webp", 
        desc: "هو بروتين مصل حليب معزول عالي النقاء (Whey Isolate)، مصمم لتوفير أعلى نسبة بروتين بأقل كمية من الدهون واللاكتوز." 
    },
    { 
        id: 5, 
        name: "Rule 1 Whey Blend", 
        price: 850, 
        category: "Protein", 
        img: "https://image2url.com/r2/default/images/1771659519615-a56c247e-4fd9-4e63-87ad-cc424d32600f.png", 
        desc: "مزيج عالي الجودة من البروتين المعزول والمركز لنتائج مثالية."
    },
    { 
        id: 6, 
        name: "BCAA Amino Performance", 
        price: 450, 
        category: "Amino", 
        img: "https://images.unsplash.com/photo-1593095191071-82b0fdf983a1?w=800", 
        desc: "أحماض أمينية لسرعة الاستشفاء العضلي ومنع الإرهاق أثناء التدريب." 
    },
    { 
        id: 7, 
        name: "Créatine Monohydrate Biotech USA 500g", 
        price: 349, 
        category: "Créatine", 
        img: "https://image2url.com/r2/default/images/1771739217309-7de4e486-cb92-4770-a27e-f2109ebf6865.webp", 
        desc: "مكمل كرياتين مونوهيدرات نقي 100% بدون نكهة." 
    },
    { 
        id: 8, 
        name: "V-bulk preminum USA 2,72 kg Victor Martinez", 
        price: 539, 
        category: "Protein", 
        img: "https://image2url.com/r2/default/images/1771739794730-38d09181-0d31-41bf-9bf8-c9e415b5fe6e.webp", 
        desc: "ماس جينر عالي السعرات مخصص لزيادة الوزن والكتلة العضلية بسرعة." 
    },
    { 
        id: 9, 
        name: "Pre-Workout Power Boost", 
        price: 400, 
        category: "Pre-Workout", 
        img: "https://image2url.com/r2/default/images/1771682482293-7aafd962-4421-46fc-8bf8-e791d9cbeefb.png", 
        desc: "مكمل قبل التمرين يمنحك طاقة قوية وتركيز عالي، يساعد على زيادة القوة والتحمل وتحسين الأداء خلال الحصص المكثفة."
    }
];

// 2. حالة المتجر
let cart = JSON.parse(localStorage.getItem('supreme_cart')) || [];
let currentProduct = null;
let currentQty = 1;

// 3. تهيئة الموقع
function init() {
    const grid = document.getElementById('productsGrid');
    if (grid) renderGrid(products); 
    updateCartUI();
}

// 4. عرض المنتجات
function renderGrid(items) {
    const grid = document.getElementById('productsGrid');
    if(!grid) return;
    grid.innerHTML = items.map(p => `
        <div class="product-card" onclick="openModal(${p.id})">
            <div class="img-box"><img src="${p.img}" loading="lazy"></div>
            <div class="product-info">
                <span style="color:var(--primary); font-size:10px; font-weight:bold; letter-spacing:1px">${p.category}</span>
                <h3 style="margin:5px 0; font-size:15px; color:#fff">${p.name}</h3>
                <p class="price">${p.price} MAD</p>
            </div>
        </div>
    `).join('');
}

// 5. الفلترة
function filterCategory(cat, el) {
    const chips = document.querySelectorAll('.chip');
    if(chips) chips.forEach(c => c.classList.remove('active'));
    if(el) el.classList.add('active');

    const filtered = cat === 'all' ? products : products.filter(p => p.category === cat);
    renderGrid(filtered);
}

// 6. المودال (نافذة المنتج)
function openModal(id) {
    currentProduct = products.find(p => p.id === id);
    currentQty = 1;
    const modal = document.getElementById('productModal');
    if(!modal) return;

    document.getElementById('m-img').src = currentProduct.img;
    document.getElementById('m-name').innerText = currentProduct.name;
    document.getElementById('m-price').innerText = currentProduct.price + " MAD";
    document.getElementById('m-desc').innerText = currentProduct.desc;
    
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    const modal = document.getElementById('productModal');
    if(modal) modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// 7. السلة (Cart)
function addToCart() {
    const existing = cart.find(i => i.id === currentProduct.id);
    if(existing) existing.qty += 1;
    else cart.push({...currentProduct, qty: 1});
    
    saveCart();
    closeModal();
    toggleCart(true);
}

function updateCartUI() {
    const container = document.getElementById('cartItems');
    const cartCount = document.getElementById('cartCount');
    const cartTotal = document.getElementById('cartTotal');

    if (container) {
        container.innerHTML = cart.map((item, index) => `
            <div style="display:flex; gap:15px; margin-bottom:20px; align-items:center; background:#161616; padding:12px; border-radius:15px">
                <img src="${item.img}" style="width:50px; height:50px; object-fit:contain; border-radius:10px">
                <div style="flex:1">
                    <h4 style="font-size:13px; font-weight:600">${item.name}</h4>
                    <p style="color:var(--accent); font-weight:800; font-size:13px">${item.price * item.qty} MAD (x${item.qty})</p>
                </div>
                <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#ff4d4d; cursor:pointer; font-size:12px"></i>
            </div>
        `).join('');
    }
    
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    if(cartTotal) cartTotal.innerText = total + " MAD";
    if(cartCount) cartCount.innerText = cart.length;
}

function removeFromCart(i) { cart.splice(i, 1); saveCart(); }
function saveCart() { localStorage.setItem('supreme_cart', JSON.stringify(cart)); updateCartUI(); }
function toggleCart(show) { 
    const drawer = document.getElementById('cartDrawer');
    if(drawer) drawer.classList.toggle('open', show); 
}

// 8. إرسال الطلب للواتساب
function sendOrder() {
    const name = document.getElementById('custName').value.trim();
    const city = document.getElementById('custCity').value.trim();
    
    if(cart.length === 0 || !name || !city) return alert("المرجو إكمال البيانات واختيار منتج");

    let text = `*طلب جديد من موقع LA FABRICAUSA*%0A%0A`;
    cart.forEach(i => text += `• ${i.name} (x${i.qty}) = ${i.price * i.qty} MAD%0A`);
    const total = cart.reduce((s, i) => s + (i.price * i.qty), 0);
    text += `%0A*المجموع الكلي:* ${total} MAD%0A%0A*الزبون:* ${name}%0A*المدينة:* ${city}`;
    
    window.open(`https://wa.me/212603852896?text=${text}`, '_blank');
}

// تشغيل
document.addEventListener('DOMContentLoaded', init);