async function loadMenu() {
    // 1. البحث عن العنصر
    const menuContainer = document.getElementById('menu-items');
    
    // 2. إذا لم نجد العنصر (نحن في صفحة الترحيب أو غيرها)، نتوقف بصمت دون إظهار أخطاء
    if (!menuContainer) {
        console.log("نحن في صفحة الترحيب، لا حاجة لعرض القائمة.");
        return; 
    }

    console.log("جاري جلب الأصناف...");
    const { data, error } = await window.supabase.from('items').select('*');
    
    if (error) {
        console.error("خطأ من Supabase:", error);
        return;
    }

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
}
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // التحديث الفوري للرقم
    updateCartCount();
    alert(`تمت إضافة ${name}. عدد العناصر في السلة: ${cart.length}`);
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = cart.length;
}
// تشغيل الدالة
loadMenu();
