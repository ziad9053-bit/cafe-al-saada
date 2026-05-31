async function loadMenu() {
    console.log("جاري جلب الأصناف...");
    const { data, error } = await window.supabase.from('items').select('*');
    
    if (error) {
        console.error("خطأ:", error);
        return;
    }

    // هنا نقوم بالوصول لعنصر القائمة في صفحة الـ HTML
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) {
        console.error("لم يتم العثور على عنصر menu-items في صفحة HTML");
        return;
    }

    menuContainer.innerHTML = ""; // تفريغ القائمة قبل العرض
    
    data.forEach(item => {
        // [تنبيه: تأكد أن الأسماء (item.name, item.price) تطابق أعمدة جدولك]
        menuContainer.innerHTML += `
            <div class="menu-item" style="border: 1px solid #ccc; padding: 10px; margin: 10px;">
                <h3>${item.name}</h3>
                <p>السعر: ${item.price} ريال</p>
                <button onclick="addToCart('${item.id}')">إضافة للسلة</button>
            </div>
        `;
    });
}

// تشغيل الدالة عند تحميل الصفحة
loadMenu();
