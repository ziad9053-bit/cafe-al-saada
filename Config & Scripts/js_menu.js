/**
 * ملف: js_menu.js (النسخة المتوافقة تماماً مع نظام الطلبات الجديد)
 */

async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer || typeof window.supabase === 'undefined') return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    let query = window.supabase.from('items').select('*');
    if (category) query = query.eq('category', category);

    const { data, error } = await query;

    if (error) {
        menuContainer.innerHTML = `<p class='text-center text-red-500'>حدث خطأ في تحميل القائمة.</p>`;
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
                    data-id="${item.id}" data-name="${item.name}" data-price="${item.price}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
    `).join('') : "<p class='text-center col-span-full text-gray-500'>لا توجد أصناف في هذا القسم حالياً.</p>";

    updateCartCount();
}

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
    
    // تحسين تجربة المستخدم: وميض بسيط أو تحديث للأيقونة بدلاً من الـ alert المزعج
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

document.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    document.getElementById('menu-items')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const { id, name, price } = btn.dataset;
            addToCart(id, name, parseFloat(price));
        }
    });
});
