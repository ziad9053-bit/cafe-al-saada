async function loadMenu() {
    const menuContainer = document.getElementById('menu-items');
    
    // 1. اختبار الوجود
    if (!menuContainer) {
        console.warn("خطأ: عنصر menu-items غير موجود في هذه الصفحة!");
        return;
    }

    // 2. محاولة الجلب
    console.log("جاري محاولة الاتصال بـ Supabase...");
    const { data, error } = await window.supabase.from('items').select('*');

    // 3. كشف المشكلة
    if (error) {
        console.error("فشل الاتصال بـ Supabase. تفاصيل الخطأ:", error);
        menuContainer.innerHTML = `<p style="color:red;">خطأ في الاتصال: ${error.message}</p>`;
        return;
    }

    if (!data || data.length === 0) {
        console.log("تم الاتصال بنجاح، لكن الجدول فارغ!");
        menuContainer.innerHTML = "<p>لا توجد أصناف حالياً.</p>";
        return;
    }

    console.log("تم جلب الأصناف بنجاح:", data);

    // 4. العرض
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

loadMenu();

    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('cat'); 

    let query = window.supabase.from('items').select('*');
    if (category) {
        query = query.eq('category', category);
    }

    const { data, error } = await query;
    if (error) { console.error(error); return; }

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
    updateCartCount(); // تحديث العداد
}

// دالة الإضافة للسلة
function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ id, name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert("تمت إضافة " + name + " للسلة!");
}

function updateCartCount() {
    const badge = document.getElementById('cart-badge');
    if (badge) badge.innerText = JSON.parse(localStorage.getItem('cart') || '[]').length;
}

loadMenu();
