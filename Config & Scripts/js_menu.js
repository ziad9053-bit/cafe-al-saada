// دالة لتحديث عداد السلة في أي صفحة
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        badge.innerText = cart.length;
    }
}

// تشغيل العداد عند تحميل أي صفحة
window.addEventListener('DOMContentLoaded', updateCartCount);
async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    // 1. تحديد التصنيف من الرابط (مثلاً: menu.html?cat=hot)
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    console.log("جاري جلب الأصناف للتصنيف:", category || "الكل");

    // 2. بناء الطلب
    let query = window.supabase.from('items').select('*');
    
    // إذا كان هناك تصنيف في الرابط، قم بالفلترة
    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("خطأ:", error);
        return;
    }

    // 3. عرض الأصناف
    menuContainer.innerHTML = ""; 
    data.forEach(item => {
        menuContainer.innerHTML += `
            <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                <h3 class="font-bold">${item.name}</h3>
                <p>السعر: ${item.price} ريال</p>
                <button onclick="addToCart('${item.id}', '${item.name}', ${item.price})" 
                        class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">إضافة للسلة</button>
            </div>
        `;
    });
    
    // تحديث رقم السلة فوراً بعد التحميل
    updateCartCount();
}
