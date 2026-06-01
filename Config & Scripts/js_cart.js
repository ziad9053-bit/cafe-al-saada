/**
 * ملف: js_cart.js (المعدل لدعم التحكم بالكمية)
 */

window.addEventListener('DOMContentLoaded', () => {
    renderCart();
    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) confirmBtn.addEventListener('click', confirmOrder);
});

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

// دالة تحديث الكمية (زيادة أو نقصان)
function updateQty(id, change) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    
    if (item) {
        item.quantity = (parseInt(item.quantity) || 1) + change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
}

function renderCart() {
    const container = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total'); // إذا أضفت هذا العنصر في HTML
    if (!container) return;

    const cart = getCart();
    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center py-10'>السلة فارغة حالياً.</p>";
        if(totalEl) totalEl.innerText = "0 ريال";
        return;
    }

    container.innerHTML = cart.map((item) => {
        total += (parseFloat(item.price) * (item.quantity || 1));
        return `
            <div class="bg-white p-4 rounded-2xl shadow-sm border flex items-center justify-between">
                <div>
                    <h3 class="font-bold text-gray-800">${item.name}</h3>
                    <p class="text-orange-600 font-bold">${item.price} ريال</p>
                </div>
                <div class="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-1">
                    <button onclick="updateQty('${item.id}', -1)" class="text-xl font-bold px-2 text-gray-600">-</button>
                    <span class="font-bold w-6 text-center">${item.quantity || 1}</span>
                    <button onclick="updateQty('${item.id}', 1)" class="text-xl font-bold px-2 text-gray-600">+</button>
                </div>
            </div>
        `;
    }).join('');

    if (totalEl) totalEl.innerText = total + " ريال";
}

async function confirmOrder() {
    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const cart = getCart();

    if (!tableNo) return alert("يرجى إدخال رقم الطاولة");
    if (cart.length === 0) return alert("السلة فارغة");

    const { error } = await window.supabase.from('orders').insert([
        { table_number: parseInt(tableNo), items: cart, status: 'pending' }
    ]);

    if (error) {
        alert("خطأ في إرسال الطلب: " + error.message);
    } else {
        alert("تم إرسال طلبك بنجاح!");
        localStorage.removeItem('cart');
        window.location.href = 'menu.html';
    }
}
