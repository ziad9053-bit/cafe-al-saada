/**
 * ملف: js_kitchen.js
 * الوظيفة: إدارة طلبات المطبخ وجلبها من Supabase
 */

async function loadKitchenOrders() {
    const container = document.getElementById('kitchen-orders');
    if (!container) return;

    // جلب الطلبات غير المكتملة
    const { data, error } = await window.supabase
        .from('orders')
        .select('*')
        .neq('status', 'completed')
        .order('created_at', { ascending: true });

    if (error) {
        console.error("خطأ في جلب طلبات المطبخ:", error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = "<p class='text-center text-gray-500 mt-10'>لا توجد طلبات جديدة حالياً.</p>";
        return;
    }

    container.innerHTML = data.map(order => {
        // التحقق من وجود مصفوفة items لتجنب أي خطأ
        const items = order.items || [];
        const itemsList = items.map(i => `<li class="mb-1">${i.name} × ${i.quantity || 1}</li>`).join('');
        
        return `
            <div class="bg-white p-6 shadow-md rounded-xl border-r-8 border-yellow-500 hover:shadow-lg transition-shadow">
                <div class="flex justify-between items-center mb-4">
                    <h2 class="text-2xl font-bold text-gray-800">طاولة رقم: ${order.table_no || 'غير محددة'}</h2>
                    <span class="text-xs text-gray-400 font-mono">${new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <ul class="my-4 text-lg text-gray-700 list-disc list-inside bg-gray-50 p-3 rounded-lg">
                    ${itemsList}
                </ul>
                <button onclick="markAsComplete('${order.id}')" 
                        class="w-full mt-2 bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-all active:scale-95">
                    تم التحضير
                </button>
            </div>
        `;
    }).join('');
}

async function markAsComplete(orderId) {
    // إضافة تأكيد بسيط
    if (!confirm('هل تأكدت من تحضير هذا الطلب؟')) return;

    const { error } = await window.supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);

    if (!error) {
        loadKitchenOrders(); 
    } else {
        console.error("خطأ التحديث:", error);
        alert("حدث خطأ أثناء تحديث الطلب، حاول مجدداً.");
    }
}

// تشغيل عند فتح الصفحة
loadKitchenOrders();

// تحديث تلقائي كل 10 ثوانٍ
setInterval(loadKitchenOrders, 10000);
