window.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('cart-items');
    if (!container) return;

    // جلب البيانات ومعالجتها
    let cart = [];
    try {
        const rawData = localStorage.getItem('cart') || window.name || '[]';
        cart = JSON.parse(rawData);
    } catch (e) {
        cart = [];
    }

    // تجميع العناصر المتطابقة (بناءً على ID) لمنع التكرار في العرض
    const groupedCart = cart.reduce((acc, item) => {
        const found = acc.find(i => i.id === item.id);
        const quantity = parseInt(item.quantity) || 1;
        if (found) {
            found.quantity += quantity;
        } else {
            acc.push({ ...item, quantity });
        }
        return acc;
    }, []);

    if (groupedCart.length === 0) {
        container.innerHTML = "<p class='text-gray-500 text-center'>السلة فارغة.</p>";
        return;
    }

    // عرض العناصر
    container.innerHTML = groupedCart.map((item) => `
        <div class="bg-white p-4 rounded-lg shadow flex justify-between items-center border mb-2 transition-all">
            <div>
                <h3 class="font-bold text-lg">${item.name}</h3>
                <p class="text-gray-600">${item.price} ريال × ${item.quantity}</p>
            </div>
            <button onclick="removeItem('${item.id}', '${item.name}')" 
                    class="bg-red-50 text-red-600 px-3 py-1 rounded-lg font-bold hover:bg-red-100 transition-colors">
                حذف
            </button>
        </div>
    `).join('');
});

/**
 * دالة الحذف: تحذف جميع نسخ الصنف من الذاكرة المحلية
 */
function removeItem(id, name) {
    if (!confirm(`هل أنت متأكد من حذف ${name} من السلة؟`)) return;

    // جلب المصفوفة الخام وتصفيتها
    let cart = JSON.parse(localStorage.getItem('cart') || window.name || '[]');
    
    // إزالة كل العناصر التي تطابق هذا الـ ID
    const updatedCart = cart.filter(item => item.id !== id);
    
    // حفظ التغييرات
    const updatedData = JSON.stringify(updatedCart);
    localStorage.setItem('cart', updatedData);
    window.name = updatedData;
    
    location.reload(); 
}
