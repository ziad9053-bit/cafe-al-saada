/**
 * ملف: js_menu.js (المعدل والمثالي)
 */

async function loadMenu() {
    console.log("1. بدأت عملية تحميل القائمة...");
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) {
        console.error("خطأ: العنصر menu-items غير موجود في الصفحة!");
        return;
    }

    if (typeof window.supabase === 'undefined') {
        console.error("خطأ: مكتبة Supabase لم تُحمل أو لم يتم تهيئتها!");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    console.log("2. جاري جلب البيانات من جدول 'items'...");
    let query = window.supabase.from('items').select('*');
    if (category) query = query.eq('category', category);

    const { data, error } = await query;

    if (error) { 
        console.error("خطأ من Supabase:", error); 
        menuContainer.innerHTML = `<p class='text-center text-red-500'>خطأ: ${error.message}</p>`;
        return; 
    }

    console.log("3. تم جلب البيانات بنجاح:", data);

    menuContainer.innerHTML = ""; 
    if (!data || data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center col-span-full'>لا توجد أصناف حالياً.</p>";
    } else {
        data.forEach(item => {
            // التحقق من الرابط: إذا كان موجوداً نستخدمه، وإلا نضع صورة افتراضية
            const imageUrl = item.image_url ? item.image_url : 'https://via.placeholder.com/300';
            
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-2xl bg-white shadow-sm transition hover:shadow-lg flex flex-col">
                    <img src="${imageUrl}" alt="${item.name}" 
                         class="w-full h-40 object-cover rounded-xl mb-4 bg-gray-100">
                    
                    <h3 class="font-bold text-lg mb-1">${item.name}</h3>
                    <p class="text-gray-600 mb-4">السعر: ${item.price} ريال</p>
                    
                    <button class="add-to-cart-btn mt-auto w-full bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}">
                            إضافة للسلة
                    </button>
                </div>
            `;
        });
    }
    updateCartCount();
}

// تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    
    // ربط السلة
    const menuItems = document.getElementById('menu-items');
    if (menuItems) {
        menuItems.addEventListener('click', (e) => {
            if (e.target.classList.contains('add-to-cart-btn')) {
                const { id, name, price } = e.target.dataset;
                addToCart(id, name, parseFloat(price));
            }
        });
    }
});

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(`تمت إضافة ${name} للسلة`);
}

function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    badge.innerText = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
}
