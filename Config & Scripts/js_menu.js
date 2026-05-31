// 1. الدالة الأساسية لجلب وعرض الأصناف
async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    // تحديد التصنيف من الرابط (مثلاً: menu.html?cat=hot)
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

   function addToCart(id, name, price) {
    console.log("جاري إضافة الصنف:", { id, name, price }); // هذا السطر سيكشف لنا الحقيقة
    
    if (!id || !name) {
        alert("خطأ: بيانات الصنف غير مكتملة!");
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    alert("تمت إضافة " + name + " للسلة!");
}

    const { data, error } = await query;

    if (error) {
        console.error("خطأ في جلب البيانات:", error);
        return;
    }

    // عرض الأصناف
    menuContainer.innerHTML = ""; 
    if (data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center'>لا توجد أصناف في هذا القسم.</p>";
    } else {
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
    
    // تحديث العداد
    updateCartCount();
}

// 2. دالة الإضافة للسلة
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("تمت إضافة " + name + " للسلة!");
}

// 3. دالة تحديث العداد
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        badge.innerText = cart.length;
    }
}

// 4. التشغيل عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', () => {
    loadMenu();
});
