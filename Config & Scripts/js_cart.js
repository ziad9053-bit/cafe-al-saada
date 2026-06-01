/**
 * ملف: js_cart.js (النسخة النهائية والمحصنة)
 */

window.addEventListener('DOMContentLoaded', () => {
    // التحقق من وجود طلب معلق عند تحميل الصفحة
    const pendingOrderId = localStorage.getItem('pendingOrderId');
    if (pendingOrderId) {
        showWaitScreen(pendingOrderId);
        // نستخدم حلقة انتظار بسيطة في حال تأخر Supabase
        const checkSupabase = setInterval(() => {
            if (window.supabase) {
                clearInterval(checkSupabase);
                monitorOrderStatus(pendingOrderId);
            }
        }, 500);
    } else {
        renderCart();
    }
    
    // ربط الزر برمجياً لضمان عدم حدوث خطأ onclick
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.removeEventListener('click', confirmOrder); // تنظيف أي مستمع قديم
        confirmBtn.addEventListener('click', confirmOrder);
    }
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function updateQty(index, change) {
    let cart = getCart();
    cart[index].quantity = (parseInt(cart[index].quantity) || 1) + change;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    const cart = getCart();
    let total = 0;

    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center py-10'>السلة فارغة حالياً.</p>";
        if(totalEl) totalEl.innerText = "0 ريال";
        return;
    }

    container.innerHTML = cart.map((item, index) => {
        total += (parseFloat(item.price) * item.quantity);
        return `
            <div class="bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-gray-800">${item.name}</h3>
                    <p class="text-orange-600 font-bold">${item.price} ريال</p>
                </div>
                <div class="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                    <button onclick="updateQty(${index}, -1)" class="text-xl font-bold px-2 text-gray-600">-</button>
                    <span class="font-bold w-6 text-center">${item.quantity}</span>
                    <button onclick="updateQty(${index}, 1)" class="text-xl font-bold px-2 text-gray-600">+</button>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total + " ريال";
}

async function confirmOrder() {
    if (typeof window.supabase === 'undefined') {
        return alert("جاري تهيئة النظام، يرجى الانتظار ثانية.");
    }

    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    const { data, error } = await window.supabase.from('orders').insert([
        { table_number: parseInt(tableNo), items: cart, status: 'pending' }
    ]).select();

    if (error) return alert("خطأ في الإرسال: " + error.message);

    const orderId = data[0].id;
    localStorage.removeItem('cart');
    localStorage.setItem('pendingOrderId', orderId);

    showWaitScreen(orderId);
    monitorOrderStatus(orderId);
}

function showWaitScreen(orderId) {
    document.body.innerHTML = `
        <div class="h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
            <div id="status-card" class="w-full max-w-sm bg-amber-500 p-8 rounded-3xl shadow-xl text-white transition-colors duration-1000">
                <h2 class="text-2xl font-bold mb-4">شكراً لاختيارك لنا! ☕</h2>
                <div id="qrcode" class="my-6 bg-white p-4 rounded-xl flex justify-center"></div>
                <p class="text-sm font-bold">رقم الطلب: #${orderId}</p>
                <p class="text-sm mt-2">انتظر تحول الكود للأخضر عند اكتمال الطلب</p>
            </div>
        </div>
    `;

    if (typeof QRCode !== 'undefined') {
        new QRCode(document.getElementById("qrcode"), {
            text: `ORDER_ID:${orderId}`,
            width: 150, height: 150
        });
    }
}

function monitorOrderStatus(orderId) {
    if (!window.supabase) return;

    const channel = window.supabase.channel('order_update')
        .on('postgres_changes', { 
            event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` 
        }, (payload) => {
            if (payload.new.status === 'completed') {
                const card = document.getElementById('status-card');
                if(card) {
                    card.classList.replace('bg-amber-500', 'bg-green-600');
                    card.querySelector('h2').innerText = "طلبك جاهز! 🎉";
                    card.querySelector('p:last-child').innerText = "شكراً لانتظارك.";
                }
                localStorage.removeItem('pendingOrderId');
                channel.unsubscribe();
            }
        }).subscribe();
}
