async function loadMenu() {
    // 1. تحقق: هل الصفحة الحالية تحتوي على مكان لعرض الأصناف؟
    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) {
        console.log("الصفحة الحالية لا تتطلب تحميل المنيو.");
        return; 
    }

    console.log("جاري جلب الأصناف...");
    const { data, error } = await window.supabase.from('items').select('*');
    
    if (error) {
        console.error("خطأ من Supabase:", error);
        return;
    }

    menuContainer.innerHTML = ""; // تفريغ
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

// تشغيل عند التحميل
loadMenu();
