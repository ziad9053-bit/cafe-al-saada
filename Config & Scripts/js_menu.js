/**
 * ملف: js_menu.js
 * الوظيفة: جلب الأصناف من Supabase، عرضها، وإدارة سلة المشتريات محلياً
 */

async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    // جلب البيانات من Supabase
    let query = window.supabase.from('items').select('*');
    if (category) query = query.eq('category', category);

    const { data, error } = await query;
    if (error) { 
        console.error("خطأ Supabase:", error); 
        return; 
    }

    menuContainer.innerHTML = ""; 
    if (!data || data.length === 0) {
        menuContainer.innerHTML = "<p class='text-center'>لا توجد أصناف.</p>";
    } else {
        data.forEach(item => {
            // ترميز الاسم لضمان سلامة البيانات في الـ HTML
            const encodedName = encodeURIComponent(item.name);
            
            menuContainer.innerHTML += `
                <div class="menu-item p-4 border rounded-xl bg-white shadow-sm">
                    <h3 class="font-bold">${item.name}</h3>
                    <p>السعر: ${item.price} ريال</p>
                    <button class="add-to-cart-btn mt-2 bg-green-600 text-white px-4 py-2 rounded-lg" 
                            data-id="${item.id}" 
                            data-name="${encodedName}" 
                            data-price="${item.price}">
                            إضافة للسلة
                    </button>
                </div>
            `;
        });
        
        // ربط الأحداث (Event Delegation)
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const { id, name, price } = e.target.dataset;
                addToCart(id, decodeURIComponent(name), parseFloat(price));
            });
        });
    }
    updateCartCount();
}

/**
 * دالة إضافة صنف للسلة مع منطق الدمج الذكي للكميات
 */
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // البحث عن الصنف إذا كان موجوداً مسبقاً في السلة
    const existingItem = cart.find(item => item.id === id);
    
    if (existingItem) {
        // زيادة الكمية إذا وجد الصنف
        existingItem.quantity = (parseInt(existingItem.quantity) || 1) + 1;
    } else {
        // إضافة صنف جديد مع كمية أولية 1
        cart.push({ id, name, price, quantity: 1 });
    }
    
    // حفظ البيانات في localStorage و window.name للمزامنة
    const cartString = JSON.stringify(cart);
    localStorage.setItem('cart', cartString);
    window.name = cartString; 
    
    alert("تمت إضافة " + name + " للسلة!");
    updateCartCount();
}

/**
 * دالة تحديث عداد السلة في واجهة المستخدم
 */
function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
        // حساب مجموع الكميات الإجمالي
        const totalItems = cart.reduce((sum, item) => sum + (parseInt(item.quantity) || 1), 0);
        badge.innerText = totalItems;
    }
}

// تشغيل الوظائف عند تحميل الصفحة
window.addEventListener('DOMContentLoaded', loadMenu);
