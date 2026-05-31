// دالة لتحديث عداد السلة في أي صفحة
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        badge.innerText = cart.length;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    
    console.log("محتويات السلة الحالية:", cart); // هذا السطر سيخبرنا هل البيانات موجودة أم لا

    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>سلتك فارغة.</p>";
        return;
    }

    container.innerHTML = "";
    cart.forEach((item, index) => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <span class="font-bold">${item.name || "صنف غير معروف"}</span>
                <span class="text-gray-600">${item.price ? item.price + ' ريال' : ''}</span>
            </div>
        `;
    });
});
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
