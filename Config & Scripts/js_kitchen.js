// Config & Scripts/js_kitchen.js

// [تنبيه: ضع رابط المشروع الخاص بك هنا]
// [تنبيه: ضع مفتاح الـ API العام الخاص بمشروعك هنا]
// [تنبيه: هذا الملف يعتمد على متغير 'supabase' المعرف في js_supabase.js]

async function loadKitchenOrders() {
    // [تنبيه: جلب الطلبات من جدول order_items مع معلومات المنتجات المرتبطة]
    const { data, error } = await supabase
        .from('order_items')
        .select(`
            id,
            table_no,
            items (name),
            status
        `)
        .neq('status', 'completed'); // [تنبيه: جلب الطلبات غير المكتملة فقط]

    if (error) {
        console.error("خطأ في جلب طلبات المطبخ:", error);
        return;
    }

    const container = document.getElementById('kitchen-orders');
    container.innerHTML = "";

    data.forEach(order => {
        container.innerHTML += `
            <div class="bg-white p-6 shadow-lg rounded-lg border-r-4 border-blue-500">
                <h2 class="text-xl font-bold">طاولة رقم: ${order.table_no}</h2>
                <p class="text-lg">الطلب: ${order.items ? order.items.name : "غير معروف"}</p>
                <button onclick="markAsComplete('${order.id}')" class="mt-4 bg-green-500 text-white px-4 py-2 rounded">
                    تم التحضير
                </button>
            </div>
        `;
    });
}

// [تنبيه: دالة لتحديث حالة الطلب عند ضغط الباريستا على زر "تم التحضير"]
async function markAsComplete(orderId) {
    const { error } = await supabase
        .from('order_items')
        .update({ status: 'completed' })
        .eq('id', orderId);

    if (!error) {
        loadKitchenOrders(); // [تنبيه: إعادة تحميل القائمة بعد التحديث]
    }
}

// [تنبيه: تحميل الطلبات عند فتح الصفحة]
loadKitchenOrders();
