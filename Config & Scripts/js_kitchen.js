/**
 * ملف: js_kitchen.js (النسخة النهائية - معالجة صحيحة للبيانات)
 */

async function loadOrders() {
    const container = document.getElementById('orders-container');
    if (!container) return;

    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) {
        console.warn("جاري انتظار تهيئة Supabase...");
        return;
    }

    const { data, error } = await supabaseClient
        .from('orders')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) {
        console.error("خطأ جلب البيانات:", error);
        return;
    }

    if (!data || data.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center bg-white p-8 rounded-xl shadow">لا توجد طلبات جديدة حالياً.</p>';
        return;
    }

    container.innerHTML = data.map(order => {
        // معالجة البيانات: التأكد من تحويل النص إلى مصفوفة
        let items = order.items;
        try {
            if (typeof items === 'string') {
                items = JSON.parse(items);
            }
        } catch (e) {
            console.error("خطأ في تحليل الأصناف:", e);
            items = [];
        }
        const itemList = Array.isArray(items) ? items : [];

        return `
        <div class="bg-white p-6 rounded-xl shadow-lg border-r-4 border-yellow-500">
            <h2 class="text-xl font-bold">طاولة رقم: ${order.table_no || '---'}</h2>
            <p class="text-sm text-gray-400">كود الطلب: ${order.order_code || '---'}</p>
            <ul class="my-4 text-gray-700">
                ${itemList.length > 0 ? itemList.map(item => `<li>${item.name || 'صنف'} × ${item.quantity || 1}</li>`).join('') : '<li>لا توجد أصناف</li>'}
            </ul>
            <button onclick="markAsDone('${order.id}')" class="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-bold hover:bg-green-700 transition">
                تم التحضير ✅
            </button>
        </div>`;
    }).join('');
}

async function markAsDone(orderId) {
    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) return alert("النظام غير متصل!");
    
    const { error } = await supabaseClient
        .from('orders')
        .update({ status: 'completed' })
        .eq('id', orderId);
        
    if (error) {
        console.error("خطأ التحديث:", error);
        alert("فشل تحديث حالة الطلب.");
        return;
    }
    loadOrders();
}

function setupRealtime() {
    const supabaseClient =
        typeof window.getSupabaseClient === "function" ? window.getSupabaseClient() : null;
    if (!supabaseClient) return;
    
    supabaseClient.channel('kitchen_orders')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, 
        (payload) => {
            console.log("تغيير في قاعدة البيانات:", payload);
            loadOrders(); 
        }).subscribe();
}

// تنفيذ النظام عند اكتمال تحميل الصفحة
function startKitchen() {
    loadOrders();
    setupRealtime();
}

window.addEventListener('DOMContentLoaded', () => {
    if (window.getSupabaseClient?.()) {
        startKitchen();
    }
    window.addEventListener('supabaseReady', startKitchen);
    setInterval(loadOrders, 60000);
});
