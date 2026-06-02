/**
 * ملف: js_kitchen.js (النسخة النهائية المتوافقة مع status: 'confirmed')
 */

async function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    if (!window.supabase) return console.error("Supabase غير محمل!");

    // جلب الطلبات التي حالتها 'confirmed' حصراً حسب إعدادات القاعدة لديك
    const { data, error } = await window.supabase
        .from('orders')
        .select('*')
        .eq('status', 'confirmed') 
        .order('created_at', { ascending: false });

    if (error) {
        console.error("خطأ جلب البيانات:", error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center bg-white p-8 rounded-xl shadow">لا توجد طلبات مؤكدة حالياً.</p>';
        return;
    }

    container.innerHTML = data.map(order => `
        <div class="bg-white p-6 rounded-xl shadow-lg border-r-4 border-yellow-500">
            <h2 class="text-xl font-bold">طاولة رقم: ${order.table_no || '---'}</h2>
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
    // تحديث الحالة لـ completed لإخفائها من واجهة المطبخ
    const { error } = await window.supabase
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);
        
    if (error) {
        console.error("خطأ التحديث:", error);
        alert("فشل تحديث حالة الطلب، يرجى المحاولة مرة أخرى.");
    }
    // لا حاجة لاستدعاء loadOrders() هنا، الـ Realtime سيتكفل بالتحديث فوراً
}

function setupRealtime() {
    // الاستماع لأي تغيير في جدول الأوردرات
    window.supabase.channel('kitchen_orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
            console.log("تغيير في قاعدة البيانات:", payload);
            loadOrders(); 
        }).subscribe();
}

// تنفيذ أولي
loadOrders();
setupRealtime();
// تحديث احتياطي كل دقيقة
setInterval(loadOrders, 60000);
