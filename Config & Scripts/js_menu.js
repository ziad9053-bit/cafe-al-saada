// Config & Scripts/js_menu.js

// [تنبيه: هذا الكود لا يحتاج مفاتيح إضافية، يعتمد على supabase المعرف في js_supabase.js]

async function loadMenu() {
    const { data, error } = await supabase
        .from('items') // اسم جدول المنتجات
        .select('*');

    if (error) {
        console.error("خطأ في جلب المنيو:", error);
        return;
    }

    const container = document.getElementById('menu-container');
    data.forEach(item => {
        container.innerHTML += `
            <div class="bg-white p-4 rounded shadow">
                <h2 class="font-bold">${item.name}</h2>
                <p>${item.price} ريال</p>
                <button onclick="addToCart('${item.id}')" class="bg-green-500 text-white px-4 py-2 mt-2 rounded">إضافة</button>
            </div>
        `;
    });
}

// تنفيذ الدالة عند تحميل الصفحة
loadMenu();
