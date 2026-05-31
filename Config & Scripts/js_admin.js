// Config & Scripts/js_admin.js

// [تنبيه: دالة لجلب وعرض الأصناف]
async function fetchItems() {
    const { data, error } = await supabase
        .from('items')
        .select('*');

    if (error) {
        console.error("خطأ في جلب الأصناف:", error);
        return;
    }

    const list = document.getElementById('items-list');
    list.innerHTML = ""; // تفريغ الجدول

    data.forEach(item => {
        list.innerHTML += `
            <tr class="border-b">
                <td class="p-2">${item.name}</td>
                <td class="p-2">${item.price} ريال</td>
            </tr>
        `;
    });
}

// [تنبيه: تحديث دالة addItem لتشغيل fetchItems بعد الإضافة]
async function addItem() {
    // ... (الكود السابق للإضافة هنا) ...
    // بعد نجاح الإضافة، أضف هذا السطر:
    await fetchItems(); 
}

// [تنبيه: تشغيل جلب البيانات عند تحميل الصفحة]
fetchItems();
