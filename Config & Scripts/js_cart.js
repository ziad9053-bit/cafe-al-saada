/**
 * ملف: js_cart.js (النسخة النهائية مع نظام التزامن)
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
    
    // التحقق النهائي من وجود الاتصال
    if (!window.supabase) return alert("نظام الطلب غير متصل، يرجى تحديث الصفحة.");

    const tableNo = document.getElementById('tableNo')?.value;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    btn.disabled = true;
    btn.innerText = "جاري الإرسال...";

    const { error } = await window.supabase
        .from('orders')
        .insert([{
            table_no: parseInt(tableNo),
            items: cart
        }]);

    if (error) {
        console.error("خطأ Supabase:", error);
        btn.disabled = false;
        btn.innerText = "تأكيد الطلب";
        return alert("خطأ في الإرسال: " + error.message);
    }

    localStorage.removeItem('cart');
    alert("تم إرسال طلبك بنجاح!");
    window.location.href = "index.html";
}

window.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('confirm-btn');
    if (btn) {
        // تعطيل الزر حتى يتم تحميل Supabase
        btn.disabled = true;
        btn.innerText = "جاري الاتصال...";
    }
    renderCart();
    document.getElementById('confirm-btn')?.addEventListener('click', confirmOrder);
});

// النظام الجديد: الاستماع لحدث جاهزية Supabase
window.addEventListener('supabaseReady', () => {
    const btn = document.getElementById('confirm-btn');
    if (btn) {
        btn.disabled = false;
        btn.innerText = "تأكيد الطلب";
    }
    console.log("تم تفعيل زر الطلب بنجاح.");
});
