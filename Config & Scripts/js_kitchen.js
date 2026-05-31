async function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    // التأكد من أن supabase متاح عالمياً
    if (!window.supabase) {
        console.error("مكتبة Supabase غير محملة!");
        return;
    }

    const { data, error } = await window.supabase
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("خطأ في جلب البيانات:", error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center bg-white p-8 rounded-xl shadow">لا توجد طلبات معلقة حالياً.</p>';
        return;
    }

    container.innerHTML = data.map(order => `
        <div class="bg-white p-6 rounded-xl shadow-lg border-r-4 border-yellow-500">
            <h2 class="text-xl font-bold">طاولة رقم: ${order.table_number || 'غير معروف'}</h2>
            <ul class="my-4 text-gray-700">
                ${Array.isArray(order.items) ? order.items.map(item => `<li>${item.name} × ${item.quantity}</li>`).join('') : '<li>لا توجد أصناف</li>'}
            </ul>
            <button onclick="markAsDone('${order.id}')" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
                تم التحضير
            </button>
        </div>
    `).join('');
}

async function markAsDone(orderId) {
    const { error } = await window.supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);
        
    if (error) {
        console.error("خطأ أثناء التحديث:", error);
    } else {
        loadOrders(); 
    }
}

// التشغيل الأولي والتحديث التلقائي
loadOrders();
setInterval(loadOrders, 10000);
