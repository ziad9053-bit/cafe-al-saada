/**
 * ملف: js_cart.js - النسخة المصححة للعمل مع LocalStorage
 */

// دالة لجلب البيانات من السلة بضمان
function getCart() {
    const data = localStorage.getItem('cart');
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("خطأ في قراءة بيانات السلة:", e);
        return [];
    }
}

// دالة عرض السلة مع معالجة الأخطاء
function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const cart = getCart();

    if (!container) return;

    if (!cart || cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center py-10'>السلة فارغة حالياً.</p>";
        if(totalEl) totalEl.innerText = "0 ريال";
        return;
    }

    let total = 0;
    container.innerHTML = cart.map((item, index) => {
        const qty = parseInt(item.quantity) || 1;
        const price = parseFloat(item.price) || 0;
        total += (price * qty);
        
        return `
            <div class="bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-gray-800">${item.name}</h3>
                    <p class="text-orange-600 font-bold">${price} ريال</p>
                </div>
                <div class="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                    <button onclick="updateQty(${index}, -1)" class="text-xl font-bold px-2 text-gray-600">-</button>
                    <span class="font-bold w-6 text-center">${qty}</span>
                    <button onclick="updateQty(${index}, 1)" class="text-xl font-bold px-2 text-gray-600">+</button>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total + " ريال";
}

// دالة تحديث الكمية
function updateQty(index, change) {
    let cart = getCart();
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

// دالة تأكيد الطلب المحدثة (مع table_no)
async function confirmOrder() {
    if (typeof window.supabase === 'undefined') return alert("جاري تهيئة النظام...");

    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    const orderData = {
        table_no: parseInt(tableNo),
        items: JSON.parse(JSON.stringify(cart)),
        status: 'pending'
    };

    const { data, error } = await window.supabase.from('orders').insert([orderData]).select('id');

    if (error) {
        console.error("خطأ Supabase:", error);
        return alert("خطأ في الإرسال: " + error.message);
    }

    localStorage.removeItem('cart');
    alert("تم إرسال طلبك بنجاح!");
    window.location.reload();
}

// التشغيل عند التحميل
window.addEventListener('DOMContentLoaded', () => {
    // تنظيف مؤقت إذا لزم الأمر (يمكن إزالة هذا السطر لاحقاً)
    if(localStorage.getItem('pendingOrderId')) {
        // يمكنك إضافته هنا إذا كنت تريد مراجعة الطلب المعلق
    }
    renderCart();
    
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmOrder);
});
