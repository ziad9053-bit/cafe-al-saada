/**
 * ملف: js_menu.js (النسخة المحدثة والمستقرة)
 */

async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    
    // فحص الجاهزية بدقة
    if (!menuContainer) return;
    if (typeof window.supabase === 'undefined') {
        console.warn("جاري انتظار جاهزية Supabase...");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    let query = window.supabase.from('items').select('*');
    if (category) query = query.eq('category', category);

    const { data, error } = await query;

    if (error) {
        console.error("خطأ Supabase:", error);
        menuContainer.innerHTML = `<p class='text-center text-red-500 p-4'>حدث خطأ أثناء تحميل القائمة. تأكد من الاتصال.</p>`;
        return;
    }

    menuContainer.innerHTML = (data && data.length > 0) ? data.map(item => `
        <div class="menu-item p-4 border rounded-2xl bg-white shadow-sm flex items-center gap-4 transition hover:shadow-md">
            <img src="${item.image_url || 'https://via.placeholder.com/150'}" alt="${item.name}" 
                 class="w-20 h-20 object-cover rounded-xl bg-gray-100 flex-shrink-0">
            <div class="flex-grow">
                <h3 class="font-bold text-gray-800 text-lg leading-tight">${item.name}</h3>
                <p class="text-orange-600 font-bold mt-1">${item.price} ريال</p>
            </div>
            <button class="add-to-cart-btn bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition flex-shrink-0 shadow-sm" 
                    data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" data-image="${item.image_url || ''}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    `).join('') : "<p class='text-center col-span-full text-gray-500 py-10'>لا توجد أصناف حالياً.</p>";

    updateCartCount();
}

function addToCart(id, name, price, imageUrl) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({ id, name, price: parseFloat(price), quantity: 1, image_url: imageUrl });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    // تأثير بصري بسيط
    const badge = document.getElementById('cart-badge');
    if(badge) {
        badge.classList.add('scale-125');
        setTimeout(() => badge.classList.remove('scale-125'), 200);
    }
}

function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    badge.innerText = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
}

// [تعديل جذري] التشغيل عبر الحدث الجاهز والـ DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    
    // الاستماع لحدث جاهزية Supabase
    window.addEventListener('supabaseReady', loadMenu);
    
    // محاولة التشغيل فوراً في حال كان Supabase جاهزاً بالفعل
    if (window.supabase) loadMenu();

    // ربط زر الإضافة
    document.getElementById('menu-items')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const { id, name, price, image } = btn.dataset;
            addToCart(id, name, price, image);
        }
    });
});
