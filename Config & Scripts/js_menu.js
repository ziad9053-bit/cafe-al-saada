/**
 * ملف: js_menu.js
 */

async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    // جلب البيانات من Supabase
    let query = window.supabase.from('items').select('*');
    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) { 
        console.error("خطأ Supabase:", error); 
        menuContainer.innerHTML = "<p class='text-center text-red-500'>تعذر تحميل القائمة.</p>";
        return; 
    }

    menuContainer.innerHTML = ""; 
    if (!data || data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center'>لا توجد أصناف في هذه الفئة حالياً.</p>";
    } else {
        data.forEach(item => {
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-xl bg-white shadow-sm transition hover:shadow-md">
                    <h3 class="font-bold text-lg">${item.name}</h3>
                    <p class="text-gray-600 mb-2">السعر: ${item.price} ريال</p>
                    <button class="add-to-cart-btn w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}">
                            إضافة للسلة
                    </button>
                </div>
            `;
        });
    }
    
    // استخدام Event Delegation (أسرع وأكثر كفاءة)
    menuContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const { id, name, price } = e.target.dataset;
            addToCart(id, name, parseFloat(price));
        }
    });

    updateCartCount();
}

/**
 * دالة إضافة صنف للسلة
 */
function addToCart(id, name, price) {
    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        cart = [];
    }
    
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // رسالة تنبيه خفيفة (يمكنك استبدالها بـ Toast لاحقاً)
    console.log(`تمت إضافة ${name} للسلة`);
}

/**
 * دالة تحديث العداد
 */
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;

    let cart = [];
    try {
        cart = JSON.parse(localStorage.getItem('cart') || '[]');
    } catch (e) {
        cart = [];
    }
    
    const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
    badge.innerText = totalItems;
}

// تشغيل الوظائف
window.addEventListener('DOMContentLoaded', loadMenu);
