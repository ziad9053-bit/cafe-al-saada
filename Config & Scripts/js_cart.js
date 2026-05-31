/**
 * ملف: js_cart.js
 * الوظيفة: إدارة عرض السلة، حذف الأصناف، وإرسال الطلب لـ Supabase
 */

// التأكد من تحميل الصفحة وتجهيز الأحداث
window.addEventListener('DOMContentLoaded', () => {
    renderCart();

    const confirmBtn = document.getElementById('confirm-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmOrder);
    }
});

// دالة تجميع الطلبات (منطق ذكي للدمج)
function getGroupedCart() {
    let cart = [];
    try {
        const rawData = localStorage.getItem('cart') || '[]';
        cart = JSON.parse(rawData);
    } catch (e) {
        cart = [];
    }

    return cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id);
        const quantity = parseInt(item.quantity) || 1;
        if (found) {
            found.quantity += quantity;
        } else {
            acc.push({ ...item, quantity });
        }
        return acc;
    }, []);
}

// دالة عرض السلة
function renderCart() {
    const container = document.getElementById('cart-items');
    if (!container) return;

    const groupedCart = getGroupedCart();

    if (groupedCart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة.</p>";
        return;
    }

    container.innerHTML = groupedCart.map((item) => `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border mb-2">
            <div>
                <h3 class="font-bold text-lg">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال × ${item.quantity}</p>
            </div>
            <button onclick="removeItem('${item.id}', '${item.name}')" 
                    class="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-100 transition">
                حذف
            </button>
        </div>
    `).join('');
}

// دالة الحذف
function removeItem(id, name) {
    if (!confirm(`هل أنت متأكد من حذف ${name} من السلة؟`)) return;

    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const updatedCart = cart.filter(item => item.id !== id);
    
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    renderCart(); // إعادة العرض فوراً بدلاً من تحميل الصفحة بالكامل
}

// دالة تأكيد الطلب
async function confirmOrder() {
    const tableInput = document.getElementById('tableNo');
    const tableNo = tableInput ? tableInput.value : null;
    const groupedCart = getGroupedCart();

    if (!tableNo) {
        alert("يرجى إدخال رقم الطاولة");
        return;
    }
    if (groupedCart.length === 0) {
        alert("السلة فارغة");
        return;
    }

    // إرسال البيانات (تأكد أن حقل 'table_number' في قاعدة البيانات يطابق هذا الاسم)
    const { error } = await window.supabase.from('orders').insert([
        { 
            table_number: parseInt(tableNo), 
            items: groupedCart, 
            status: 'pending' 
        }
    ]);

    if (error) {
        console.error("خطأ Supabase:", error);
        alert("خطأ في إرسال الطلب: " + error.message);
    } else {
        alert("تم إرسال طلبك للمطبخ بنجاح!");
        localStorage.removeItem('cart');
        window.location.href = 'menu.html';
    }
}
