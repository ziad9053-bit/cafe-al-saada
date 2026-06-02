/**
 * ملف: js_kitchen.js (النسخة النهائية - استقرار كامل)
 */

async function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    if (!window.supabase) return console.error("Supabase غير محمل!");

    // قمنا بإزالة .eq('status', 'pending') مؤقتاً للتأكد من جلب البيانات، 
    // إذا ظهرت الطلبات، يمكنك إعادة الشرط بعد التأكد من أن الحالة في القاعدة هي فعلاً 'pending'
    const { data, error } = await window.supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) return console.error("خطأ جلب البيانات:", error);

    // تصفية البيانات برمجياً (أضمن من التصفية في الـ Query إذا كانت الحالة تختلف)
    const pendingOrders = data ? data.filter(o => o.status === 'pending' || o.status === 'confirmed') : [];

    if (pendingOrders.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center bg-white p-8 rounded-xl shadow">لا توجد طلبات معلقة حالياً.</p>';
        return;
    }

    container.innerHTML = pendingOrders.map(order => `
        <div class="bg-white p-6 rounded-xl shadow-lg border-r-4 border-yellow-500">
            <h2 class="text-xl font-bold">طاولة رقم: ${order.table_no || 'غير معروف'}</h2>
            <p class="text-sm text-gray-400">كود الطلب: ${order.order_code || '---'}</p>
            <ul class="my-4 text-gray-700">
                ${Array.isArray(order.items) ? order.items.map(item => `<li>${item.name} × ${item.quantity}</li>`).join('') : '<li>لا توجد أصناف</li>'}
            </ul>
            <button onclick="markAsDone('${order.id}')" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                تم التحضير ✅
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
        console.error("خطأ التحديث:", error);
        alert("فشل تحديث الحالة");
    } else {
        loadOrders(); 
    }
}

function setupRealtime() {
    // تفعيل الاستماع لكل التغييرات (Insert & Update) لضمان ظهور الطلب فوراً وتحديثه
    window.supabase.channel('kitchen_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        () => {
            loadOrders(); 
        }).subscribe();
}

// تنفيذ أولي
loadOrders();
setupRealtime();
setInterval(loadOrders, 30000); // تحديث احتياطي كل 30 ثانية
