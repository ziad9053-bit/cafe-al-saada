/**
 * ملف: js_kitchen.js
 * الوظيفة: إدارة طلبات المطبخ وجلبها من Supabase بشكل حي
 */

async function loadKitchenOrders() {
    const container = document.getElementById('kitchen-orders');
    if (!container) return;

    // جلب الطلبات غير المكتملة فقط
    const { data, error } = await window.supabase
        .from('orders') // تأكد أن الجدول اسمه 'orders'
        .select('*')
        .neq('status', 'completed')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("خطأ في جلب طلبات المطبخ:", error);
        return;
    }

    if (data.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500 mt-10'>لا توجد طلبات جديدة حالياً.</p>";
        return;
    }

    container.innerHTML = data.map(order => {
        // تحويل مصفوفة الأصناف إلى نص للعرض
        const itemsList = order.items.map(i => `<li>${i.name} × ${i.quantity || 1}</li>`).join('');
        
        return `
            <div class="bg-white p-6 shadow-md rounded-xl border-r-8 border-yellow-500 hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-center">
                    <h2 class="text-2xl font-bold">طاولة رقم: ${order.table_number}</h2>
                    <span class="text-sm text-gray-400">${new Date(order.created_at).toLocaleTimeString()}</span>
                </div>
                <ul class="my-4 text-lg text-gray-700 list-disc list-inside">
                    ${itemsList}
                </ul>
                <button onclick="markAsComplete('${order.id}')" 
                        class="w-full mt-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
                    تم التحضير
                </button>
            </div>
        `;
    }).join('');
}

async function markAsComplete(orderId) {
    const { error } = await window.supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

    if (!error) {
        loadKitchenOrders(); // تحديث فوري للقائمة
    } else {
        alert("حدث خطأ أثناء تحديث الطلب");
    }
}

// تحديث تلقائي للشاشة كل 10 ثوانٍ لضمان ظهور الطلبات الجديدة فور وصولها
setInterval(loadKitchenOrders, 10000);
loadKitchenOrders();
