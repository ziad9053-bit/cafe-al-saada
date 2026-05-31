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
            // ترميز الاسم لمنع تداخل علامات التنصيص التي تسبب الـ SyntaxError
            const encodedName = btoa(encodeURIComponent(item.name));
            
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                    <h3 class="font-bold">${item.name}</h3>
                    <p>السعر: ${item.price} ريال</p>
                    <button onclick="addToCart('${item.id}', '${encodedName}', ${item.price})" 
                            class="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg">إضافة للسلة</button>
                </div>
            `;
        });
    }
    updateCartCount();
}

// 2. دالة الإضافة للسلة (مُعدلة للمزامنة المزدوجة والموثوقية)
function addToCart(id, encodedName, price) {
    try {
        // فك الترميز للاسم
        const name = decodeURIComponent(atob(encodedName));
        
        // 1. جلب البيانات من localStorage أو المخزن الاحتياطي
        let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
        
        // 2. إضافة الصنف
        cart.push({ id, name, price });
        
        // 3. تحويل المصفوفة إلى نص (Stringify)
        const cartString = JSON.stringify(cart);
        
        // 4. الحفظ المزدوج
        localStorage.setItem('cart', cartString);
        window.name = cartString; 
        
        console.log("تم إضافة الصنف بنجاح. السلة الحالية:", cart);
        alert("تمت إضافة " + name + " للسلة!");
        updateCartCount();
        
    } catch (e) {
        console.error("خطأ أثناء إضافة الصنف:", e);
        alert("حدث خطأ أثناء إضافة الصنف.");
    }
}

// 3. دالة تحديث العداد
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
        badge.innerText = cart.length;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    loadMenu();
    updateCartCount();
});
