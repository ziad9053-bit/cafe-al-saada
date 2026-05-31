async function loadMenu() {
    // [تنبيه: نقوم بجلب المنتجات المتاحة فقط التي قيمتها true في عمود is_available]
    const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('is_available', true); // [تنبيه: هذا يضمن عدم عرض المنتجات غير المتاحة]

    if (error) {
        console.error("خطأ في جلب القائمة:", error);
        return;
    }

    const menuContainer = document.getElementById('menu-items');
    if (!menuContainer) return;

    menuContainer.innerHTML = "";
    
    data.forEach(item => {
        menuContainer.innerHTML += `
            <div class="bg-white p-4 shadow rounded border">
                <h3 class="font-bold">${item.name}</h3>
                <p>${item.price} ريال</p>
                <button onclick="addToCart('${item.id}')" class="bg-blue-500 text-white p-2 rounded mt-2">إضافة للسلة</button>
            </div>
        `;
    });
}
