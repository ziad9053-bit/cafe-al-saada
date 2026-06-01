/**
 * ملف: js_menu.js (التصميم الأفقي المثالي)
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
            const imageUrl = item.image_url ? item.image_url : 'https://via.placeholder.com/150';
            
            // التصميم الأفقي:
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-2xl bg-white shadow-sm flex items-center gap-4 transition hover:shadow-md">
                    <img src="${imageUrl}" alt="${item.name}" 
                         class="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0">
                    
                    <div class="flex-grow">
                        <h3 class="font-bold text-gray-800 text-lg leading-tight">${item.name}</h3>
                        <p class="text-orange-600 font-bold mt-1">${item.price} ريال</p>
                    </div>
                    
                    <button class="add-to-cart-btn bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition flex-shrink-0 shadow-sm" 
                            data-id="${item.id}" 
                            data-name="${item.name}" 
                            data-price="${item.price}">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                            </svg>
                    </button>
                </div>
            `;
        });
    }
    updateCartCount();
}

// تشغيل عند تحميل الصفحة (نفس الكود السابق للـ Event Listeners)
document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    
    const menuItems = document.getElementById('menu-items');
    if (menuItems) {
        menuItems.addEventListener('click', (e) => {
            // البحث عن أقرب زر (في حال الضغط على أيقونة الزائد داخل الزر)
            const btn = e.target.closest('.add-to-cart-btn');
            if (btn) {
                const { id, name, price } = btn.dataset;
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
