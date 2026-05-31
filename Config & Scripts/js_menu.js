// 1. الدالة الأساسية لجلب وعرض الأصناف
async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    let query = window.supabase.from('items').select('*');
    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
        console.error("خطأ في جلب البيانات من Supabase:", error);
        return;
    }

    menuContainer.innerHTML = ""; 
    if (!data || data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center'>لا توجد أصناف في هذا القسم.</p>";
    } else {
        data.forEach(item => {
            // استخدام دالة الإضافة مباشرة
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                    <h3 class="font-bold">${item.name}</h3>
                    <p>السعر: ${item.price} ريال</p>
                    <button onclick="addToCart('${item.id}', '${item.name.replace(/'/g, "\\'")}', ${item.price})" 
                            class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">إضافة للسلة</button>
                </div>
            `;
        });
    }
    updateCartCount();
}

// 2. دالة الإضافة للسلة (مُعدلة لتكون أكثر دقة)
function addToCart(id, name, price) {
    // جلب السلة الحالية
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // إضافة الصنف
    cart.push({ id, name, price });
    
    // الحفظ في localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    console.log("تم إضافة الصنف. السلة الحالية:", cart);
    
    alert("تمت إضافة " + name + " للسلة!");
    updateCartCount();
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
    updateCartCount();
});
