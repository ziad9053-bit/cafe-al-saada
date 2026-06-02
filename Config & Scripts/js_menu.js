/**
 * ملف: js_menu.js (النسخة النهائية مع نظام التشخيص)
 */

async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) {
        console.error("خطأ: Supabase غير معرف! تأكد من ملف dependencies.js");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat');

    try {
        // نجلب الأصناف المتاحة فقط
        const { data: allItems, error } = await supabaseClient
            .from('items')
            .select('*')
            .eq('is_available', true)
            .order('created_at', { ascending: false });

        if (error) {
            console.error("خطأ Supabase (قاعدة البيانات):", error);
            menuContainer.innerHTML = `<p class='text-center text-red-500 p-4'>خطأ في الاتصال: ${error.message}</p>`;
            return;
        }

        const items = Array.isArray(allItems) ? allItems : [];
        let filtered = items;

        // فلترة مرنة: تدعم العربية والإنجليزية مع اختلاف الكتابة
        if (category === 'hot') {
            const hotAliases = ['hot', 'ساخن', 'مشروبات ساخنة', 'قهوة', 'قهـوة'];
            filtered = items.filter(item => hotAliases.includes(String(item.category || '').trim().toLowerCase()));
        } else if (category === 'cold') {
            const coldAliases = ['cold', 'بارد', 'مشروبات باردة', 'عصير', 'عصائر'];
            filtered = items.filter(item => coldAliases.includes(String(item.category || '').trim().toLowerCase()));
        } else if (category === 'dessert') {
            const dessertAliases = ['dessert', 'حلى', 'حلويات'];
            filtered = items.filter(item => dessertAliases.includes(String(item.category || '').trim().toLowerCase()));
        }

        // إذا كانت فلترة التصنيف لم تُرجع شيئًا، اعرض الكل بدل شاشة فارغة
        if (category && filtered.length === 0 && items.length > 0) {
            filtered = items;
        }

        // التشخيص: هل البيانات فارغة؟
        if (filtered.length === 0) {
            console.log("تم الاتصال بنجاح، لكن الجدول فارغ أو لا توجد أصناف.");
            menuContainer.innerHTML = "<p class='text-center col-span-full text-gray-500 py-10'>لا توجد أصناف متاحة حالياً.</p>";
            return;
        }

        // عرض الأصناف
        menuContainer.innerHTML = filtered.map(item => `
        <div class="menu-item p-4 border border-amber-800/30 rounded-2xl bg-zinc-900 shadow-sm flex items-center gap-4 transition hover:border-amber-600/50">
            <img src="${item.image_url || 'https://via.placeholder.com/150'}" alt="${item.name}" 
                 class="w-20 h-20 object-cover rounded-xl border border-amber-800/40 flex-shrink-0">
            <div class="flex-grow min-w-0">
                <h3 class="font-bold text-amber-100 text-lg leading-tight">${item.name || 'غير معروف'}</h3>
                <p class="text-amber-400 font-bold mt-1">${parseFloat(item.price || 0)} ريال</p>
            </div>
            <button class="add-to-cart-btn bg-amber-600 text-black p-3 rounded-full hover:bg-amber-500 transition flex-shrink-0 shadow-sm" 
                    data-id="${item.id}" 
                    data-name="${item.name}" 
                    data-price="${item.price}" 
                    data-image="${item.image_url || ''}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
            </button>
        </div>
        `).join('');

        updateCartCount();
    } catch (err) {
        console.error("فشل جلب الأصناف:", err);
        menuContainer.innerHTML = "<p class='text-center text-red-500 p-4'>تعذر تحميل الأصناف. حاول تحديث الصفحة.</p>";
    }
}

function addToCart(id, name, price, imageUrl) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
    } else {
        cart.push({ id, name, price: parseFloat(price || 0), quantity: 1, image_url: imageUrl });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    badge.innerText = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 0), 0);
}

// تنفيذ التشغيل
document.addEventListener('DOMContentLoaded', () => {
    // محاولة التشغيل فوراً، ثم الاستماع للحدث
    loadMenu(); 
    window.addEventListener('supabaseReady', loadMenu);

    document.getElementById('menu-items')?.addEventListener('click', (e) => {
        const btn = e.target.closest('.add-to-cart-btn');
        if (btn) {
            const { id, name, price, image } = btn.dataset;
            addToCart(id, name, price, image);
        }
    });
});
