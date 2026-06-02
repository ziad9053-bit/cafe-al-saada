/**
 * ملف: js_cart.js (النسخة المثالية - متوافقة مع قاعدة البيانات المحدثة)
 */

function getCart() {
    try {
        const data = localStorage.getItem('cart');
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("خطأ في قراءة بيانات السلة:", e);
        return [];
    }
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const cart = getCart();
    if (!container) return;

    if (!cart || cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center py-10'>السلة فارغة حالياً.</p>";
        if (totalEl) totalEl.innerText = "0 ريال";
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
            </div>`;
    }).join('');
    if (totalEl) totalEl.innerText = total + " ريال";
}

function updateQty(index, change) {
    let cart = getCart();
    if (!cart[index]) return;
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    if (typeof updateCartBadge === 'function') updateCartBadge();
}

async function confirmOrder() {
    const btn = document.getElementById('confirm-btn');
    if (typeof window.supabase === 'undefined') return alert("جاري تهيئة النظام...");

    const tableNo = document.getElementById('tableNo')?.value;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    btn.disabled = true;
    btn.innerText = "جاري الإرسال...";

    try {
        // بما أن القاعدة تملأ كل شيء (total_price, order_code, status) تلقائياً
        // فنحن نرسل فقط البيانات المطلوبة فعلياً لإتمام الطلب
        const { error } = await window.supabase
            .from('orders')
            .insert([{
                table_no: tableNo,
                items: cart
                // تم حذف status: 'pending' لأن القاعدة تضع 'confirmed' تلقائياً
            }]);

        if (error) throw error;

        localStorage.removeItem('cart');
        alert("تم إرسال طلبك بنجاح!");
        window.location.href = "index.html";

    } catch (err) {
        console.error("خطأ Supabase:", err);
        btn.disabled = false;
        btn.innerText = "تأكيد الطلب";
        alert("حدث خطأ أثناء الإرسال: " + (err.message || "يرجى المحاولة لاحقاً"));
    }
}

window.addEventListener('DOMContentLoaded', () => {
    renderCart();
    document.getElementById('confirm-btn')?.addEventListener('click', confirmOrder);
});
