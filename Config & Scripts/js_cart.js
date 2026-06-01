/**
 * ملف: js_cart.js (النسخة النهائية والمحصنة)
 */

// 1. جلب بيانات السلة مع تنظيف البيانات التالفة
function getCart() {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("خطأ في قراءة بيانات السلة، يتم إعادة تعيينها:", e);
        localStorage.removeItem('cart');
        return [];
    }
}

// 2. عرض السلة
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

// 3. تحديث الكمية (مع التأكد من تحديث واجهة السلة فوراً)
function updateQty(index, change) {
    let cart = getCart();
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    // إذا كان لديك دالة لتحديث الشارة (Badge) في الشريط السفلي، استدعها هنا:
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

// 4. تأكيد الطلب (النسخة المحصنة)
async function confirmOrder() {
    const btn = document.getElementById('confirm-btn');
    if (typeof window.supabase === 'undefined') return alert("جاري تهيئة النظام، يرجى الانتظار...");

    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    // منع الضغط المتكرر
    btn.disabled = true;
    btn.innerText = "جاري الإرسال...";

    const orderData = {
        table_no: parseInt(tableNo),
        items: cart, // Supabase يتعامل مع المصفوفات مباشرة إذا كان العمود jsonb
        status: 'pending'
    };

    const { data, error } = await window.supabase.from('orders').insert([orderData]).select('id');

    if (error) {
        btn.disabled = false;
        btn.innerText = "تأكيد الطلب";
        console.error("خطأ Supabase:", error);
        return alert("خطأ في الإرسال: " + error.message);
    }

    // النجاح
    localStorage.removeItem('cart');
    alert("تم إرسال طلبك بنجاح! سيتم تحويلك للصفحة الرئيسية.");
    window.location.href = "index.html"; // أو أي صفحة تريدها
}

// التشغيل
window.addEventListener('DOMContentLoaded', () => {
    renderCart();
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmOrder);
});
